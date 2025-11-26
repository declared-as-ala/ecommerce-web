'use client';

import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function StripeCheckoutForm({ amount, onSuccess, clientSecret }: { amount: number; onSuccess: () => void; clientSecret: string }) {
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
            // First, retrieve the payment intent to check its status
            const { paymentIntent, error: retrieveError } = await stripe.retrievePaymentIntent(clientSecret);

            if (retrieveError) {
                setErrorMessage(retrieveError.message || 'Erreur lors de la récupération du paiement');
                setIsProcessing(false);
                return;
            }

            // If payment is already succeeded, call onSuccess directly
            if (paymentIntent && paymentIntent.status === 'succeeded') {
                onSuccess();
                setIsProcessing(false);
                return;
            }

            // If payment is processing, don't try to confirm again
            if (paymentIntent && paymentIntent.status === 'processing') {
                setErrorMessage('Le paiement est en cours de traitement. Veuillez patienter...');
                setIsProcessing(false);
                return;
            }

            // Only confirm if the payment intent is in a state that can be confirmed
            if (paymentIntent && (paymentIntent.status === 'requires_payment_method' || paymentIntent.status === 'requires_confirmation')) {
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
            } else if (paymentIntent && paymentIntent.status !== 'succeeded' && paymentIntent.status !== 'processing') {
                // Payment is in an unexpected state
                setErrorMessage('Le paiement est dans un état inattendu. Veuillez réessayer.');
            }
        } catch (err: any) {
            // If error is about already succeeded, treat it as success
            if (err.code === 'payment_intent_unexpected_state' && err.payment_intent?.status === 'succeeded') {
                onSuccess();
            } else {
                setErrorMessage(err.message || 'Une erreur est survenue');
            }
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
            <StripeCheckoutForm amount={amount} onSuccess={onSuccess} clientSecret={clientSecret} />
        </Elements>
    );
}
