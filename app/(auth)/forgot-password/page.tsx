'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { authApi } from '@/lib/api/auth';
import { toast } from 'sonner';
import { Mail, ArrowLeft, Check } from 'lucide-react';

const forgotSchema = z.object({
    email: z.string().email('Email invalide'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>({
        resolver: zodResolver(forgotSchema),
    });

    const onSubmit = async (data: ForgotForm) => {
        setIsLoading(true);
        try {
            await authApi.forgotPassword(data.email);
            setIsSubmitted(true);
            toast.success('Email envoyé!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-full mx-auto mb-4" />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            Les Délices du Verger
                        </h1>
                    </Link>
                </div>

                <Card className="p-8 border-none shadow-2xl bg-white/80 backdrop-blur-sm">
                    {isSubmitted ? (
                        <div className="text-center space-y-6">
                            <div className="inline-flex p-4 rounded-full bg-green-100 mb-4">
                                <Check className="h-12 w-12 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold">Email envoyé!</h2>
                            <p className="text-gray-600">
                                Nous avons envoyé un lien de réinitialisation à votre adresse email.
                                Vérifiez votre boîte de réception.
                            </p>
                            <Link href="/login">
                                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600">
                                    Retour à la connexion
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <div className="inline-flex p-3 rounded-full bg-blue-100 mb-2">
                                    <Mail className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-bold">Mot de passe oublié?</h2>
                                <p className="text-gray-600">
                                    Entrez votre email et nous vous enverrons un lien de réinitialisation
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="votre@email.com"
                                            className="pl-10 h-12 bg-gray-50"
                                            {...register('email')}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-sm text-red-600">{errors.email.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                >
                                    {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
                                </Button>
                            </form>

                            <div className="text-center">
                                <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                                    Retour à la connexion
                                </Link>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Back to home */}
                <div className="text-center mt-6">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
