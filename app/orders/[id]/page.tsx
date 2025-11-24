'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api/orders';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Package, Truck, MapPin, CreditCard, Calendar, CheckCircle, Clock } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

const statusConfig = {
    'en_attente': { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
    'payé': { label: 'Payé', color: 'bg-blue-100 text-blue-700' },
    'terminé': { label: 'Terminé', color: 'bg-green-100 text-green-700' },
    'annulé': { label: 'Annulé', color: 'bg-red-100 text-red-700' },
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const { data: order, isLoading } = useQuery({
        queryKey: ['order', id],
        queryFn: () => ordersApi.getOrder(id),
    });

    if (isLoading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                    <div className="container mx-auto px-4 py-8">
                        <Skeleton className="h-12 w-64 mb-8" />
                        <div className="space-y-6">
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-48 w-full" />
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!order) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                    <Card className="p-12 text-center">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Commande introuvable</h2>
                        <Link href="/orders">
                            <Button>Retour aux commandes</Button>
                        </Link>
                    </Card>
                </div>
            </ProtectedRoute>
        );
    }

    const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig['en_attente'];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
                {/* Header */}
                <header className="border-b bg-white/90 backdrop-blur-md">
                    <div className="container mx-auto px-4 py-4">
                        <Link href="/" className="flex items-center space-x-3">
                            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
                            <span className="text-xl font-bold">Les Délices</span>
                        </Link>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <Link href="/orders" className="text-green-600 hover:underline mb-4 inline-block">
                            ← Retour aux commandes
                        </Link>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">
                                    Commande <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                        #{order._id?.slice(-8) || order.id?.slice(-8)}
                                    </span>
                                </h1>
                                <p className="text-gray-600">
                                    Passée le {formatDate(order.createdAt || new Date(), 'long')}
                                </p>
                            </div>
                            <Badge className={`${status.color} text-lg px-4 py-2`}>
                                {status.label}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Order Items */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="p-6 border-none shadow-lg">
                                <h2 className="text-2xl font-bold mb-6">Articles commandés</h2>
                                <div className="space-y-4">
                                    {order.items?.map((item: any, index: number) => (
                                        <div key={index}>
                                            <div className="flex gap-4">
                                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 flex-shrink-0">
                                                    <img src={item.image} alt={item.productTitle} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{item.productTitle}</h3>
                                                    <p className="text-sm text-gray-600">{item.variantName}</p>
                                                    <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-green-600">{formatPrice(item.total)}</p>
                                                    <p className="text-sm text-gray-500">{formatPrice(item.price)} × {item.quantity}</p>
                                                </div>
                                            </div>
                                            {index < (order.items?.length || 0) - 1 && <Separator className="my-4" />}
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Delivery/Pickup Info */}
                            <Card className="p-6 border-none shadow-lg">
                                <h2 className="text-2xl font-bold mb-6">
                                    {order.pickupType === 'delivery' ? 'Informations de livraison' : 'Informations de retrait'}
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        {order.pickupType === 'delivery' ? (
                                            <Truck className="h-6 w-6 text-green-600 mt-1" />
                                        ) : (
                                            <Package className="h-6 w-6 text-green-600 mt-1" />
                                        )}
                                        <div className="flex-1">
                                            <p className="font-semibold mb-1">Mode de réception</p>
                                            <p className="text-gray-600">
                                                {order.pickupType === 'delivery' ? 'Livraison à domicile' : 'Retrait en magasin'}
                                            </p>
                                        </div>
                                    </div>

                                    {order.deliveryAddress && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                                            <div className="flex-1">
                                                <p className="font-semibold mb-1">Adresse</p>
                                                <p className="text-gray-600">
                                                    {order.deliveryAddress.street}<br />
                                                    {order.deliveryAddress.postalCode} {order.deliveryAddress.city}<br />
                                                    {order.deliveryAddress.country}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {order.pickupLocation && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                                            <div className="flex-1">
                                                <p className="font-semibold mb-1">Point de retrait</p>
                                                <p className="text-gray-600">
                                                    {order.pickupLocation.name}<br />
                                                    {order.pickupLocation.address}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {order.deliveryTime && (
                                        <div className="flex items-start gap-3">
                                            <Clock className="h-6 w-6 text-purple-600 mt-1" />
                                            <div className="flex-1">
                                                <p className="font-semibold mb-1">Créneau horaire</p>
                                                <p className="text-gray-600">{order.deliveryTime}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="p-6 border-none shadow-lg sticky top-4">
                                <h3 className="font-bold text-xl mb-6">Récapitulatif</h3>

                                {/* Customer Info */}
                                <div className="mb-6">
                                    <p className="text-sm text-gray-600 mb-1">Client</p>
                                    <p className="font-semibold">{order.customer?.fullName}</p>
                                    <p className="text-sm text-gray-600">{order.customer?.email}</p>
                                    <p className="text-sm text-gray-600">{order.customer?.phone}</p>
                                </div>

                                <Separator className="my-4" />

                                {/* Payment Info */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CreditCard className="h-4 w-4 text-gray-600" />
                                        <p className="text-sm text-gray-600">Paiement</p>
                                    </div>
                                    <p className="font-semibold capitalize">{order.paymentMethod}</p>
                                </div>

                                <Separator className="my-4" />

                                {/* Pricing */}
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Sous-total</span>
                                        <span className="font-semibold">
                                            {formatPrice(order.amount - (order.deliveryFee || 0))}
                                        </span>
                                    </div>

                                    {order.deliveryFee > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Livraison</span>
                                            <span className="font-semibold">{formatPrice(order.deliveryFee)}</span>
                                        </div>
                                    )}

                                    {order.discountAmount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Réduction</span>
                                            <span className="font-semibold">-{formatPrice(order.discountAmount)}</span>
                                        </div>
                                    )}

                                    <Separator />

                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold">Total</span>
                                        <span className="text-3xl font-bold text-green-600">
                                            {formatPrice(order.amount)}
                                        </span>
                                    </div>
                                </div>

                                {order.status === 'terminé' && (
                                    <div className="mt-6 p-4 bg-green-50 rounded-lg flex items-center gap-3">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                        <p className="text-sm text-green-700 font-medium">
                                            Commande livrée avec succès!
                                        </p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
