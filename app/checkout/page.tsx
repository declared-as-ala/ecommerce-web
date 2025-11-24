'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Shield, Loader2, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { ordersApi } from '@/lib/api/orders';
import { paymentsApi } from '@/lib/api/payments';
import { PayPalPayment } from '@/components/paypal-payment';
import { StripePayment } from '@/components/stripe-payment';
import { DELIVERY_TIME_SLOTS, DELIVERY_FEE } from '@/lib/constants';
import { toast } from 'sonner';

const checkoutSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    pickupType: z.enum(['store', 'delivery']),
    pickupLocation: z.string().optional(),
    street: z.string().optional(),
    postalCode: z.string().optional(),
    city: z.string().optional(),
    deliveryTime: z.string().optional(),
    paymentMethod: z.enum(['stripe', 'paypal', 'espèces']),
}).refine((data) => {
    if (data.pickupType === 'store') {
        return !!data.pickupLocation;
    }
    return true;
}, {
    message: 'Veuillez sélectionner un magasin',
    path: ['pickupLocation'],
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, getCartTotal, clearCart, user, isAuthenticated } = useStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
    const [showPaymentUI, setShowPaymentUI] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('accessToken');
            if (!token || !isAuthenticated) {
                router.push('/login?redirect=/checkout');
                return;
            }
            setIsCheckingAuth(false);
        };
        checkAuth();
    }, [isAuthenticated, router]);

    const cartTotal = getCartTotal();

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutForm>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            fullName: user ? `${user.firstName} ${user.lastName}` : '',
            email: user?.email || '',
            phone: user?.phone || '',
            pickupType: 'store',
            paymentMethod: 'stripe',
        },
    });

    const pickupType = watch('pickupType');
    const paymentMethod = watch('paymentMethod');
    const deliveryFee = pickupType === 'delivery' ? DELIVERY_FEE : 0;
    const total = cartTotal + deliveryFee;

    const createOrderData = (data: CheckoutForm) => {
        // Map cart items to the structure expected by the Stripe controller
        const items = cart.map(item => ({
            productId: item.product.id,
            variantId: item.variant.variant_id,
            name: item.product.title,
            variantUnit: item.variant.variant_name || '',
            unitType: item.variant.unit_type,
            grams: item.variant.grams,
            quantity: item.quantity,
            price: item.variant.price,
            image: item.product.Image,
            currency: 'EUR',
        }));

        // Pickup location details based on selection
        const pickupLocations = {
            vincennes: {
                name: 'AU VERGER DU PARC',
                address: '3 AVENUE DES MURS DU PARC, 94300, VINCENNES, France',
            },
            gournay: {
                name: 'LE VERGER DE GOURNAY',
                address: '4 av paul doumer, 93460, GOURNAY SUR MARNE, France',
            },
            paris: {
                name: 'LA CORBEILLE SAINT FARGEAU',
                address: '173 av Gambetta, 75020, Paris, France',
            },
        };

        const pickupLocationDetails = data.pickupType === 'store' && data.pickupLocation ? {
            name: pickupLocations[data.pickupLocation as keyof typeof pickupLocations]?.name || 'Les Délices du Verger',
            address: pickupLocations[data.pickupLocation as keyof typeof pickupLocations]?.address || '',
        } : undefined;

        return {
            items: items,
            customer: {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
            },
            pickupType: data.pickupType,
            pickupLocationDetails,
            deliveryAddress: data.pickupType === 'delivery' ? {
                street: data.street!,
                postalCode: data.postalCode!,
                city: data.city!,
                country: 'France',
            } : undefined,
            deliveryTime: data.deliveryTime,
            deliveryFee,
            amount: total,
            discountCode: '',
            discountAmount: 0,
            currency: 'EUR',
            notes: '',
        };
    };

    const onSubmit = async (data: CheckoutForm) => {
        setIsProcessing(true);
        try {
            const orderData = createOrderData(data);

            if (data.paymentMethod === 'espèces') {
                const orderModelItems = cart.map(item => ({
                    productId: item.product.id,
                    variantId: item.variant.variant_id,
                    productTitle: item.product.title,
                    variantName: item.variant.variant_name || '',
                    unitType: item.variant.unit_type,
                    grams: item.variant.grams,
                    quantity: item.quantity,
                    price: item.variant.price,
                    total: item.variant.price * item.quantity,
                    image: item.product.Image,
                    currency: 'EUR',
                }));

                await ordersApi.createOrder({
                    ...orderData,
                    items: orderModelItems,
                    amount: total,
                    status: 'en_attente',
                    paymentMethod: 'espèces'
                });

                toast.success('Commande créée! Vous paierez à la livraison.');
                clearCart();
                router.push('/orders');

            } else if (data.paymentMethod === 'stripe') {
                const { clientSecret } = await paymentsApi.createStripePayment(orderData);
                setStripeClientSecret(clientSecret);
                setShowPaymentUI(true);

            } else if (data.paymentMethod === 'paypal') {
                setShowPaymentUI(true);
            }
        } catch (error: any) {
            console.error('Checkout Error:', error);
            toast.error(error.response?.data?.message || 'Erreur lors de la commande');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleStripeSuccess = async () => {
        try {
            const data = watch();
            const orderData = createOrderData(data);
            await ordersApi.createOrder({
                ...orderData,
                status: 'payé',
            });
            toast.success('Paiement réussi!');
            clearCart();
            router.push('/orders');
        } catch (error) {
            toast.error('Erreur lors de la création de la commande');
        }
    };

    const handleCreatePayPalOrder = async () => {
        const data = watch();
        const orderData = createOrderData(data);
        const { paypalOrderId } = await paymentsApi.createPayPalOrder(orderData);
        return paypalOrderId;
    };

    const handlePayPalApprove = async (data: any) => {
        try {
            await paymentsApi.capturePayPalPayment(data.orderID);
            toast.success('Paiement PayPal réussi!');
            clearCart();
            router.push('/orders');
        } catch (error) {
            console.error('PayPal Capture Error:', error);
            toast.error('Erreur lors de la confirmation du paiement PayPal');
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <Card className="p-12 text-center">
                    <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
                    <Link href="/products"><Button>Retour aux produits</Button></Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
            <header className="border-b bg-white/90 backdrop-blur-md">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/" className="flex items-center space-x-3">
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
                        <span className="text-xl font-bold">Les Délices</span>
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Finaliser</span> ma commande
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {!showPaymentUI ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Step 1: Personal Info */}
                                <Card className="p-6 border-none shadow-lg">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center justify-center mr-3">1</div>
                                        Informations personnelles
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="fullName">Nom complet *</Label>
                                            <Input id="fullName" {...register('fullName')} className="mt-1" />
                                            {errors.fullName && <p className="text-red-600 text-sm">{errors.fullName.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email *</Label>
                                            <Input id="email" type="email" {...register('email')} className="mt-1" />
                                            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label htmlFor="phone">Téléphone *</Label>
                                            <Input id="phone" {...register('phone')} className="mt-1" />
                                            {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}
                                        </div>
                                    </div>
                                </Card>

                                {/* Step 2: Delivery/Pickup */}
                                <Card className="p-6 border-none shadow-lg">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center justify-center mr-3">2</div>
                                        Mode de réception
                                    </h2>
                                    <RadioGroup value={pickupType} onValueChange={(val) => setValue('pickupType', val as any)}>
                                        <div className="flex items-center space-x-2 p-4 border rounded-lg mb-3">
                                            <RadioGroupItem value="store" id="store" />
                                            <Label htmlFor="store" className="flex-1 cursor-pointer">Retrait en magasin (Gratuit)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                                            <RadioGroupItem value="delivery" id="delivery" />
                                            <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                                                Livraison à domicile ({formatPrice(DELIVERY_FEE)})
                                            </Label>
                                        </div>
                                    </RadioGroup>

                                    {pickupType === 'store' && (
                                        <div className="mt-4 space-y-3">
                                            <h3 className="font-semibold text-lg mb-3">Sélectionnez un magasin</h3>
                                            <RadioGroup value={watch('pickupLocation') || ''} onValueChange={(val) => setValue('pickupLocation', val)}>
                                                <div className="space-y-3">
                                                    <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${watch('pickupLocation') === 'vincennes' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                                                        <div className="flex items-start space-x-3">
                                                            <RadioGroupItem value="vincennes" id="vincennes" className="mt-1" />
                                                            <div className="flex-1">
                                                                <Label htmlFor="vincennes" className="cursor-pointer">
                                                                    <div className="font-semibold text-lg mb-1">Retrait en magasin</div>
                                                                    <div className="text-green-600 font-medium mb-2">GRATUIT</div>
                                                                    <div className="text-gray-700">
                                                                        AU VERGER DU PARC<br />
                                                                        3 AVENUE DES MURS DU PARC<br />
                                                                        94300, VINCENNES, France
                                                                    </div>
                                                                </Label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${watch('pickupLocation') === 'gournay' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                                                        <div className="flex items-start space-x-3">
                                                            <RadioGroupItem value="gournay" id="gournay" className="mt-1" />
                                                            <div className="flex-1">
                                                                <Label htmlFor="gournay" className="cursor-pointer">
                                                                    <div className="font-semibold text-lg mb-1">Retrait en magasin</div>
                                                                    <div className="text-green-600 font-medium mb-2">GRATUIT</div>
                                                                    <div className="text-gray-700">
                                                                        LE VERGER DE GOURNAY<br />
                                                                        4 av paul doumer<br />
                                                                        93460, GOURNAY SUR MARNE, France
                                                                    </div>
                                                                </Label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${watch('pickupLocation') === 'paris' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                                                        <div className="flex items-start space-x-3">
                                                            <RadioGroupItem value="paris" id="paris" className="mt-1" />
                                                            <div className="flex-1">
                                                                <Label htmlFor="paris" className="cursor-pointer">
                                                                    <div className="font-semibold text-lg mb-1">Retrait en magasin</div>
                                                                    <div className="text-green-600 font-medium mb-2">GRATUIT</div>
                                                                    <div className="text-gray-700">
                                                                        LA CORBEILLE SAINT FARGEAU<br />
                                                                        173 av Gambetta<br />
                                                                        75020, Paris, France
                                                                    </div>
                                                                </Label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    )}

                                    {pickupType === 'delivery' && (
                                        <div className="mt-4 space-y-3 p-4 bg-green-50 rounded-lg">
                                            <Input placeholder="Rue et numéro" {...register('street')} />
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input placeholder="Code postal" {...register('postalCode')} />
                                                <Input placeholder="Ville" {...register('city')} />
                                            </div>
                                            <select {...register('deliveryTime')} className="w-full p-2 border rounded-md">
                                                <option value="">Heure de livraison</option>
                                                {DELIVERY_TIME_SLOTS.map(slot => (
                                                    <option key={slot} value={slot}>{slot}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </Card>

                                {/* Step 3: Payment Selection */}
                                <Card className="p-6 border-none shadow-lg">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center justify-center mr-3">3</div>
                                        Paiement
                                    </h2>
                                    <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-lg">
                                        <Shield className="h-5 w-5 text-green-600" />
                                        <span className="text-sm text-green-700 font-medium">Paiement 100% sécurisé</span>
                                    </div>

                                    <RadioGroup value={paymentMethod} onValueChange={(val) => setValue('paymentMethod', val as any)}>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2 p-4 border rounded-lg">
                                                <RadioGroupItem value="stripe" id="stripe" />
                                                <Label htmlFor="stripe" className="flex-1 cursor-pointer">Carte bancaire (Stripe)</Label>
                                            </div>
                                            <div className="flex items-center space-x-2 p-4 border rounded-lg">
                                                <RadioGroupItem value="paypal" id="paypal" />
                                                <Label htmlFor="paypal" className="flex-1 cursor-pointer">PayPal</Label>
                                            </div>
                                            {pickupType === 'delivery' && (
                                                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                                                    <RadioGroupItem value="espèces" id="cash" />
                                                    <Label htmlFor="cash" className="flex-1 cursor-pointer">Espèces (à la livraison)</Label>
                                                </div>
                                            )}
                                        </div>
                                    </RadioGroup>

                                    <Button
                                        type="submit"
                                        disabled={isProcessing}
                                        size="lg"
                                        className="w-full h-14 mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg font-semibold shadow-lg"
                                    >
                                        {isProcessing ? (
                                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Traitement...</>
                                        ) : (
                                            <><Check className="mr-2 h-5 w-5" />Continuer vers le paiement</>
                                        )}
                                    </Button>
                                </Card>
                            </form>
                        ) : (
                            <Card className="p-6 border-none shadow-lg">
                                <h2 className="text-2xl font-bold mb-6 flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center justify-center mr-3">3</div>
                                    Finaliser le paiement
                                </h2>
                                {paymentMethod === 'stripe' && stripeClientSecret && (
                                    <StripePayment
                                        clientSecret={stripeClientSecret}
                                        amount={total * 100}
                                        onSuccess={handleStripeSuccess}
                                    />
                                )}
                                {paymentMethod === 'paypal' && (
                                    <PayPalPayment
                                        createOrder={handleCreatePayPalOrder}
                                        onApprove={handlePayPalApprove}
                                    />
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full mt-4"
                                    onClick={() => {
                                        setShowPaymentUI(false);
                                        setStripeClientSecret(null);
                                    }}
                                >
                                    Retour
                                </Button>
                            </Card>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 border-none shadow-2xl sticky top-4">
                            <h3 className="font-bold text-xl mb-4">Récapitulatif</h3>
                            <div className="space-y-3 mb-6">
                                {cart.map(item => (
                                    <div key={`${item.product.id}-${item.variant.variant_id}`} className="flex justify-between text-sm">
                                        <span>{item.product.title} ×{item.quantity}</span>
                                        <span>{formatPrice(item.variant.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Sous-total</span>
                                    <span className="font-semibold">{formatPrice(cartTotal)}</span>
                                </div>
                                {deliveryFee > 0 && (
                                    <div className="flex justify-between">
                                        <span>Livraison</span>
                                        <span className="font-semibold">{formatPrice(deliveryFee)}</span>
                                    </div>
                                )}
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold">Total</span>
                                    <span className="text-2xl font-bold text-green-600">{formatPrice(total)}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
