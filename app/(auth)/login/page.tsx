'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { authApi } from '@/lib/api/auth';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { LogIn, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setUser, isAuthenticated } = useStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    // Redirect if already authenticated
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('accessToken');
            // If user has token and is authenticated, redirect to home
            if (token && isAuthenticated) {
                router.push('/');
                return;
            }
            // If no token, allow access to login page
            if (!token) {
                setIsChecking(false);
            } else {
                // If token exists but not authenticated yet, wait a bit for auth provider to initialize
                const timer = setTimeout(() => {
                    if (isAuthenticated) {
                        router.push('/');
                    } else {
                        setIsChecking(false);
                    }
                }, 500);
                return () => clearTimeout(timer);
            }
        };
        checkAuth();
    }, [isAuthenticated, router]);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        try {
            const response = await authApi.login(data);

            // Save tokens
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);

            // Update store
            setUser(response.user);

            toast.success('Connexion réussie!');
            const redirect = searchParams.get('redirect');
            router.push(redirect || '/');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur de connexion');
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading while checking auth
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Logo */}
            <div className="text-center">
                <Link href="/" className="inline-block group">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-green-500/20 group-hover:ring-green-500/40 transition">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Les Délices du Verger
                    </h1>
                </Link>
            </div>

            {/* Login Card */}
            <Card className="p-8 border-none shadow-2xl bg-white/80 backdrop-blur-sm">
                <div className="space-y-6">
                    <div className="text-center space-y-2">
                        <div className="inline-flex p-3 rounded-full bg-green-100 mb-2">
                            <LogIn className="h-6 w-6 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Bon retour!</h2>
                        <p className="text-gray-600">Connectez-vous à votre compte</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                    {...register('email')}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Mot de passe
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                    {...register('password')}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                <span className="text-sm text-gray-600">Se souvenir</span>
                            </label>
                            <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                                Mot de passe oublié?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg font-medium shadow-lg shadow-green-500/30"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Connexion...
                                </>
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-5 w-5" />
                                    Se connecter
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Ou</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-600">
                            Pas encore de compte?{' '}
                            <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold">
                                S'inscrire gratuitement
                            </Link>
                        </p>
                    </div>
                </div>
            </Card>

            {/* Back to home */}
            <div className="text-center">
                <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}
