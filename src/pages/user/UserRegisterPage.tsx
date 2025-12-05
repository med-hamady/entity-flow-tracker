import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Lock, Mail, User, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UserRegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: '', // ✅ Nom correct pour correspondre à l'API
        first_name: '',
        last_name: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation côté client
        if (formData.password !== formData.password_confirm) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        if (formData.password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères.');
            return;
        }

        setIsLoading(true);

        try {
            // ✅ Envoi de la requête avec password_confirm inclus
            const response = await fetch('http://localhost:8000/api/auth/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    password_confirm: formData.password_confirm, // ✅ Ajouté
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                }),
            });
            console.log("register sending")

            const data = await response.json();

            if (response.ok) {
                // ✅ Sauvegarder les tokens dans localStorage
                if (data.tokens) {
                    localStorage.setItem('access_token', data.tokens.access);
                    localStorage.setItem('refresh_token', data.tokens.refresh);
                }

                // ✅ Sauvegarder les informations utilisateur
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                // Succès : afficher un toast et rediriger
                toast({
                    title: 'Compte créé avec succès',
                    description: `Bienvenue ${data.user?.first_name || data.user?.username} !`,
                });

                navigate('/dashboard');
            } else {
                // ✅ Gestion améliorée des erreurs selon le format de l'API
                if (data.password) {
                    // Erreur de validation du mot de passe
                    const passwordError = Array.isArray(data.password)
                        ? data.password.join(', ')
                        : data.password;
                    setError(passwordError);
                } else if (data.username) {
                    // Erreur de nom d'utilisateur (ex: déjà existant)
                    const usernameError = Array.isArray(data.username)
                        ? data.username.join(', ')
                        : data.username;
                    setError(`Nom d'utilisateur: ${usernameError}`);
                } else if (data.email) {
                    // Erreur d'email
                    const emailError = Array.isArray(data.email)
                        ? data.email.join(', ')
                        : data.email;
                    setError(`Email: ${emailError}`);
                } else if (data.error) {
                    setError(data.error);
                } else if (data.message) {
                    setError(data.message);
                } else {
                    // Erreur générale
                    const errorMessages = Object.entries(data)
                        .map(([key, value]) => {
                            if (Array.isArray(value)) {
                                return `${key}: ${value.join(', ')}`;
                            }
                            return `${key}: ${value}`;
                        })
                        .join('. ');
                    setError(errorMessages || 'Une erreur s\'est produite. Veuillez réessayer.');
                }
            }
        } catch (err) {
            console.error('Erreur lors de l\'inscription:', err);
            setError("Une erreur s'est produite. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    const passwordValid = formData.password.length >= 8;
    const passwordsMatch = formData.password === formData.password_confirm && formData.password_confirm.length > 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] bg-top"></div>

            <Card className="w-full max-w-md relative z-10 shadow-2xl border-0">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <UserPlus className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
                        <CardDescription>
                            Rejoignez Entity Flow Tracker
                        </CardDescription>
                    </div>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">Prénom</Label>
                                <Input
                                    id="first_name"
                                    type="text"
                                    placeholder="Jean"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Nom</Label>
                                <Input
                                    id="last_name"
                                    type="text"
                                    placeholder="Dupont"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">Nom d'utilisateur *</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="jean_dupont"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe *</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Au moins 8 caractères"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="pl-10"
                                    required
                                />
                                {formData.password.length > 0 && (
                                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${passwordValid ? 'text-green-500' : 'text-amber-500'}`}>
                                        {passwordValid ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                    </div>
                                )}
                            </div>
                            {formData.password.length > 0 && !passwordValid && (
                                <p className="text-xs text-amber-600">Au moins 8 caractères requis</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirm">Confirmer le mot de passe *</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password_confirm"
                                    type="password"
                                    placeholder="Répétez le mot de passe"
                                    value={formData.password_confirm}
                                    onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })}
                                    className="pl-10"
                                    required
                                />
                                {formData.password_confirm.length > 0 && (
                                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                                        {passwordsMatch ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex-col gap-4">
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                            disabled={isLoading || !passwordValid || !passwordsMatch}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Création...
                                </span>
                            ) : (
                                'Créer mon compte'
                            )}
                        </Button>

                        <div className="text-sm text-center text-muted-foreground">
                            Déjà un compte ?{' '}
                            <Link to="/login" className="text-emerald-600 hover:underline font-medium">
                                Se connecter
                            </Link>
                        </div>

                        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            ← Retour à l'accueil
                        </Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
