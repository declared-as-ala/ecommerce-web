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
import { ShoppingBag, Package, Truck, CheckCircle, XCircle, ArrowRight, Calendar, CreditCard, MapPin } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

const statusConfig = {
    'en_attente': { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: Package },
    'payé': { label: 'Payé', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
    'terminé': { label: 'Terminé', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    'annulé': { label: 'Annulé', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function OrdersPage() {
    const { cart, favorites, isAuthenticated, user } = useStore();
    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: () => ordersApi.getMyOrders(),
    });

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
                <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center space-x-3">
                                <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
                                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    Les Délices
                                </span>
                            </Link>
                            <nav className="flex items-center gap-4">
                                <Link href="/products"><Button variant="outline" size="sm">Produits</Button></Link>
                                <Link href="/favorites" className="relative">
                                    <Button variant="outline" size="sm" className="relative">
                                        Favoris
                                        {favorites.length > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                {favorites.length}
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                                <Link href="/cart" className="relative">
                                    <Button variant="outline" size="sm" className="relative">
                                        Panier
                                        {cart.length > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                {cart.length}
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                                {isAuthenticated && (
                                    <Link href="/profile">
                                        <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600">
                                            {user?.firstName || 'Profil'}
                                        </Button>
                                    </Link>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="mb-8 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                            Mes <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Commandes</span>
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Gérez et suivez toutes vos commandes
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="space-y-4 sm:space-y-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Card key={i} className="p-4 sm:p-6 border-none shadow-lg">
                                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                                        <Skeleton className="h-6 w-40" />
                                        <Skeleton className="h-6 w-24" />
                                    </div>
                                    <Skeleton className="h-20 w-full" />
                                </Card>
                            ))}
                        </div>
                    ) : orders && orders.length > 0 ? (
                        <div className="space-y-4 sm:space-y-6">
                            {orders.map((order: any) => {
                                const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig['en_attente'];
                                const StatusIcon = status.icon;

                                return (
                                    <Card key={order._id || order.id} className="p-4 sm:p-6 md:p-8 border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-green-100 to-emerald-100">
                                                    <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-base sm:text-lg text-gray-900">
                                                        Commande #{order._id?.slice(-8).toUpperCase() || 'N/A'}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                                                        <p className="text-xs sm:text-sm text-gray-600">
                                                            {formatDate(order.createdAt || new Date())}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                                                <Badge className={`${status.color} text-xs sm:text-sm px-3 py-1`}>
                                                    <StatusIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                                    {status.label}
                                                </Badge>
                                                <span className="text-xl sm:text-2xl font-bold text-green-600">
                                                    {formatPrice(order.amount)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-br from-gray-50 to-green-50 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-blue-100">
                                                    {order.pickupType === 'delivery' ? (
                                                        <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                                    ) : (
                                                        <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Mode de livraison</p>
                                                    <p className="font-semibold text-sm sm:text-base text-gray-900">
                                                        {order.pickupType === 'delivery' ? 'Livraison' : 'Retrait'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-purple-100">
                                                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Paiement</p>
                                                    <p className="font-semibold text-sm sm:text-base text-gray-900 capitalize">
                                                        {order.paymentMethod || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-green-100">
                                                    <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Articles</p>
                                                    <p className="font-semibold text-sm sm:text-base text-gray-900">
                                                        {order.items?.length || 0} produit{order.items?.length > 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <Link href={`/orders/${order._id || order.id}`}>
                                            <Button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                                                Voir les détails
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="p-8 sm:p-12 text-center border-none shadow-lg bg-white">
                            <div className="inline-flex p-4 sm:p-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 sm:mb-6">
                                <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                            </div>
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-gray-900">Aucune commande</h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
                                Vous n'avez pas encore passé de commande. Découvrez nos produits frais et commencez vos achats !
                            </p>
                            <Link href="/products">
                                <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                                    Découvrir nos produits
                                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                                </Button>
                            </Link>
                        </Card>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
