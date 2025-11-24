'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export function ProductsHeader() {
    const [mounted, setMounted] = useState(false);
    const { cart, user, isAuthenticated } = useStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-green-500/20">
                                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                Les Délices
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-6">
                            <Link href="/products" className="text-green-600 font-semibold">Produits</Link>
                            <Link href="/about" className="text-gray-700 hover:text-green-600 transition">Qui sommes-nous</Link>
                            <Link href="/favorites" className="text-gray-700 hover:text-green-600 transition">Favoris</Link>
                        </nav>

                        <div className="flex items-center space-x-4">
                            <Link href="/cart">
                                <Button variant="outline" size="icon" className="relative">
                                    <ShoppingCart className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                                Connexion
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-green-500/20">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            Les Délices
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/products" className="text-green-600 font-semibold">Produits</Link>
                        <Link href="/about" className="text-gray-700 hover:text-green-600 transition">Qui sommes-nous</Link>
                        <Link href="/favorites" className="text-gray-700 hover:text-green-600 transition">Favoris</Link>
                        {isAuthenticated && (
                            <Link href="/orders" className="text-gray-700 hover:text-green-600 transition">Commandes</Link>
                        )}
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Link href="/cart">
                            <Button variant="outline" size="icon" className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cart.length}
                                    </span>
                                )}
                            </Button>
                        </Link>
                        {isAuthenticated ? (
                            <Link href="/profile">
                                <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                                    {user?.firstName || 'Profil'}
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                                    Connexion
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
