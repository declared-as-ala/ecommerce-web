'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { formatPrice, getVariantDisplay } from '@/lib/utils';
import { toast } from 'sonner';
import { ProductImage } from '@/components/ProductImage';

export default function FavoritesPage() {
    const { favorites, removeFromFavorites, addToCart, cart, isAuthenticated, user } = useStore();

    const handleRemove = (productId: string) => {
        removeFromFavorites(productId);
        toast.info('Retiré des favoris');
    };

    const handleAddToCart = (product: any) => {
        const variant = product.variants[0];
        addToCart(product, variant);
        toast.success('Ajouté au panier!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
            {/* Header */}
            <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-3">
                            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
                            <span className="text-xl font-bold">Les Délices</span>
                        </Link>
                        <nav className="flex items-center gap-4">
                            <Link href="/products"><Button variant="outline">Produits</Button></Link>
                            <Link href="/cart" className="relative">
                                <Button variant="outline" className="relative">
                                    Panier
                                    {cart.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {cart.length}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                            <Link href="/favorites" className="relative">
                                <Button variant="outline" className="relative">
                                    <Heart className="h-4 w-4 mr-2" />
                                    Favoris
                                    {favorites.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {favorites.length}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                            {isAuthenticated && (
                                <Link href="/profile">
                                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                                        {user?.firstName || 'Profil'}
                                    </Button>
                                </Link>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">
                    Mes <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Favoris</span>
                </h1>

                {favorites.length === 0 ? (
                    <Card className="p-12 text-center border-none shadow-lg">
                        <div className="inline-flex p-6 rounded-full bg-red-100 mb-4">
                            <Heart className="h-16 w-16 text-red-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Aucun favori</h3>
                        <p className="text-gray-600 mb-6">
                            Ajoutez des produits à vos favoris pour les retrouver facilement
                        </p>
                        <Link href="/products">
                            <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                                Découvrir nos produits
                            </Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((product) => {
                            const variant = product.variants[0];
                            return (
                                <Card key={product.id} className="group overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 border-none">
                                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-red-50 to-pink-50">
                                        <ProductImage
                                            src={product.Image}
                                            alt={product.title}
                                            fill
                                            className="group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="absolute top-4 right-4 rounded-full bg-white/90"
                                            onClick={() => handleRemove(product.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                        <Badge className="absolute bottom-4 left-4 bg-red-600">{product.category}</Badge>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-2xl font-bold text-green-600">
                                                {formatPrice(variant?.price || 0)}
                                            </span>
                                            <span className="text-sm text-gray-500">{getVariantDisplay(variant)}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                <ShoppingCart className="mr-2 h-4 w-4" />
                                                Ajouter
                                            </Button>
                                            <Link href={`/products/${product.id}`}>
                                                <Button variant="outline">Voir</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
