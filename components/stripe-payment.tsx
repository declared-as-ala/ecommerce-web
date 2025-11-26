'use client';

import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function StripeCheckoutForm({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
            });

            if (error) {
                setErrorMessage(error.message || 'Une erreur est survenue');
            } else {
                // Payment successful - call onSuccess which will handle cart clearing and redirect
                onSuccess();
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'Une erreur est survenue');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {errorMessage}
                </div>
            )}
            <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Traitement...
                    </>
                ) : (
                    `Payer ${(amount / 100).toFixed(2)} €`
                )}
            </Button>
        </form>
    );
}

export function StripePayment({
    clientSecret,
    amount,
    onSuccess
}: {
    clientSecret: string;
    amount: number;
    onSuccess: () => void;
}) {
    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe' as const,
            variables: {
                colorPrimary: '#16a34a',
            },
        },
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <StripeCheckoutForm amount={amount} onSuccess={onSuccess} />
        </Elements>
    );
}
