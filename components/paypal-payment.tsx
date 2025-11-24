'use client';

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useState } from 'react';
import { toast } from 'sonner';

export function PayPalPayment({
    createOrder,
    onApprove,
}: {
    createOrder: () => Promise<string>;
    onApprove: (data: any) => Promise<void>;
}) {
    const [isProcessing, setIsProcessing] = useState(false);

    const initialOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: 'EUR',
        intent: 'capture',
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <div className="mt-4">
                <PayPalButtons
                    style={{ layout: 'vertical', label: 'pay' }}
                    disabled={isProcessing}
                    createOrder={async (data, actions) => {
                        try {
                            return await createOrder();
                        } catch (error) {
                            console.error('Error creating PayPal order:', error);
                            throw error;
                        }
                    }}
                    onApprove={async (data, actions) => {
                        setIsProcessing(true);
                        try {
                            await onApprove(data);
                        } catch (error) {
                            console.error('Error capturing PayPal order:', error);
                            toast.error('Erreur lors du paiement PayPal');
                        } finally {
                            setIsProcessing(false);
                        }
                    }}
                    onError={(err) => {
                        console.error('PayPal error:', err);
                        toast.error('Erreur PayPal');
                        setIsProcessing(false);
                    }}
                />
            </div>
        </PayPalScriptProvider>
    );
}
