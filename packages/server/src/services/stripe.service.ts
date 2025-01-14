import { CreateCheckoutSessionDto } from "@dtos/stripe/create-checkout-session.dto";
import { HttpException } from "@exceptions/HttpException";
import OrganizationService from "./organization.service";
import Organization from "@models/organization.model";

export default class StripeService {
    private stripe: any;
    private organizationService: OrganizationService;

    constructor() {
        const stripeKey = process.env.STRIPE_SECRET_KEY_FILE;
        if (!stripeKey) {
            console.error('❌ STRIPE_SECRET_KEY is not configured in environment variables');
            throw new HttpException(500, 'Stripe secret key is not configured');
        }
        this.stripe = require('stripe')(stripeKey);
        this.organizationService = new OrganizationService();
    }

    async createCheckoutSession(data: CreateCheckoutSessionDto): Promise<{ url: string }> {
        try {
            console.log('🔵 Creating Stripe checkout session...', { data });

            // Verify organization exists before creating session
            const organization = await this.organizationService.get(data.organizationId);
            if (!organization) {
                throw new HttpException(404, 'Organization not found');
            }

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
                    organizationId: organization._id.toString(), // Use _id instead of slug
                    organizationSlug: data.organizationId,  // Keep slug for URLs
                    streamingDays: data.streamingDays,
                    numberOfStages: data.numberOfStages,
                },
                payment_intent_data: {
                    metadata: {
                        organizationId: organization._id.toString(), // Duplicate metadata for payment intent
                        organizationSlug: data.organizationId,
                        streamingDays: data.streamingDays,
                        numberOfStages: data.numberOfStages,
                    },
                },
            });

            console.log('✅ Stripe checkout session created', { 
                sessionId: session.id,
                organizationId: organization._id,
                metadata: session.metadata
            });
            return { url: session.url };
        } catch (error) {
            console.error('❌ Failed to create checkout session', error);
            throw new HttpException(400, 'Failed to create checkout session');
        }
    }

    private async getOrganizationFromMetadata(metadata: any): Promise<any> {
        if (!metadata?.organizationId) {
            console.log('⚠️ No organization ID in metadata, skipping update');
            return null;
        }

        try {
            const organization = await Organization.findById(metadata.organizationId);
            if (!organization) {
                console.log('⚠️ Organization not found:', metadata.organizationId);
                return null;
            }
            return organization;
        } catch (error) {
            console.error('❌ Error fetching organization:', error);
            return null;
        }
    }

    async handlePaymentIntentCreated(paymentIntent: any): Promise<void> {
        try {
            const organization = await this.getOrganizationFromMetadata(paymentIntent.metadata);
            if (!organization) return;

            // Only update if not in a final state
            if (organization.paymentStatus !== 'active' && organization.paymentStatus !== 'failed') {
                await Organization.updateOne(
                    { _id: organization._id },
                    {
                        $set: {
                            paymentStatus: 'pending',
                            lastPaymentIntentId: paymentIntent.id,
                        }
                    }
                );

                console.log('✅ Organization payment status updated to pending');
            }
        } catch (error) {
            console.error('❌ Failed to handle payment intent created', error);
            throw error;
        }
    }

    async handleCheckoutCompleted(session: any): Promise<void> {
        try {
            const organization = await this.getOrganizationFromMetadata(session.metadata);
            if (!organization) return;

            // Only update if not in a final state
            if (organization.paymentStatus !== 'active' && organization.paymentStatus !== 'failed') {
                await Organization.updateOne(
                    { _id: organization._id },
                    {
                        $set: {
                            paymentStatus: 'processing',
                            customerId: session.customer,
                            lastCheckoutSessionId: session.id,
                        }
                    }
                );

                console.log('✅ Organization updated with checkout session data');
            }
        } catch (error) {
            console.error('❌ Failed to handle checkout completion', error);
            throw error;
        }
    }

    async handlePaymentSucceeded(paymentIntent: any): Promise<void> {
        try {
            const organization = await this.getOrganizationFromMetadata(paymentIntent.metadata);
            if (!organization) return;

            const { streamingDays, numberOfStages } = paymentIntent.metadata;
            const streamingDaysNum = parseInt(streamingDays);
            const numberOfStagesNum = parseInt(numberOfStages);

            // Calculate expiry date: current date + streaming days
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + streamingDaysNum);

            console.log('📅 Calculated streaming access expiry:', {
                streamingDays: streamingDaysNum,
                expiryDate,
            });

            // This is a final state, always update
            await Organization.updateOne(
                { _id: organization._id },
                {
                    $set: {
                        paymentStatus: 'active',
                        streamingDays: streamingDaysNum,
                        numberOfStages: numberOfStagesNum,
                        lastPaymentAmount: paymentIntent.amount,
                        lastPaymentDate: new Date(),
                        expirationDate: expiryDate,
                    }
                }
            );

            console.log('✅ Organization activated with streaming capabilities until', expiryDate);
        } catch (error) {
            console.error('❌ Failed to handle payment success', error);
            throw error;
        }
    }

    async handlePaymentFailed(paymentIntent: any): Promise<void> {
        try {
            const organization = await this.getOrganizationFromMetadata(paymentIntent.metadata);
            if (!organization) return;

            // This is a final state, always update
            await Organization.updateOne(
                { _id: organization._id },
                {
                    $set: {
                        paymentStatus: 'failed',
                        lastPaymentError: paymentIntent.last_payment_error?.message,
                    }
                }
            );

            console.log('✅ Organization updated with payment failure');
        } catch (error) {
            console.error('❌ Failed to handle payment failure', error);
            throw error;
        }
    }
}