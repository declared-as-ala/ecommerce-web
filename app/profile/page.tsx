'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/protected-route';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, LogOut, Package } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { toast } from 'sonner';

const profileSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    phone: z.string().min(10),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const { user, setUser, logout } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phone: user?.phone || '',
        },
    });

    // Update form values when user data loads
    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: ProfileForm) => {
        setIsLoading(true);
        try {
            const updated = await authApi.updateProfile(data);
            setUser(updated);
            setIsEditing(false);
            toast.success('Profil mis à jour!');
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.info('Déconnexion réussie');
        window.location.href = '/';
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
                {/* Header */}
                <header className="border-b bg-white/90 backdrop-blur-md">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center space-x-3">
                                <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
                                <span className="text-xl font-bold">Les Délices</span>
                            </Link>
                            <nav className="flex gap-4">
                                <Link href="/products"><Button variant="outline">Produits</Button></Link>
                                <Link href="/orders"><Button variant="outline">Commandes</Button></Link>
                            </nav>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold mb-8">
                        Mon <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Profil</span>
                    </h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Profile Info */}
                        <div className="lg:col-span-2">
                            <Card className="p-8 border-none shadow-lg">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold">Informations personnelles</h2>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditing(!isEditing)}
                                    >
                                        {isEditing ? 'Annuler' : 'Modifier'}
                                    </Button>
                                </div>

                                {isEditing ? (
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="firstName">Prénom</Label>
                                                <Input id="firstName" {...register('firstName')} className="mt-1" />
                                                {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>}
                                            </div>
                                            <div>
                                                <Label htmlFor="lastName">Nom</Label>
                                                <Input id="lastName" {...register('lastName')} className="mt-1" />
                                                {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Téléphone</Label>
                                            <Input id="phone" {...register('phone')} className="mt-1" />
                                            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-gradient-to-r from-green-600 to-emerald-600"
                                        >
                                            Enregistrer les modifications
                                        </Button>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="p-3 rounded-full bg-green-100">
                                                <User className="h-6 w-6 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Nom complet</p>
                                                <p className="font-semibold text-lg">{user?.firstName} {user?.lastName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="p-3 rounded-full bg-blue-100">
                                                <Mail className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Email</p>
                                                <p className="font-semibold text-lg">{user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="p-3 rounded-full bg-purple-100">
                                                <Phone className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Téléphone</p>
                                                <p className="font-semibold text-lg">{user?.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-6">
                            <Card className="p-6 border-none shadow-lg">
                                <h3 className="font-bold text-lg mb-4">Actions rapides</h3>
                                <div className="space-y-3">
                                    <Link href="/orders" className="block">
                                        <Button variant="outline" className="w-full justify-start">
                                            <Package className="mr-2 h-4 w-4" />
                                            Mes commandes
                                        </Button>
                                    </Link>
                                    <Link href="/favorites" className="block">
                                        <Button variant="outline" className="w-full justify-start">
                                            <User className="mr-2 h-4 w-4" />
                                            Mes favoris
                                        </Button>
                                    </Link>
                                    <Separator />
                                    <Button
                                        variant="destructive"
                                        className="w-full justify-start"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Se déconnecter
                                    </Button>
                                </div>
                            </Card>

                            <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                                <h3 className="font-bold text-lg mb-2">Points de fidélité</h3>
                                <p className="text-4xl font-bold text-green-600 mb-2">{user?.loyaltyPoints || 0}</p>
                                <p className="text-sm text-gray-600">points disponibles</p>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
