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
import { ArrowLeft, ShoppingCart, Heart, Minus, Plus, Package, Shield, Truck, Star } from 'lucide-react';
import { formatPrice, getVariantDisplay } from '@/lib/utils';
import { toast } from 'sonner';
import { ProductImage } from '@/components/ProductImage';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { addToCart, favorites, addToFavorites, removeFromFavorites } = useStore();
    const [selectedVariantId, setSelectedVariantId] = useState<string>('');
    const [quantity, setQuantity] = useState(1);

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productsApi.getProduct(id),
    });

    const selectedVariant = product?.variants.find(v => v.variant_id === selectedVariantId) || product?.variants[0];
    const isFavorite = favorites.some(f => f.id === product?.id);

    const handleAddToCart = () => {
        if (product && selectedVariant) {
            for (let i = 0; i < quantity; i++) {
                addToCart(product, selectedVariant);
            }
            toast.success(`${quantity} × ${product.title} ajouté au panier!`);
        }
    };

    const toggleFavorite = () => {
        if (product) {
            if (isFavorite) {
                removeFromFavorites(product.id);
                toast.info('Retiré des favoris');
            } else {
                addToFavorites(product);
                toast.success('Ajouté aux favoris');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                <div className="container mx-auto px-4 py-8">
                    <Skeleton className="h-10 w-32 mb-8" />
                    <div className="grid md:grid-cols-2 gap-12">
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
                <Card className="p-12 text-center">
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
            {/* Header */}
            <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-3">
                            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
                            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                Les Délices
                            </span>
                        </Link>
                        <nav className="flex gap-4">
                            <Link href="/products"><Button variant="outline">Pr oduits</Button></Link>
                            <Link href="/cart"><Button variant="outline"><ShoppingCart className="h-4 w-4" /></Button></Link>
                        </nav>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-8 text-sm text-gray-600">
                    <Link href="/" className="hover:text-green-600">Accueil</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-green-600">Produits</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{product.title}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    {/* Product Image */}
                    <div className="space-y-4">
                        <Card className="overflow-hidden border-none shadow-2xl">
                            <div className="relative aspect-square bg-gradient-to-br from-green-50 to-emerald-50">
                                <ProductImage
                                    src={product.Image}
                                    alt={product.title}
                                    fill
                                />
                                <Button
                                    size="icon"
                                    className="absolute top-4 right-4 rounded-full"
                                    variant={isFavorite ? 'default' : 'secondary'}
                                    onClick={toggleFavorite}
                                >
                                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                                </Button>
                            </div>
                        </Card>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { icon: Shield, text: 'Paiement sécurisé' },
                                { icon: Truck, text: 'Livraison rapide' },
                                { icon: Package, text: '100% frais' },
                            ].map((badge, i) => (
                                <Card key={i} className="p-4 text-center border-none">
                                    <badge.icon className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                    <p className="text-xs text-gray-600">{badge.text}</p>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <Badge className="mb-3 bg-green-600">{product.category}</Badge>
                            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <span className="text-gray-600">(125 avis)</span>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                {product.description || 'Produit frais de qualité supérieure, sélectionné avec soin pour vous garantir fraîcheur et saveur.'}
                            </p>
                        </div>

                        {/* Price */}
                        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-none">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-green-600">
                                    {formatPrice(selectedVariant?.price || 0)}
                                </span>
                                <span className="text-gray-600">/ {getVariantDisplay(selectedVariant)}</span>
                            </div>
                        </Card>

                        {/* Variant Selection */}
                        {product.variants.length > 1 && (
                            <div className="space-y-3">
                                <label className="font-semibold text-gray-900">Choisir une variante:</label>
                                <Select
                                    value={selectedVariantId || product.variants[0].variant_id}
                                    onValueChange={setSelectedVariantId}
                                >
                                    <SelectTrigger className="h-12">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {product.variants.map((variant) => (
                                            <SelectItem key={variant.variant_id} value={variant.variant_id}>
                                                {getVariantDisplay(variant)} - {formatPrice(variant.price)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="space-y-3">
                            <label className="font-semibold text-gray-900">Quantité:</label>
                            <div className="flex items-center gap-4">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="h-12 w-12"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="h-12 w-12"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="space-y-3">
                            <Button
                                size="lg"
                                className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg font-semibold shadow-lg shadow-green-500/30"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Ajouter au panier - {formatPrice((selectedVariant?.price || 0) * quantity)}
                            </Button>
                            <Link href="/cart" className="block">
                                <Button variant="outline" size="lg" className="w-full h-12">
                                    Voir le panier
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
