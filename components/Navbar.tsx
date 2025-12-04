'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, X, Heart } from 'lucide-react';
import { useStore } from '@/lib/store';

export function Navbar() {
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated, user, cart, favorites } = useStore();
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    const isActive = (path: string) => pathname === path;

    return (
        <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0">
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-green-500/20 group-hover:ring-green-500/40 transition-all">
                            <img src="/logo.png" alt="Les Délices" className="object-cover w-full h-full" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                Les Délices <span className="text-gray-700">du Verger</span>
                            </h1>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/products"
                                    className={`text-sm xl:text-base font-medium transition-all relative group ${isActive('/products') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                                        }`}
                                >
                                    Produits
                                    {isActive('/products') && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-600 rounded-full"></span>
                                    )}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 rounded-full group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <Link
                                    href="/about"
                                    className={`text-sm xl:text-base font-medium transition-all relative group ${isActive('/about') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                                        }`}
                                >
                                    Qui sommes-nous
                                    {isActive('/about') && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-600 rounded-full"></span>
                                    )}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 rounded-full group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <Link
                                    href="/orders"
                                    className={`text-sm xl:text-base font-medium transition-all relative group ${isActive('/orders') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                                        }`}
                                >
                                    Commandes
                                    {isActive('/orders') && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-600 rounded-full"></span>
                                    )}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 rounded-full group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <Link
                                    href="/favorites"
                                    className={`text-sm xl:text-base font-medium transition-all relative group ${isActive('/favorites') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                                        }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <Heart className={`h-4 w-4 ${isActive('/favorites') ? 'fill-red-500 text-red-500' : ''}`} />
                                        Favoris
                                    </span>
                                    {mounted && favorites.length > 0 && (
                                        <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                            {favorites.length}
                                        </span>
                                    )}
                                    {isActive('/favorites') && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-600 rounded-full"></span>
                                    )}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 rounded-full group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <Link
                                    href="/cart"
                                    className={`text-sm xl:text-base font-medium transition-all relative group ${isActive('/cart') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                                        }`}
                                >
                                    Panier
                                    {mounted && cart.length > 0 && (
                                        <span className="absolute -top-2 -right-3 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                            {cart.length}
                                        </span>
                                    )}
                                    {isActive('/cart') && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-600 rounded-full"></span>
                                    )}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 rounded-full group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <Link href="/profile">
                                    <Button variant="outline" size="sm" className="border-green-600 text-green-600 hover:bg-green-50 transition-all hover:shadow-md">
                                        {user?.firstName || 'Profil'}
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/products"
                                    className={`text-sm xl:text-base font-medium transition-all relative group ${isActive('/products') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                                        }`}
                                >
                                    Produits
                                    {isActive('/products') && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-600 rounded-full"></span>
                                    )}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 rounded-full group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <Link
                                    href="/about"
                                    className={`text-sm xl:text-base font-medium transition-all relative group ${isActive('/about') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                                        }`}
                                >
                                    Qui sommes-nous
                                    {isActive('/about') && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-600 rounded-full"></span>
                                    )}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 rounded-full group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <Link
                                    href="/favorites"
                                    className={`text-sm xl:text-base font-medium transition-all relative group ${isActive('/favorites') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                                        }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <Heart className={`h-4 w-4 ${isActive('/favorites') ? 'fill-red-500 text-red-500' : ''}`} />
                                        Favoris
                                    </span>
                                    {mounted && favorites.length > 0 && (
                                        <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                            {favorites.length}
                                        </span>
                                    )}
                                    {isActive('/favorites') && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-600 rounded-full"></span>
                                    )}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 rounded-full group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <Link
                                    href="/cart"
                                    className={`text-sm xl:text-base font-medium transition-all relative group ${isActive('/cart') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                                        }`}
                                >
                                    Panier
                                    {mounted && cart.length > 0 && (
                                        <span className="absolute -top-2 -right-3 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                            {cart.length}
                                        </span>
                                    )}
                                    {isActive('/cart') && (
                                        <span className="absolute - bottom-1 left-0 w-full h-0.5 bg-green-600 rounded-full"></span>
                                    )}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 rounded-full group-hover:w-full transition-all duration-300"></span>
                                </Link>
                                <Link href="/login">
                                    <Button variant="outline" size="sm" className="border-green-600 text-green-600 hover:bg-green-50 transition-all hover:shadow-md">
                                        Connexion
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all">
                                        S'inscrire
                                    </Button>
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 text-gray-700 hover:text-green-600 transition"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="lg:hidden pb-4 space-y-2 animate-slide-down">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/products"
                                    className={`block px-4 py-2 rounded-md transition ${isActive('/products') ? 'bg-green-100 text-green-600 font-medium' : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                                        }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Produits
                                </Link>
                                <Link
                                    href="/about"
                                    className={`block px-4 py-2 rounded-md transition ${isActive('/about') ? 'bg-green-100 text-green-600 font-medium' : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                                        }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Qui sommes-nous
                                </Link>
                                <Link
                                    href="/orders"
                                    className={`block px-4 py-2 rounded-md transition ${isActive('/orders') ? 'bg-green-100 text-green-600 font-medium' : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                                        }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Commandes
                                </Link>
                                <Link
                                    href="/favorites"
                                    className={`block px-4 py-2 rounded-md transition relative ${isActive('/favorites') ? 'bg-green-100 text-green-600 font-medium' : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                                        }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="flex items-center gap-2">
                                        <Heart className={`h-4 w-4 ${isActive('/favorites') ? 'fill-red-500 text-red-500' : ''}`} />
                                        Favoris
                                    </span>
                                    {mounted && favorites.length > 0 && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {favorites.length}
                                        </span>
                                    )}
                                </Link>
                                <Link
                                    href="/cart"
                                    className={`block px-4 py-2 rounded-md transition relative ${isActive('/cart') ? 'bg-green-100 text-green-600 font-medium' : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                                        }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Panier
                                    {mounted && cart.length > 0 && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {cart.length}
                                        </span>
                                    )}
                                </Link>
                                <Link href="/profile" className="block px-4 py-2" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                                        {user?.firstName || 'Profil'}
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/products"
                                    className={`block px-4 py-2 rounded-md transition ${isActive('/products') ? 'bg-green-100 text-green-600 font-medium' : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                                        }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Produits
                                </Link>
                                <Link
                                    href="/about"
                                    className={`block px-4 py-2 rounded-md transition ${isActive('/about') ? 'bg-green-100 text-green-600 font-medium' : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                                        }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Qui sommes-nous
                                </Link>
                                <Link
                                    href="/favorites"
                                    className={`block px-4 py-2 rounded-md transition relative ${isActive('/favorites') ? 'bg-green-100 text-green-600 font-medium' : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                                        }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="flex items-center gap-2">
                                        <Heart className={`h-4 w-4 ${isActive('/favorites') ? 'fill-red-500 text-red-500' : ''}`} />
                                        Favoris
                                    </span>
                                    {mounted && favorites.length > 0 && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {favorites.length}
                                        </span>
                                    )}
                                </Link>
                                <Link
                                    href="/cart"
                                    className={`block px-4 py-2 rounded-md transition relative ${isActive('/cart') ? 'bg-green-100 text-green-600 font-medium' : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                                        }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Panier
                                    {mounted && cart.length > 0 && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {cart.length}
                                        </span>
                                    )}
                                </Link>
                                <div className="px-4 space-y-2">
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                                            Connexion
                                        </Button>
                                    </Link>
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                                            S'inscrire
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        )}
                    </nav>
                )}
            </div>
        </header>
    );
}
