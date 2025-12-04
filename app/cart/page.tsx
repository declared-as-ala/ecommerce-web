'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, Lock, Truck } from 'lucide-react';
import { formatPrice, getVariantDisplay } from '@/lib/utils';
import { toast } from 'sonner';
import { ProductImage } from '@/components/ProductImage';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function CartPage() {
    const router = useRouter();
    const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useStore();
    const total = getCartTotal();
    const deliveryFee = 0; // Free delivery
    const finalTotal = total + deliveryFee;

    const handleUpdateQuantity = (productId: string, variantId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(productId, variantId);
        } else {
            updateQuantity(productId, variantId, newQuantity);
        }
    };

    const handleRemove = (productId: string, variantId: string) => {
        removeFromCart(productId, variantId);
        toast.success('Produit retiré du panier');
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-4">
                    <Card className="p-12 sm:p-16 text-center max-w-2xl border-none shadow-2xl bg-white/80 backdrop-blur-sm animate-scale-in">
                        <div className="inline-flex p-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-6">
                            <ShoppingBag className="h-20 w-20 text-green-500" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Votre panier est vide</h2>
                        <p className="text-gray-600 mb-8 text-base sm:text-lg max-w-md mx-auto">
                            Découvrez nos délicieux produits frais et commencez vos achats dès maintenant
                        </p>
                        <Link href="/products">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-14 px-8 text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all hover:-translate-y-1"
                            >
                                <Sparkles className="mr-2 h-5 w-5" />
                                Découvrir nos produits
                            </Button>
                        </Link>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex flex-col">
            <Navbar />

            <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Page Header */}
                <div className="mb-8 sm:mb-12 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
                        <ShoppingCart className="h-4 w-4" />
                        {cart.length} article{cart.length > 1 ? 's' : ''}
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                        Mon <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Panier</span>
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg">
                        Vérifiez votre commande avant de passer au paiement
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4 animate-slide-up">
                        {cart.map((item, index) => (
                            <Card
                                key={`${item.product.id}-${item.variant.variant_id}`}
                                className="p-4 sm:p-6 border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white animate-scale-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex gap-4 sm:gap-6">
                                    {/* Product Image */}
                                    <Link
                                        href={`/products/${item.product.id}`}
                                        className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 group"
                                    >
                                        <ProductImage
                                            src={item.product.Image}
                                            alt={item.product.title}
                                            fill
                                            className="group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </Link>

                                    {/* Product Details */}
                                    <div className="flex-1 flex flex-col justify-between gap-3">
                                        <div>
                                            <Link href={`/products/${item.product.id}`}>
                                                <h3 className="font-bold text-base sm:text-lg mb-1 hover:text-green-600 transition-colors line-clamp-2">
                                                    {item.product.title}
                                                </h3>
                                            </Link>
                                            <p className="text-gray-600 text-sm">
                                                {getVariantDisplay(item.variant)} • {formatPrice(item.variant.price)}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between flex-wrap gap-3">
                                            {/* Quantity Selector */}
                                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-9 w-9 hover:bg-white hover:text-green-600 transition-all"
                                                    onClick={() => handleUpdateQuantity(item.product.id, item.variant.variant_id, item.quantity - 1)}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-9 w-9 hover:bg-white hover:text-green-600 transition-all"
                                                    onClick={() => handleUpdateQuantity(item.product.id, item.variant.variant_id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Item Total & Remove */}
                                            <div className="flex items-center gap-4">
                                                <p className="text-xl sm:text-2xl font-bold text-green-600">
                                                    {formatPrice(item.variant.price * item.quantity)}
                                                </p>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all"
                                                    onClick={() => handleRemove(item.product.id, item.variant.variant_id)}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {/* Clear Cart Button */}
                        <Button
                            variant="outline"
                            className="w-full border-2 hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all"
                            onClick={() => {
                                clearCart();
                                toast.info('Panier vidé');
                            }}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Vider le panier
                        </Button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '150ms' }}>
                        <Card className="p-6 sm:p-8 border-none shadow-2xl sticky top-24 bg-gradient-to-br from-white to-green-50/30">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900">Récapitulatif</h2>

                            {/* Price Breakdown */}
                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between text-gray-700">
                                    <span>Sous-total ({cart.length} article{cart.length > 1 ? 's' : ''})</span>
                                    <span className="font-semibold">{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <Truck className="h-4 w-4 text-green-600" />
                                        <span>Livraison</span>
                                    </div>
                                    <span className="font-semibold text-green-600">Gratuite</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-gray-900">Total</span>
                                    <span className="text-3xl font-bold text-green-600">{formatPrice(finalTotal)}</span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <Link href="/checkout">
                                <Button
                                    size="lg"
                                    className="w-full mb-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-16 text-lg font-bold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all hover:-translate-y-1"
                                >
                                    <Lock className="mr-2 h-5 w-5" />
                                    Passer la commande
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>

                            {/* Security Badge */}
                            <div className="text-center space-y-2">
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                    <Lock className="h-4 w-4 text-green-600" />
                                    <span>Paiement 100% sécurisé • SSL</span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Vos données sont protégées
                                </p>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-200">
                                {[
                                    { icon: Lock, text: 'Sécurisé' },
                                    { icon: Truck, text: 'Livraison rapide' },
                                    { icon: ShoppingBag, text: '100% frais' },
                                ].map((badge, i) => (
                                    <div key={i} className="text-center">
                                        <div className="inline-flex p-2 rounded-lg bg-green-100 mb-1">
                                            <badge.icon className="h-4 w-4 text-green-600" />
                                        </div>
                                        <p className="text-xs text-gray-600">{badge.text}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Continue Shopping */}
                        <Link href="/products" className="block mt-4">
                            <Button
                                variant="outline"
                                className="w-full border-2 hover:border-green-600 hover:text-green-600 hover:bg-green-50 transition-all"
                            >
                                ← Continuer mes achats
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
