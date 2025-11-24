import apiClient from './client';

export const paymentsApi = {
    // Create Stripe payment intent with full order data
    async createStripePayment(orderData: {
        items: any[];
        customer: any;
        pickupType: string;
        pickupLocationDetails?: any;
        deliveryAddress?: any;
        deliveryTime?: string;
        deliveryFee?: number;
        discountCode?: string;
        discountAmount?: number;
        notes?: string;
        currency?: string;
    }): Promise<{ clientSecret: string; paymentIntentId: string }> {
        const response = await apiClient.post('/api/payments/stripe/create-intent', orderData);
        return response.data;
    },

    // Create Stripe payment intent (legacy)
    async createStripeIntent(paymentData: any): Promise<{ clientSecret: string; paymentIntentId: string }> {
        const response = await apiClient.post('/api/payments/stripe/create-intent', paymentData);
        return response.data;
    },

    // Confirm Stripe payment
    async confirmStripePayment(paymentIntentId: string): Promise<any> {
        const response = await apiClient.post('/api/payments/stripe/confirm', { paymentIntentId });
        return response.data;
    },

    // Create PayPal order
    async createPayPalOrder(orderData: any): Promise<{ paypalOrderId: string; approvalUrl: string }> {
        const response = await apiClient.post('/api/payments/paypal/create-order', orderData);
        return response.data;
    },

    // Capture PayPal payment
    async capturePayPalPayment(paypalOrderId: string): Promise<any> {
        const response = await apiClient.post('/api/payments/paypal/capture', { paypalOrderId });
        return response.data;
    },
};
