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
import { Shield, Loader2, Check, MapPin, Store, Truck, CreditCard, Wallet, AlertCircle, Info } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { ordersApi } from '@/lib/api/orders';
import { paymentsApi } from '@/lib/api/payments';
import { PayPalPayment } from '@/components/paypal-payment';
import { StripePayment } from '@/components/stripe-payment';
import { DELIVERY_TIME_SLOTS, DELIVERY_FEE, isDeliveryZoneAvailable, getDeliveryZoneByPostalCode, getPostalCodeSuggestions, DELIVERY_ZONES } from '@/lib/constants';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const checkoutSchema = z.object({
    fullName: z.string().min(2, 'Le nom complet est requis'),
    email: z.string().email('Email invalide'),
    phone: z.string().min(10, 'Numéro de téléphone invalide'),
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
}).refine((data) => {
    if (data.pickupType === 'delivery') {
        if (!data.street || !data.postalCode || !data.city) {
            return false;
        }
        if (!isDeliveryZoneAvailable(data.postalCode)) {
            return false;
        }
    }
    return true;
}, {
    message: 'Code postal non disponible pour la livraison',
    path: ['postalCode'],
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, getCartTotal, clearCart, user, isAuthenticated } = useStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
    const [showPaymentUI, setShowPaymentUI] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [postalCodeSuggestions, setPostalCodeSuggestions] = useState<any[]>([]);
    const [selectedZone, setSelectedZone] = useState<any>(null);
    const [showZonesModal, setShowZonesModal] = useState(false);

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
            paymentMethod: 'espèces',
        },
    });

    const pickupType = watch('pickupType');
    const paymentMethod = watch('paymentMethod');
    const postalCode = watch('postalCode');
    const deliveryFee = pickupType === 'delivery' ? DELIVERY_FEE : 0;
    const total = cartTotal + deliveryFee;

    // Update payment method when pickup type changes and clear fields
    useEffect(() => {
        if (pickupType === 'store') {
            setValue('paymentMethod', 'espèces');
            // Clear delivery fields
            setValue('street', '');
            setValue('postalCode', '');
            setValue('city', '');
            setValue('deliveryTime', '');
            setSelectedZone(null);
            setPostalCodeSuggestions([]);
        } else {
            // Clear store pickup location
            setValue('pickupLocation', '');
        }
    }, [pickupType, setValue]);

    // Handle postal code validation
    useEffect(() => {
        if (postalCode && pickupType === 'delivery') {
            const cleanCode = postalCode.replace(/\s/g, '').padStart(5, '0');
            const zone = getDeliveryZoneByPostalCode(cleanCode);
            if (zone) {
                setSelectedZone(zone);
                setValue('city', zone.ville);
                setPostalCodeSuggestions([]);
            } else {
                setSelectedZone(null);
                const suggestions = getPostalCodeSuggestions(cleanCode);
                setPostalCodeSuggestions(suggestions);
            }
        } else {
            setSelectedZone(null);
            setPostalCodeSuggestions([]);
        }
    }, [postalCode, pickupType, setValue]);

    const createOrderData = (data: CheckoutForm) => {
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

                // Show success message
                toast.success('✅ Commande créée avec succès! Vous paierez à la livraison.', {
                    duration: 4000,
                });
                // Clear cart
                clearCart();
                // Small delay to show the success message before redirect
                setTimeout(() => {
                    router.push('/orders');
                }, 500);

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
            // Show success message
            toast.success('✅ Paiement réussi! Votre commande a été confirmée.', {
                duration: 4000,
            });
            // Clear cart
            clearCart();
            // Small delay to show the success message before redirect
            setTimeout(() => {
                router.push('/orders');
            }, 500);
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
            const formData = watch();
            const orderData = createOrderData(formData);
            await ordersApi.createOrder({
                ...orderData,
                status: 'payé',
            });
            // Show success message
            toast.success('✅ Paiement PayPal réussi! Votre commande a été confirmée.', {
                duration: 4000,
            });
            // Clear cart
            clearCart();
            // Small delay to show the success message before redirect
            setTimeout(() => {
                router.push('/orders');
            }, 500);
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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
                <Card className="p-8 sm:p-12 text-center border-none shadow-lg max-w-md w-full">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">Votre panier est vide</h2>
                    <Link href="/products"><Button className="bg-gradient-to-r from-green-600 to-emerald-600">Retour aux produits</Button></Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
            <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-3 sm:py-4">
                    <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                        <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Les Délices</span>
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Finaliser</span> ma commande
                </h1>

                <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {!showPaymentUI ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                                {/* Step 1: Personal Info */}
                                <Card className="p-4 sm:p-6 border-none shadow-lg">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center justify-center mr-2 sm:mr-3 text-sm sm:text-base">1</div>
                                        Informations personnelles
                                    </h2>
                                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div className="sm:col-span-2">
                                            <Label htmlFor="fullName" className="text-sm sm:text-base">Nom complet *</Label>
                                            <Input id="fullName" {...register('fullName')} className="mt-1 h-10 sm:h-11" />
                                            {errors.fullName && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.fullName.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="email" className="text-sm sm:text-base">Email *</Label>
                                            <Input id="email" type="email" {...register('email')} className="mt-1 h-10 sm:h-11" />
                                            {errors.email && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.email.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="phone" className="text-sm sm:text-base">Téléphone *</Label>
                                            <Input id="phone" {...register('phone')} className="mt-1 h-10 sm:h-11" />
                                            {errors.phone && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.phone.message}</p>}
                                        </div>
                                    </div>
                                </Card>

                                {/* Step 2: Delivery/Pickup */}
                                <Card className="p-4 sm:p-6 border-none shadow-lg">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center justify-center mr-2 sm:mr-3 text-sm sm:text-base">2</div>
                                        Mode de réception
                                    </h2>
                                    <RadioGroup 
                                        value={pickupType} 
                                        onValueChange={(val) => {
                                            setValue('pickupType', val as any, { shouldValidate: false });
                                        }}
                                    >
                                        <div className="space-y-3">
                                            <div 
                                                className={`flex items-center space-x-3 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${pickupType === 'store' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                                                onClick={() => setValue('pickupType', 'store', { shouldValidate: false })}
                                            >
                                                <RadioGroupItem value="store" id="store" />
                                                <div className="flex-1 flex items-center gap-2 sm:gap-3">
                                                    <Store className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                                                    <div>
                                                        <Label htmlFor="store" className="cursor-pointer font-semibold text-sm sm:text-base">Retrait en magasin</Label>
                                                        <p className="text-xs sm:text-sm text-gray-600">Gratuit</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div 
                                                className={`flex items-center space-x-3 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${pickupType === 'delivery' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                                                onClick={() => setValue('pickupType', 'delivery', { shouldValidate: false })}
                                            >
                                                <RadioGroupItem value="delivery" id="delivery" />
                                                <div className="flex-1 flex items-center gap-2 sm:gap-3">
                                                    <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                                                    <div className="flex-1">
                                                        <Label htmlFor="delivery" className="cursor-pointer font-semibold text-sm sm:text-base">Livraison à domicile</Label>
                                                        <p className="text-xs sm:text-sm text-gray-600">{formatPrice(DELIVERY_FEE)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </RadioGroup>

                                    {pickupType === 'store' && (
                                        <div className="mt-4 sm:mt-6 space-y-3">
                                            <h3 className="font-semibold text-base sm:text-lg mb-3 flex items-center gap-2">
                                                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                                Sélectionnez un magasin
                                            </h3>
                                            <RadioGroup value={watch('pickupLocation') || ''} onValueChange={(val) => setValue('pickupLocation', val)}>
                                                <div className="space-y-3">
                                                    <div className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${watch('pickupLocation') === 'vincennes' ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 hover:border-green-300 hover:shadow-sm'}`}>
                                                        <div className="flex items-start space-x-3">
                                                            <RadioGroupItem value="vincennes" id="vincennes" className="mt-1" />
                                                            <div className="flex-1">
                                                                <Label htmlFor="vincennes" className="cursor-pointer">
                                                                    <div className="font-bold text-base sm:text-lg mb-1 text-gray-900">AU VERGER DU PARC</div>
                                                                    <div className="text-xs sm:text-sm text-green-600 font-medium mb-2">✓ Retrait gratuit</div>
                                                                    <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                                                        3 AVENUE DES MURS DU PARC<br />
                                                                        94300, VINCENNES, France
                                                                    </div>
                                                                </Label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${watch('pickupLocation') === 'gournay' ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 hover:border-green-300 hover:shadow-sm'}`}>
                                                        <div className="flex items-start space-x-3">
                                                            <RadioGroupItem value="gournay" id="gournay" className="mt-1" />
                                                            <div className="flex-1">
                                                                <Label htmlFor="gournay" className="cursor-pointer">
                                                                    <div className="font-bold text-base sm:text-lg mb-1 text-gray-900">LE VERGER DE GOURNAY</div>
                                                                    <div className="text-xs sm:text-sm text-green-600 font-medium mb-2">✓ Retrait gratuit</div>
                                                                    <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                                                        4 av paul doumer<br />
                                                                        93460, GOURNAY SUR MARNE, France
                                                                    </div>
                                                                </Label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${watch('pickupLocation') === 'paris' ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 hover:border-green-300 hover:shadow-sm'}`}>
                                                        <div className="flex items-start space-x-3">
                                                            <RadioGroupItem value="paris" id="paris" className="mt-1" />
                                                            <div className="flex-1">
                                                                <Label htmlFor="paris" className="cursor-pointer">
                                                                    <div className="font-bold text-base sm:text-lg mb-1 text-gray-900">LA CORBEILLE SAINT FARGEAU</div>
                                                                    <div className="text-xs sm:text-sm text-green-600 font-medium mb-2">✓ Retrait gratuit</div>
                                                                    <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                                                        173 av Gambetta<br />
                                                                        75020, Paris, France
                                                                    </div>
                                                                </Label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                            {errors.pickupLocation && (
                                                <p className="text-red-600 text-xs sm:text-sm flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    {errors.pickupLocation.message}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {pickupType === 'delivery' && (
                                        <div className="mt-4 sm:mt-6 space-y-3 p-4 sm:p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <Label htmlFor="postalCode" className="text-sm sm:text-base">Code postal *</Label>
                                                <Dialog open={showZonesModal} onOpenChange={setShowZonesModal}>
                                                    <DialogTrigger asChild>
                                                        <Button 
                                                            type="button" 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="text-xs sm:text-sm h-7 sm:h-8"
                                                        >
                                                            <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                                            Zones disponibles
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-xl sm:text-2xl">Zones de livraison disponibles</DialogTitle>
                                                            <DialogDescription className="text-sm sm:text-base">
                                                                Nous livrons uniquement dans les zones suivantes
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                                                            {DELIVERY_ZONES.map((zone) => (
                                                                <div 
                                                                    key={zone.code_postal} 
                                                                    className="p-3 sm:p-4 border rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer"
                                                                    onClick={() => {
                                                                        setValue('postalCode', zone.code_postal);
                                                                        setValue('city', zone.ville);
                                                                        setShowZonesModal(false);
                                                                    }}
                                                                >
                                                                    <div className="font-semibold text-sm sm:text-base text-gray-900">{zone.code_postal}</div>
                                                                    <div className="text-xs sm:text-sm text-gray-600 mt-1">{zone.ville}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                            <div>
                                                <Label htmlFor="street" className="text-sm sm:text-base">Rue et numéro *</Label>
                                                <Input id="street" placeholder="Ex: 123 Rue de la Paix" {...register('street')} className="mt-1 h-10 sm:h-11" />
                                                {errors.street && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.street.message}</p>}
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Input id="postalCode" placeholder="Ex: 94300" {...register('postalCode')} className="mt-1 h-10 sm:h-11" maxLength={5} />
                                                    {selectedZone && (
                                                        <p className="text-green-600 text-xs sm:text-sm mt-1 flex items-center gap-1">
                                                            <Check className="h-3 w-3" />
                                                            {selectedZone.ville}
                                                        </p>
                                                    )}
                                                    {errors.postalCode && (
                                                        <p className="text-red-600 text-xs sm:text-sm mt-1 flex items-center gap-1">
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.postalCode.message}
                                                        </p>
                                                    )}
                                                    {postalCodeSuggestions.length > 0 && !selectedZone && (
                                                        <div className="mt-2 space-y-1">
                                                            {postalCodeSuggestions.map((zone) => (
                                                                <button
                                                                    key={zone.code_postal}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setValue('postalCode', zone.code_postal);
                                                                        setValue('city', zone.ville);
                                                                    }}
                                                                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 block"
                                                                >
                                                                    {zone.code_postal} - {zone.ville}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label htmlFor="city" className="text-sm sm:text-base">Ville *</Label>
                                                    <Input id="city" placeholder="Ex: Vincennes" {...register('city')} className="mt-1 h-10 sm:h-11" readOnly={!!selectedZone} />
                                                    {errors.city && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.city.message}</p>}
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="deliveryTime" className="text-sm sm:text-base">Heure de livraison</Label>
                                                <select {...register('deliveryTime')} className="w-full p-2 sm:p-3 border rounded-lg mt-1 h-10 sm:h-11 bg-white">
                                                    <option value="">Sélectionnez un créneau</option>
                                                    {DELIVERY_TIME_SLOTS.map(slot => (
                                                        <option key={slot} value={slot}>{slot}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </Card>

                                {/* Step 3: Payment Selection */}
                                <Card className="p-4 sm:p-6 border-none shadow-lg">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center justify-center mr-2 sm:mr-3 text-sm sm:text-base">3</div>
                                        Paiement
                                    </h2>
                                    <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-lg">
                                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                        <span className="text-xs sm:text-sm text-green-700 font-medium">Paiement 100% sécurisé</span>
                                    </div>

                                    <RadioGroup value={paymentMethod} onValueChange={(val) => setValue('paymentMethod', val as any)}>
                                        <div className="space-y-3">
                                            {pickupType === 'store' && (
                                                <div className={`flex items-center space-x-3 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'espèces' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                                                    <RadioGroupItem value="espèces" id="cash-store" />
                                                    <div className="flex-1 flex items-center gap-2 sm:gap-3">
                                                        <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                                                        <div>
                                                            <Label htmlFor="cash-store" className="cursor-pointer font-semibold text-sm sm:text-base">Espèces (au retrait)</Label>
                                                            <p className="text-xs sm:text-sm text-gray-600">Payez directement au magasin</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className={`flex items-center space-x-3 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                                                <RadioGroupItem value="stripe" id="stripe" />
                                                <div className="flex-1 flex items-center gap-2 sm:gap-3">
                                                    <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                                                    <div>
                                                        <Label htmlFor="stripe" className="cursor-pointer font-semibold text-sm sm:text-base">Carte bancaire</Label>
                                                        <p className="text-xs sm:text-sm text-gray-600">Visa, Mastercard, etc.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`flex items-center space-x-3 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                                                <RadioGroupItem value="paypal" id="paypal" />
                                                <div className="flex-1 flex items-center gap-2 sm:gap-3">
                                                    <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                                                    <div>
                                                        <Label htmlFor="paypal" className="cursor-pointer font-semibold text-sm sm:text-base">PayPal</Label>
                                                        <p className="text-xs sm:text-sm text-gray-600">Paiement sécurisé</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {pickupType === 'delivery' && (
                                                <div className={`flex items-center space-x-3 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'espèces' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                                                    <RadioGroupItem value="espèces" id="cash-delivery" />
                                                    <div className="flex-1 flex items-center gap-2 sm:gap-3">
                                                        <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                                                        <div>
                                                            <Label htmlFor="cash-delivery" className="cursor-pointer font-semibold text-sm sm:text-base">Espèces (à la livraison)</Label>
                                                            <p className="text-xs sm:text-sm text-gray-600">Payez à la réception</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </RadioGroup>

                                    <Button
                                        type="submit"
                                        disabled={isProcessing}
                                        size="lg"
                                        className="w-full h-12 sm:h-14 mt-4 sm:mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-base sm:text-lg font-semibold shadow-lg"
                                    >
                                        {isProcessing ? (
                                            <><Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />Traitement...</>
                                        ) : (
                                            <><Check className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />{paymentMethod === 'espèces' ? 'Confirmer la commande' : 'Continuer vers le paiement'}</>
                                        )}
                                    </Button>
                                </Card>
                            </form>
                        ) : (
                            <Card className="p-4 sm:p-6 border-none shadow-lg">
                                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center justify-center mr-2 sm:mr-3 text-sm sm:text-base">3</div>
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
                        <Card className="p-4 sm:p-6 border-none shadow-2xl sticky top-4">
                            <h3 className="font-bold text-lg sm:text-xl mb-4">Récapitulatif</h3>
                            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 max-h-60 sm:max-h-80 overflow-y-auto">
                                {cart.map(item => (
                                    <div key={`${item.product.id}-${item.variant.variant_id}`} className="flex justify-between text-xs sm:text-sm">
                                        <span className="flex-1 pr-2">{item.product.title} ×{item.quantity}</span>
                                        <span className="font-medium">{formatPrice(item.variant.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-3 sm:my-4" />
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex justify-between text-sm sm:text-base">
                                    <span>Sous-total</span>
                                    <span className="font-semibold">{formatPrice(cartTotal)}</span>
                                </div>
                                {deliveryFee > 0 && (
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span>Livraison</span>
                                        <span className="font-semibold">{formatPrice(deliveryFee)}</span>
                                    </div>
                                )}
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-lg sm:text-xl font-bold">Total</span>
                                    <span className="text-xl sm:text-2xl font-bold text-green-600">{formatPrice(total)}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
