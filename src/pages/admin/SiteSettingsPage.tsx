import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
    Settings,
    Globe,
    Shield,
    Bell,
    Palette,
    Save,
    RotateCcw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SiteSettingsPage() {
    const { toast } = useToast();

    const [settings, setSettings] = useState({
        siteName: 'Entity Flow Tracker',
        siteDescription: 'Système de gestion du cycle de vie des entités',
        contactEmail: 'contact@entity-flow.com',
        enableNotifications: true,
        enableEmailAlerts: true,
        maintenanceMode: false,
        requireApproval: true,
        maxFileSize: '10',
        sessionTimeout: '30',
    });

    const handleSave = () => {
        toast({
            title: 'Paramètres sauvegardés',
            description: 'Les modifications ont été appliquées avec succès.',
        });
    };

    const handleReset = () => {
        setSettings({
            siteName: 'Entity Flow Tracker',
            siteDescription: 'Système de gestion du cycle de vie des entités',
            contactEmail: 'contact@entity-flow.com',
            enableNotifications: true,
            enableEmailAlerts: true,
            maintenanceMode: false,
            requireApproval: true,
            maxFileSize: '10',
            sessionTimeout: '30',
        });
        toast({
            title: 'Paramètres réinitialisés',
            description: 'Les valeurs par défaut ont été restaurées.',
        });
    };

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Settings className="h-8 w-8 text-slate-400" />
                        Paramètres du site
                    </h1>
                    <p className="text-slate-400">
                        Configurez les paramètres généraux de la plateforme
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={handleReset}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Réinitialiser
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-indigo-600 hover:bg-indigo-700 gap-2"
                    >
                        <Save className="h-4 w-4" />
                        Sauvegarder
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Globe className="h-5 w-5 text-indigo-400" />
                            Paramètres généraux
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Informations de base du site
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="siteName" className="text-slate-300">Nom du site</Label>
                            <Input
                                id="siteName"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="siteDescription" className="text-slate-300">Description</Label>
                            <Textarea
                                id="siteDescription"
                                value={settings.siteDescription}
                                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                className="bg-slate-700 border-slate-600 text-white"
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contactEmail" className="text-slate-300">Email de contact</Label>
                            <Input
                                id="contactEmail"
                                type="email"
                                value={settings.contactEmail}
                                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Bell className="h-5 w-5 text-amber-400" />
                            Notifications
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Gérez les alertes et notifications
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">Notifications in-app</p>
                                <p className="text-sm text-slate-400">Afficher les notifications dans l'application</p>
                            </div>
                            <Switch
                                checked={settings.enableNotifications}
                                onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">Alertes par email</p>
                                <p className="text-sm text-slate-400">Recevoir des alertes par email</p>
                            </div>
                            <Switch
                                checked={settings.enableEmailAlerts}
                                onCheckedChange={(checked) => setSettings({ ...settings, enableEmailAlerts: checked })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-400" />
                            Sécurité
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Paramètres de sécurité avancés
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">Mode maintenance</p>
                                <p className="text-sm text-slate-400">Restreindre l'accès au site</p>
                            </div>
                            <Switch
                                checked={settings.maintenanceMode}
                                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">Approbation requise</p>
                                <p className="text-sm text-slate-400">Valider les nouvelles inscriptions</p>
                            </div>
                            <Switch
                                checked={settings.requireApproval}
                                onCheckedChange={(checked) => setSettings({ ...settings, requireApproval: checked })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sessionTimeout" className="text-slate-300">Expiration de session (minutes)</Label>
                            <Input
                                id="sessionTimeout"
                                type="number"
                                value={settings.sessionTimeout}
                                onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* System Settings */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Palette className="h-5 w-5 text-purple-400" />
                            Système
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Configuration technique
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="maxFileSize" className="text-slate-300">Taille max. fichier (MB)</Label>
                            <Input
                                id="maxFileSize"
                                type="number"
                                value={settings.maxFileSize}
                                onChange={(e) => setSettings({ ...settings, maxFileSize: e.target.value })}
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                        </div>
                        <div className="p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                            <p className="text-sm text-slate-400 mb-2">Version de l'application</p>
                            <p className="text-white font-mono">v1.0.0</p>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                            <p className="text-sm text-slate-400 mb-2">Dernière sauvegarde</p>
                            <p className="text-white">04 Décembre 2024, 13:30</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
