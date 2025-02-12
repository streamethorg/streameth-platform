import { CreateCheckoutSessionDto } from "@dtos/stripe/create-checkout-session.dto";
import { HttpException } from "@exceptions/HttpException";
import OrganizationService from "./organization.service";
import Organization from "@models/organization.model";
import { config } from "@config";

const { apiKey } = config.stripe;

export default class StripeService {
    private stripe: any;
    private organizationService: OrganizationService;

    constructor() {
        if (!apiKey) {
            console.error('❌ STRIPE_SECRET_KEY is not configured in environment variables');
            throw new HttpException(500, 'Stripe secret key is not configured');
        }
        this.stripe = require('stripe')(apiKey);
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
                allow_promotion_codes: true,
                success_url: `${config.frontendUrl}/studio/${data.organizationId}/payments?success=true`,
                cancel_url: `${config.frontendUrl}/studio/${data.organizationId}/payments?canceled=true`,
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

            // Only update if in initial state or failed state
            if (organization.paymentStatus === 'none' || organization.paymentStatus === 'failed') {
                await Organization.updateOne(
                    { 
                      _id: organization._id,
                      $or: [
                        { paymentStatus: 'none' },
                        { paymentStatus: 'failed' }
                      ]
                    },
                    {
                        $set: {
                            paymentStatus: 'pending',
                            lastPaymentIntentId: paymentIntent.id,
                        }
                    }
                );

                console.log('✅ Organization payment status updated to pending');
            } else {
                console.log('⚠️ Skipping payment intent update - organization in state:', organization.paymentStatus);
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

            const { streamingDays, numberOfStages } = session.metadata;
            const streamingDaysNum = parseInt(streamingDays);
            const numberOfStagesNum = parseInt(numberOfStages);

            // Check if organization has an active subscription
            const now = new Date();
            const hasActiveSubscription = organization.expirationDate && organization.expirationDate > now;

            // Calculate expiry date based on subscription status
            let expiryDate;
            if (hasActiveSubscription) {
                expiryDate = new Date(organization.expirationDate);
                expiryDate.setDate(expiryDate.getDate() + streamingDaysNum);
            } else {
                expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + streamingDaysNum);
            }

            // Calculate new total stages and streaming days
            const newPaidStages = hasActiveSubscription 
                ? (organization.paidStages || 0) + numberOfStagesNum 
                : numberOfStagesNum;

            const newStreamingDays = hasActiveSubscription
                ? (organization.streamingDays || 0) + streamingDaysNum
                : streamingDaysNum;

            console.log('📝 Updating organization subscription:', {
                organizationId: organization._id,
                sessionId: session.id,
                hasActiveSubscription,
                currentStages: organization.paidStages,
                newTotalStages: newPaidStages,
                currentStreamingDays: organization.streamingDays,
                newTotalStreamingDays: newStreamingDays,
                amount_subtotal: session.amount_subtotal,
                amount_total: session.amount_total,
                discounts: session.discounts
            });

            const result = await Organization.updateOne(
                { _id: organization._id },
                {
                    $set: {
                        paymentStatus: 'active',
                        streamingDays: newStreamingDays,
                        paidStages: newPaidStages,
                        lastPaymentAmount: session.amount_total,
                        lastPaymentSubtotal: session.amount_subtotal,
                        lastPaymentDate: new Date(),
                        expirationDate: expiryDate,
                        lastPaymentDiscount: session.total_details?.amount_discount || 0,
                        lastCheckoutSessionId: session.id
                    }
                }
            );

            if (result.modifiedCount === 0) {
                console.log('⚠️ No update performed for organization:', organization._id);
            } else {
                console.log('✅ Organization subscription updated:', {
                    organizationId: organization._id,
                    sessionId: session.id,
                    expiryDate,
                    totalStages: newPaidStages,
                    totalStreamingDays: newStreamingDays,
                    isExtension: hasActiveSubscription,
                    discountApplied: session.total_details?.amount_discount > 0
                });
            }
        } catch (error) {
            console.error('❌ Failed to handle checkout completion:', error);
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

            // Only update if in processing or pending state (to handle race conditions)
            const result = await Organization.updateOne(
                { 
                  _id: organization._id,
                  $or: [
                    { paymentStatus: 'processing' },
                    { paymentStatus: 'pending' }
                  ]
                },
                {
                    $set: {
                        paymentStatus: 'active',
                        streamingDays: streamingDaysNum,
                        paidStages: numberOfStagesNum,
                        lastPaymentAmount: paymentIntent.amount_total !== undefined ? paymentIntent.amount_total : paymentIntent.amount,
                        lastPaymentDate: new Date(),
                        expirationDate: expiryDate,
                    }
                }
            );

            if (result.modifiedCount === 0) {
                console.log('⚠️ No update performed - organization not in expected state:', organization.paymentStatus);
            } else {
                console.log('✅ Organization activated with streaming capabilities until', expiryDate);
            }
        } catch (error) {
            console.error('❌ Failed to handle payment success', error);
            throw error;
        }
    }

    async handlePaymentFailed(paymentIntent: any): Promise<void> {
        try {
            const organization = await this.getOrganizationFromMetadata(paymentIntent.metadata);
            if (!organization) return;

            // Update to failed state if not already active
            const result = await Organization.updateOne(
                { 
                  _id: organization._id,
                  paymentStatus: { $ne: 'active' }
                },
                {
                    $set: {
                        paymentStatus: 'failed',
                        lastPaymentError: paymentIntent.last_payment_error?.message,
                    }
                }
            );

            if (result.modifiedCount === 0) {
                console.log('⚠️ No update performed - organization already in final state');
            } else {
                console.log('✅ Organization updated with payment failure');
            }
        } catch (error) {
            console.error('❌ Failed to handle payment failure', error);
            throw error;
        }
    }
}