// Order types matching backend model
export interface OrderItem {
    productId: string;
    variantId: string;
    productTitle: string;
    variantName: string;
    unitType: 'weight' | 'piece';
    grams: number | null;
    quantity: number;
    price: number;
    total: number;
    image: string;
    currency: string;
}

export interface OrderCustomer {
    fullName: string;
    email: string;
    phone: string;
    isAdmin?: boolean;
}

export interface PickupLocation {
    id: string;
    name: string;
    address: string;
    description: string;
}

export interface DeliveryAddress {
    street: string;
    postalCode: string;
    city: string;
    country: string;
}

export interface Order {
    _id?: string;
    id?: string;
    items: OrderItem[];
    customer: OrderCustomer;
    pickupType: 'store' | 'delivery';
    pickupLocation?: PickupLocation;
    deliveryAddress?: DeliveryAddress;
    deliveryTime?: string;
    deliveryFee: number;
    amount: number;
    currency: string;
    discountCode?: string;
    discountAmount: number;
    status: 'en_attente' | 'payé' | 'terminé' | 'annulé';
    paymentMethod: 'stripe' | 'paypal' | 'espèces';
    stripePaymentIntentId?: string;
    paypalOrderId?: string;
    notes?: string;
    isDelivered: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export type OrderStatus = 'en_attente' | 'payé' | 'terminé' | 'annulé';
export type PaymentMethod = 'stripe' | 'paypal' | 'espèces';
export type PickupType = 'store' | 'delivery';
