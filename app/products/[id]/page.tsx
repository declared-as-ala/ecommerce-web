'use client';

import { useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { productsApi } from '@/lib/api/products';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ShoppingCart, Heart, Minus, Plus, Package, Shield, Truck, Star, Check, ChevronRight, MapPin, Clock, User, ZoomIn, Share2, Award, RefreshCw } from 'lucide-react';
import { formatPrice, getVariantDisplay } from '@/lib/utils';
import { toast } from 'sonner';
import { ProductImage } from '@/components/ProductImage';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { addToCart, favorites, addToFavorites, removeFromFavorites } = useStore();
    const [selectedVariantId, setSelectedVariantId] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [selectedTab, setSelectedTab] = useState('description');
    const [isZoomed, setIsZoomed] = useState(false);

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productsApi.getProduct(id),
    });

    // Fetch related products (same category)
    const { data: relatedProducts } = useQuery({
        queryKey: ['related-products', product?.category],
        queryFn: () => product ? productsApi.getProducts({ category: product.category, limit: 8 }) : null,
        enabled: !!product,
    });

    const selectedVariant = product?.variants.find(v => v.variant_id === selectedVariantId) || product?.variants[0];
    const isFavorite = favorites.some(f => f.id === product?.id);
    const inStock = true; // Mock stock status
    const estimatedDelivery = "2-3 jours ouvrables";

    const handleAddToCart = () => {
        if (product && selectedVariant) {
            for (let i = 0; i < quantity; i++) {
                addToCart(product, selectedVariant);
            }
            toast.success(`${quantity} × ${product.title} ajouté au panier!`, {
                description: 'Produit ajouté avec succès',
                duration: 3000,
            });
        }
    };

    const toggleFavorite = () => {
        if (product) {
            if (isFavorite) {
                removeFromFavorites(product.id);
                toast.info('Retiré des favoris');
            } else {
                addToFavorites(product);
                toast.success('Ajouté aux favoris ❤️');
            }
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product?.title,
                text: `Découvrez ${product?.title}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Lien copié!');
        }
    };

    // Mock reviews data
    const reviews = [
        { id: 1, author: "Marie Dubois", rating: 5, comment: "Produit excellent, très frais et de qualité! Je recommande vivement. La livraison était rapide et l'emballage soigné.", date: "Il y a 2 jours", verified: true },
        { id: 2, author: "Jean Pierre", rating: 5, comment: "Toujours satisfait de la fraîcheur des produits. C'est ma troisième commande et je ne suis jamais déçu.", date: "Il y a 5 jours", verified: true },
        { id: 3, author: "Sophie Laurent", rating: 4, comment: "Bon produit, livraison rapide. Seul petit bémol: l'emballage pourrait être plus écologique.", date: "Il y a 1 semaine", verified: false },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <Skeleton className="h-10 w-32 mb-8" />
                    <div className="grid lg:grid-cols-2 gap-12">
                        <Skeleton className="h-96 w-full rounded-3xl" />
                        <div className="space-y-6">
                            <Skeleton className="h-12 w-3/4" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <Navbar />
                <Card className="p-12 text-center max-w-md">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Produit introuvable</h2>
                    <p className="text-gray-600 mb-6">Ce produit n'existe pas ou a été supprimé</p>
                    <Link href="/products">
                        <Button>Retour aux produits</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30">
            <Navbar />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
                {/* Enhanced Breadcrumb */}
                <nav className="flex items-center gap-2 mb-8 text-sm animate-fade-in">
                    <Link href="/" className="text-gray-500 hover:text-green-600 transition-colors font-medium">Accueil</Link>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <Link href="/products" className="text-gray-500 hover:text-green-600 transition-colors font-medium">Produits</Link>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-none">{product.title}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
                    {/* Product Image - Ultra Compact */}
                    <div className="space-y-3 animate-slide-up">
                        <Card className="overflow-hidden border-none shadow-premium-lg rounded-3xl group relative">
                            <div
                                className="relative aspect-square bg-gradient-to-br from-green-50/50 via-white to-emerald-50/50 cursor-pointer"
                                onClick={() => setIsZoomed(!isZoomed)}
                            >
                                <ProductImage
                                    src={product.Image}
                                    alt={product.title}
                                    fill
                                    className={`transition-all duration-700 object-cover ${isZoomed ? 'scale-150' : 'group-hover:scale-105'}`}
                                />

                                {/* Compact Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg text-xs py-1.5 px-3 font-semibold">
                                        {product.category}
                                    </Badge>
                                    {inStock && (
                                        <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg text-xs py-1.5 px-3 font-semibold">
                                            <Check className="h-3 w-3 mr-1" /> En stock
                                        </Badge>
                                    )}
                                </div>

                                {/* Action Buttons - Top Right */}
                                <div className="absolute top-6 right-6 flex flex-col gap-3">
                                    <Button
                                        size="icon"
                                        className={`h-12 w-12 rounded-2xl shadow-xl transition-all duration-300 backdrop-blur-sm ${isFavorite
                                            ? 'bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white scale-110'
                                            : 'bg-white/95 hover:bg-white text-gray-700 hover:scale-110'
                                            }`}
                                        onClick={toggleFavorite}
                                    >
                                        <Heart className={`h-5 w-5 transition-all ${isFavorite ? 'fill-current' : ''}`} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        className="h-12 w-12 rounded-2xl shadow-xl bg-white/95 hover:bg-white text-gray-700 hover:scale-110 transition-all backdrop-blur-sm"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>

                                {/* Zoom Indicator */}
                                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ZoomIn className="h-4 w-4 text-white" />
                                </div>
                            </div>
                        </Card>

                        {/* Trust Badges - Inline */}
                        <div className="flex items-center justify-around py-3 px-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl border border-green-100">
                            {[
                                { icon: Shield, text: 'Sécurisé' },
                                { icon: Truck, text: 'Livraison rapide' },
                                { icon: Award, text: 'Qualité premium' },
                            ].map((badge, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <badge.icon className="h-4 w-4 text-green-600" />
                                    <span className="text-xs font-medium text-gray-700 hidden sm:inline">{badge.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info Section - Compact */}
                    <div className="space-y-5 animate-slide-up" style={{ animationDelay: '150ms' }}>
                        {/* Title & Rating */}
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight text-gray-900">
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-amber-50 px-3 py-1.5 rounded-full">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                    ))}
                                </div>
                                <span className="text-gray-700 font-semibold text-base">4.9 (125)</span>
                            </div>
                        </div>

                        {/* Price Card - Compact */}
                        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow-lg rounded-2xl">
                            <p className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">Prix</p>
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    {formatPrice(selectedVariant?.price || 0)}
                                </span>
                                <span className="text-gray-600 text-lg font-medium">/ {getVariantDisplay(selectedVariant)}</span>
                            </div>
                            <p className="text-xs text-green-700 font-medium">TVA incluse</p>
                        </Card>

                        {/* Variant Selection */}
                        {product.variants.length > 1 && (
                            <div className="space-y-4">
                                <label className="font-bold text-gray-900 text-xl flex items-center gap-2">
                                    <Package className="h-5 w-5 text-green-600" />
                                    Choisir une variante:
                                </label>
                                <Select
                                    value={selectedVariantId || product.variants[0].variant_id}
                                    onValueChange={setSelectedVariantId}
                                >
                                    <SelectTrigger className="h-16 text-lg border-2 hover:border-green-500 hover:shadow-lg transition-all rounded-2xl font-semibold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl">
                                        {product.variants.map((variant) => (
                                            <SelectItem key={variant.variant_id} value={variant.variant_id} className="text-lg py-4 rounded-xl">
                                                {getVariantDisplay(variant)} - {formatPrice(variant.price)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Quantity Selector - Compact */}
                        <div className="space-y-3">
                            <label className="font-bold text-gray-900 text-base">Quantité:</label>
                            <div className="flex items-center gap-4">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="h-12 w-12 border-2 hover:border-green-600 hover:bg-green-50 transition-all rounded-xl"
                                >
                                    <Minus className="h-5 w-5" />
                                </Button>
                                <div className="flex-1 text-center">
                                    <span className="text-3xl font-black text-gray-900">{quantity}</span>
                                </div>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="h-12 w-12 border-2 hover:border-green-600 hover:bg-green-50 transition-all rounded-xl"
                                >
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Premium CTAs */}
                        <div className="space-y-4 pt-2">
                            <Button
                                size="lg"
                                className="w-full h-20 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 text-xl font-black shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all hover:-translate-y-2 rounded-2xl relative overflow-hidden group"
                                onClick={handleAddToCart}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-750"></div>
                                <ShoppingCart className="mr-4 h-7 w-7" />
                                Ajouter au panier • {formatPrice((selectedVariant?.price || 0) * quantity)}
                            </Button>

                            <div className="grid grid-cols-2 gap-4">
                                <Link href="/cart" className="block">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full h-16 border-2 border-green-600 text-green-600 hover:bg-green-50 hover:scale-105 text-base font-bold rounded-2xl transition-all"
                                    >
                                        Voir le panier
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={toggleFavorite}
                                    className={`h-16 border-2 text-base font-bold rounded-2xl transition-all hover:scale-105 ${isFavorite
                                        ? 'border-red-600 bg-red-50 text-red-600 hover:bg-red-100'
                                        : 'border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600'
                                        }`}
                                >
                                    <Heart className={`mr-2 h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                                    Favoris
                                </Button>
                            </div>
                        </div>

                        {/* Features List - Compact */}
                        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl">
                            {[
                                { text: '100% Bio', icon: Award },
                                { text: 'Livraison rapide', icon: Truck },
                                { text: 'Satisfait ou remboursé', icon: RefreshCw },
                                { text: 'Support 7j/7', icon: Shield }
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-gray-200">
                                    <feature.icon className="h-3.5 w-3.5 text-green-600" />
                                    <span className="text-xs font-medium text-gray-700">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Enhanced Product Details Tabs */}
                <div className="mb-16 animate-fade-in">
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 lg:w-[500px] h-14 bg-gradient-to-r from-gray-100 to-slate-100 rounded-2xl shadow-lg">
                            <TabsTrigger
                                value="description"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white font-bold text-base rounded-xl transition-all data-[state=active]:shadow-lg"
                            >
                                📋 Description
                            </TabsTrigger>
                            <TabsTrigger
                                value="reviews"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white font-bold text-base rounded-xl transition-all data-[state=active]:shadow-lg"
                            >
                                ⭐ Avis ({reviews.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="mt-8">
                            <Card className="p-8 sm:p-10 border-none shadow-premium-lg rounded-3xl bg-gradient-to-br from-white to-gray-50/50">
                                <h3 className="text-3xl font-black mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Description du produit</h3>
                                <div className="prose prose-lg prose-gray max-w-none">
                                    <p className="text-gray-700 leading-relaxed text-lg mb-6">
                                        {product.description || 'Produit frais de qualité supérieure, sélectionné avec soin pour vous garantir fraîcheur et saveur. Nos produits sont soigneusement choisis auprès de producteurs locaux engagés dans une agriculture responsable et durable.'}
                                    </p>

                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl mb-6">
                                        <h4 className="text-2xl font-black mt-0 mb-4 text-gray-900">✨ Caractéristiques Premium</h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {[
                                                { text: 'Fraîcheur garantie', icon: Check },
                                                { text: 'Origine contrôlée', icon: Check },
                                                { text: 'Conservation optimale', icon: Check },
                                                { text: 'Qualité certifiée', icon: Check },
                                                { text: 'Agriculture responsable', icon: Check },
                                                { text: 'Traçabilité complète', icon: Check }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                                                        <item.icon className="h-5 w-5 text-white" />
                                                    </div>
                                                    <span className="font-semibold text-gray-800">{item.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl">
                                        <h4 className="text-2xl font-black mt-0 mb-3 text-gray-900">📦 Informations pratiques</h4>
                                        <ul className="space-y-2 mb-0">
                                            <li className="flex items-start gap-2">
                                                <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <span><strong>Conservation:</strong> Suivre les instructions sur l'emballage</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Truck className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <span><strong>Livraison:</strong> Emballage réfrigéré pour maintenir la fraîcheur</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <span><strong>Origine:</strong> Produits locaux et de saison privilégiés</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="reviews" className="mt-8">
                            <Card className="p-8 sm:p-10 border-none shadow-premium-lg rounded-3xl bg-gradient-to-br from-white to-gray-50/50">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                                    <h3 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Avis clients</h3>
                                    <div className="flex items-center gap-4 bg-gradient-to-r from-yellow-50 to-amber-50 px-6 py-4 rounded-2xl shadow-lg">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                                            ))}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-2xl text-gray-900">4.9</span>
                                            <span className="text-sm text-gray-600 font-medium">sur 5</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {reviews.map((review, index) => (
                                        <div
                                            key={review.id}
                                            className="border-2 border-gray-100 hover:border-green-200 rounded-2xl p-6 transition-all hover:shadow-lg bg-white"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <div className="flex items-start gap-5">
                                                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
                                                    <User className="h-8 w-8 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold text-lg text-gray-900">{review.author}</h4>
                                                            {review.verified && (
                                                                <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-xs py-1">
                                                                    <Check className="h-3 w-3 mr-1" />
                                                                    Vérifié
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <span className="text-sm text-gray-500 font-medium">{review.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 mb-3 bg-yellow-50 p-2 rounded-lg w-fit">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={`h-5 w-5 ${star <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed text-base">{review.comment}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 text-center">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold rounded-2xl px-8 h-14"
                                    >
                                        Voir tous les avis
                                    </Button>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Enhanced Related Products */}
                {relatedProducts?.products && relatedProducts.products.length > 1 && (
                    <div className="animate-fade-in">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl sm:text-5xl font-black mb-4">
                                Produits <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Similaires</span>
                            </h2>
                            <p className="text-gray-600 text-lg font-medium">Découvrez notre sélection de produits connexes</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProducts.products
                                .filter(p => p.id !== product.id)
                                .slice(0, 4)
                                .map((relatedProduct, index) => {
                                    const variant = relatedProduct.variants[0];
                                    return (
                                        <Card
                                            key={relatedProduct.id}
                                            className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-none bg-white shadow-lg animate-scale-in rounded-3xl"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <Link href={`/products/${relatedProduct.id}`}>
                                                <div className="relative h-56 sm:h-64 overflow-hidden bg-gradient-to-br from-green-50/50 via-white to-emerald-50/50">
                                                    <ProductImage
                                                        src={relatedProduct.Image}
                                                        alt={relatedProduct.title}
                                                        fill
                                                        className="group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    <Badge className="absolute bottom-4 left-4 bg-gradient-to-r from-green-600 to-emerald-600 text-sm py-2 px-4 font-bold shadow-lg">
                                                        {relatedProduct.category}
                                                    </Badge>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="font-bold text-base sm:text-lg mb-3 line-clamp-2 group-hover:text-green-600 transition-colors min-h-[56px] leading-tight">
                                                        {relatedProduct.title}
                                                    </h3>
                                                    <div className="flex items-baseline justify-between">
                                                        <span className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                            {formatPrice(variant?.price || 0)}
                                                        </span>
                                                        <span className="text-sm text-gray-500 font-medium">
                                                            {getVariantDisplay(variant)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </Card>
                                    );
                                })}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
