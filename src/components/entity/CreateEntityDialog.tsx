import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const entityTypes = ['Document', 'Contrat', 'Facture', 'Rapport', 'Demande'];

interface CreateEntityDialogProps {
    onCreateEntity: (data: {
        name: string;
        type: string;
        content: string;
        author: string;
    }) => void;
}

export function CreateEntityDialog({ onCreateEntity }: CreateEntityDialogProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !type || !content.trim() || !author.trim()) {
            toast({
                title: 'Erreur',
                description: 'Veuillez remplir tous les champs obligatoires.',
                variant: 'destructive',
            });
            return;
        }

        onCreateEntity({ name, type, content, author });

        toast({
            title: 'Entité créée',
            description: `L'entité "${name}" a été créée avec succès.`,
        });

        // Reset form
        setName('');
        setType('');
        setContent('');
        setAuthor('');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nouvelle entité
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Créer une nouvelle entité
                    </DialogTitle>
                    <DialogDescription>
                        Remplissez les informations pour créer une nouvelle entité. Elle sera créée en état "Brouillon".
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nom de l'entité *</Label>
                            <Input
                                id="name"
                                placeholder="Ex: Contrat de partenariat 2024"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type *</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Sélectionnez un type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {entityTypes.map((t) => (
                                        <SelectItem key={t} value={t}>
                                            {t}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="author">Auteur *</Label>
                            <Input
                                id="author"
                                placeholder="Votre nom"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="content">Contenu / Description *</Label>
                            <Textarea
                                id="content"
                                placeholder="Décrivez le contenu de cette entité..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Annuler
                        </Button>
                        <Button type="submit">Créer l'entité</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
