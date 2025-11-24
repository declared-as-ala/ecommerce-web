'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { formatPrice, getVariantDisplay } from '@/lib/utils';
import { toast } from 'sonner';

export default function CartPage() {
    const router = useRouter();
    const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useStore();
    const total = getCartTotal();

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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
                <Card className="p-12 text-center max-w-md border-none shadow-2xl">
                    <div className="inline-flex p-6 rounded-full bg-gray-100 mb-6">
                        <ShoppingBag className="h-16 w-16 text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Votre panier est vide</h2>
                    <p className="text-gray-600 mb-8">
                        Découvrez nos délicieux produits frais et commencez vos achats
                    </p>
                    <Link href="/products">
                        <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600">
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Découvrir nos produits
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
            <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-3">
                            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
                            <span className="text-xl font-bold">Les Délices</span>
                        </Link>
                        <div className="flex gap-4">
                            <Link href="/products"><Button variant="outline">Continuer mes achats</Button></Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">
                    Mon <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Panier</span>
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <Card key={`${item.product.id}-${item.variant.variant_id}`} className="p-6 border-none shadow-lg">
                                <div className="flex gap-6">
                                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 flex-shrink-0">
                                        <img src={item.product.Image} alt={item.product.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-1">{item.product.title}</h3>
                                        <p className="text-gray-600 text-sm mb-3">
                                            {getVariantDisplay(item.variant)} • {formatPrice(item.variant.price)}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8"
                                                    onClick={() => handleUpdateQuantity(item.product.id, item.variant.variant_id, item.quantity - 1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8"
                                                    onClick={() => handleUpdateQuantity(item.product.id, item.variant.variant_id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleRemove(item.product.id, item.variant.variant_id)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Retirer
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-600">
                                            {formatPrice(item.variant.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        <Button variant="outline" className="w-full" onClick={() => {
                            clearCart();
                            toast.info('Panier vidé');
                        }}>
                            Vider le panier
                        </Button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 border-none shadow-2xl sticky top-24">
                            <h2 className="text-xl font-bold mb-6">Récapitulatif</h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Sous-total</span>
                                    <span className="font-semibold">{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Livraison</span>
                                    <span className="font-semibold">Calculée à l'étape suivante</span>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold">Total</span>
                                        <span className="text-3xl font-bold text-green-600">{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>
                            <Link href="/checkout">
                                <Button size="lg" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-14 text-lg font-semibold shadow-lg shadow-green-500/30">
                                    Commander
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <p className="text-xs text-center text-gray-500 mt-4">
                                Paiement 100% sécurisé • SSL
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
