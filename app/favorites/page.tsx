'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Trash2, ShoppingBag, Sparkles } from 'lucide-react';
import { formatPrice, getVariantDisplay } from '@/lib/utils';
import { toast } from 'sonner';
import { ProductImage } from '@/components/ProductImage';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function FavoritesPage() {
    const { favorites, removeFromFavorites, addToCart } = useStore();

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50/30">
            <Navbar />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Page Header */}
                <div className="text-center mb-8 sm:mb-12 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-4">
                        <Heart className="h-4 w-4 fill-current" />
                        Mes Produits Favoris
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                        Mes <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Favoris</span>
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                        {favorites.length === 0
                            ? "Vous n'avez pas encore de favoris"
                            : `${favorites.length} produit${favorites.length > 1 ? 's' : ''} dans votre liste de favoris`
                        }
                    </p>
                </div>

                {favorites.length === 0 ? (
                    /* Empty State */
                    <Card className="p-12 sm:p-16 text-center border-none shadow-2xl max-w-2xl mx-auto bg-white/80 backdrop-blur-sm animate-scale-in">
                        <div className="inline-flex p-8 rounded-full bg-gradient-to-br from-red-100 to-pink-100 mb-6">
                            <Heart className="h-20 w-20 text-red-400" />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">
                            Aucun favori pour le moment
                        </h3>
                        <p className="text-gray-600 mb-8 text-base sm:text-lg max-w-md mx-auto">
                            Ajoutez des produits à vos favoris pour les retrouver facilement et ne rien manquer de vos produits préférés
                        </p>
                        <Link href="/products">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-14 px-8 text-base sm:text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all hover:-translate-y-1"
                            >
                                <Sparkles className="mr-2 h-5 w-5" />
                                Découvrir nos produits
                            </Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                        {favorites.map((product, index) => {
                            const variant = product.variants[0];
                            return (
                                <Card
                                    key={product.id}
                                    className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-none bg-white shadow-lg animate-slide-up"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Product Image */}
                                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-red-50 to-pink-50">
                                        <Link href={`/products/${product.id}`}>
                                            <ProductImage
                                                src={product.Image}
                                                alt={product.title}
                                                fill
                                                className="group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                                            />
                                        </Link>
                                        {/* Remove Button */}
                                        <Button
                                            size="icon"
                                            className="absolute top-3 right-3 rounded-full bg-white/95 hover:bg-red-600 text-gray-700 hover:text-white shadow-lg transition-all duration-300 hover:scale-110 z-10"
                                            onClick={() => handleRemove(product.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        {/* Category Badge */}
                                        <Badge className="absolute bottom-3 left-3 bg-red-600 hover:bg-red-700 shadow-md">
                                            {product.category}
                                        </Badge>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-5 space-y-4">
                                        <Link href={`/products/${product.id}`}>
                                            <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition-colors duration-200 cursor-pointer min-h-[56px]">
                                                {product.title}
                                            </h3>
                                        </Link>

                                        {/* Price */}
                                        <div className="flex items-baseline justify-between">
                                            <div>
                                                <span className="text-2xl font-bold text-green-600">
                                                    {formatPrice(variant?.price || 0)}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-2">
                                                    / {getVariantDisplay(variant)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 hover:scale-105 shadow-md"
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                <ShoppingCart className="mr-2 h-4 w-4" />
                                                Ajouter
                                            </Button>
                                            <Link href={`/products/${product.id}`} className="flex-shrink-0">
                                                <Button
                                                    variant="outline"
                                                    className="border-2 hover:border-green-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                                                >
                                                    Voir
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Quick Action - Add to cart all */}
                {favorites.length > 0 && (
                    <div className="mt-12 text-center animate-fade-in">
                        <Card className="inline-block p-6 border-none shadow-xl bg-gradient-to-r from-green-50 to-emerald-50">
                            <p className="text-gray-700 mb-4 font-medium">
                                <ShoppingBag className="inline h-5 w-5 mr-2" />
                                Vous aimez tous ces produits ?
                            </p>
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                                onClick={() => {
                                    favorites.forEach(product => handleAddToCart(product));
                                    toast.success(`${favorites.length} produits ajoutés au panier!`);
                                }}
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Tout ajouter au panier
                            </Button>
                        </Card>
                    </div>
                )}
            </div>

            <Footer />
        </div >
    );
}
