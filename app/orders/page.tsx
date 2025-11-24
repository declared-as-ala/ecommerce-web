'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/lib/store';
import { ordersApi } from '@/lib/api/orders';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

const statusConfig = {
    'en_attente': { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: Package },
    'payé': { label: 'Payé', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
    'terminé': { label: 'Terminé', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    'annulé': { label: 'Annulé', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function OrdersPage() {
    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: () => ordersApi.getMyOrders(),
    });

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
                <header className="border-b bg-white/90 backdrop-blur-md">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center space-x-3">
                                <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
                                <span className="text-xl font-bold">Les Délices</span>
                            </Link>
                            <nav className="flex gap-4">
                                <Link href="/products"><Button variant="outline">Produits</Button></Link>
                                <Link href="/cart"><Button variant="outline">Panier</Button></Link>
                            </nav>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold mb-8">
                        Mes <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Commandes</span>
                    </h1>

                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Card key={i} className="p-6">
                                    <div className="flex justify-between mb-4">
                                        <Skeleton className="h-6 w-40" />
                                        <Skeleton className="h-6 w-24" />
                                    </div>
                                    <Skeleton className="h-20 w-full" />
                                </Card>
                            ))}
                        </div>
                    ) : orders && orders.length > 0 ? (
                        <div className="space-y-6">
                            {orders.map((order: any) => {
                                const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig['en_attente'];
                                const StatusIcon = status.icon;

                                return (
                                    <Card key={order._id || order.id} className="p-6 border-none shadow-lg hover:shadow-xl transition">
                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-full bg-green-100">
                                                    <ShoppingBag className="h-6 w-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-lg">Commande #{order._id?.slice(-8) || 'N/A'}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {formatDate(order.createdAt || new Date())}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge className={status.color}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {status.label}
                                                </Badge>
                                                <span className="text-2xl font-bold text-green-600">
                                                    {formatPrice(order.amount)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Mode de livraison</p>
                                                <p className="font-medium flex items-center gap-2">
                                                    {order.pickupType === 'delivery' ? (
                                                        <><Truck className="h-4 w-4" /> Livraison</>
                                                    ) : (
                                                        <><Package className="h-4 w-4" /> Retrait</>
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Paiement</p>
                                                <p className="font-medium capitalize">{order.paymentMethod}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Articles</p>
                                                <p className="font-medium">{order.items?.length || 0} produit(s)</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link href={`/orders/${order._id || order.id}`} className="flex-1">
                                                <Button variant="outline" className="w-full">
                                                    Voir les détails
                                                </Button>
                                            </Link>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="p-12 text-center border-none shadow-lg">
                            <div className="inline-flex p-6 rounded-full bg-gray-100 mb-4">
                                <ShoppingBag className="h-16 w-16 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Aucune commande</h3>
                            <p className="text-gray-600 mb-6">
                                Vous n'avez pas encore passé de commande
                            </p>
                            <Link href="/products">
                                <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                                    Découvrir nos produits
                                </Button>
                            </Link>
                        </Card>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
