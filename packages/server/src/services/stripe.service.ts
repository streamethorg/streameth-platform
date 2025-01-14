import { CreateCheckoutSessionDto } from "@dtos/stripe/create-checkout-session.dto";
import { SendApiResponse } from "@utils/api.response";

export class StripeService {
    private stripe: any;

    constructor() {
        const stripeKey = process.env.STRIPE_SECRET_KEY_FILE;
        if (!stripeKey) {
            console.error('❌ STRIPE_SECRET_KEY is not configured in environment variables');
            throw new Error('Stripe secret key is not configured');
        }
        this.stripe = require('stripe')(stripeKey);
    }

    async createCheckoutSession(data: CreateCheckoutSessionDto) {
        try {
            console.log('🔵 Creating Stripe checkout session...', { data });

            const session = await this.stripe.checkout.sessions.create({
                mode: 'payment',
                automatic_tax: { enabled: true },
                line_items: [
                    {
                        price_data: {
                            unit_amount: data.totalPrice * 100, // Convert to cents
                            currency: 'usd',
                            product_data: {
                                name: `StreamETH Event Package`,
                                description: `${data.streamingDays} days of streaming with ${data.numberOfStages} stages`,
                            }
                        },
                        quantity: 1,
                    }
                ],
                success_url: `${process.env.BASE_URL}/studio/${data.organizationId}/payments?success=true`,
                cancel_url: `${process.env.BASE_URL}/studio/${data.organizationId}/payments?canceled=true`,
                metadata: {
                    organizationId: data.organizationId,
                    streamingDays: data.streamingDays,
                    numberOfStages: data.numberOfStages,
                }
            });

            console.log('✅ Stripe checkout session created successfully', { sessionId: session.id });

            // TODO: Update organization model with pending payment status and session details
            // This should be done in a separate service (OrganizationService) 
            // and potentially use a transaction to ensure data consistency

            return SendApiResponse('Checkout session created', { url: session.url });
        } catch (error) {
            console.error('❌ Failed to create Stripe checkout session', error);
            throw error;
        }
    }
}