import { CreateCheckoutSessionDto } from "@dtos/stripe/create-checkout-session.dto";
import { HttpException } from "@exceptions/HttpException";
import OrganizationService from "./organization.service";
import Organization from "@models/organization.model";
import { config } from "@config";

const { apiKey } = config.stripe;

export default class StripeService {
    private stripe: any;
    private organizationService: OrganizationService;
    
    // Product and price ID mapping - these should match your actual Stripe product/price IDs
    private readonly PRODUCTS = {
        creator: {
            id: 'prod_Rw1te1XXeUc9Ui', // Creator product ID
            priceId: 'price_creator_monthly',
            name: 'Creator Plan',
            description: 'Enhanced features for creators with more uploads'
        },
        pro: {
            id: 'prod_Rw1t3ztFF4JGNY', // Content Pro product ID
            priceId: 'price_pro_monthly',
            name: 'Pro Plan',
            description: 'Professional features with multistream support'
        },
        studio: {
            id: 'prod_Rw1tTg4eMPjGr1', // Studio product ID
            priceId: 'price_studio_monthly',
            name: 'Studio Plan',
            description: 'Enterprise features with unlimited uploads and priority support'
        }
    };

    // Tier features mapping to be used in metadata
    private readonly TIER_FEATURES = {
        free: {
            maxVideoLibrarySize: 5,
            maxSeats: 1,
            isLivestreamingEnabled: false,
            isMultistreamEnabled: false,
            isCustomChannelEnabled: false,
            hasPrioritySupport: false
        },
        creator: {
            maxVideoLibrarySize: 10,
            maxSeats: 1,
            isLivestreamingEnabled: true,
            isMultistreamEnabled: false,
            isCustomChannelEnabled: false,
            hasPrioritySupport: false
        },
        pro: {
            maxVideoLibrarySize: 25,
            maxSeats: -1, // -1 denotes unlimited in metadata
            isLivestreamingEnabled: true,
            isMultistreamEnabled: true,
            isCustomChannelEnabled: true,
            hasPrioritySupport: false
        },
        studio: {
            maxVideoLibrarySize: 50,
            maxSeats: -1, // -1 denotes unlimited in metadata
            isLivestreamingEnabled: true,
            isMultistreamEnabled: true,
            isCustomChannelEnabled: true,
            hasPrioritySupport: true
        }
    };

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
            
            // Determine the subscription tier based on price
            const tier = data.tier || this.getTierFromPrice(data.totalPrice);
            const tierProduct = this.PRODUCTS[tier as keyof typeof this.PRODUCTS];
            const tierFeatures = this.TIER_FEATURES[tier as keyof typeof this.TIER_FEATURES];
            
            let productName = `StreamETH ${this.getTierNameFromPrice(data.totalPrice)}`;
            let productDescription = this.getTierDescriptionFromPrice(data.totalPrice);
            
            // If we have a product config for this tier, use those values
            if (tierProduct) {
                productName = tierProduct.name;
                productDescription = tierProduct.description;
            }
            
            // Add all feature metadata to the session
            const metadata = {
                organizationId: data.organizationId,
                tier,
                maxVideoLibrarySize: tierFeatures.maxVideoLibrarySize.toString(),
                maxSeats: tierFeatures.maxSeats.toString(),
                isLivestreamingEnabled: tierFeatures.isLivestreamingEnabled.toString(),
                isMultistreamEnabled: tierFeatures.isMultistreamEnabled.toString(),
                isCustomChannelEnabled: tierFeatures.isCustomChannelEnabled.toString(),
                hasPrioritySupport: tierFeatures.hasPrioritySupport.toString(),
            };

            // Create a subscription-based checkout session
            const session = await this.stripe.checkout.sessions.create({
                mode: 'subscription',
                automatic_tax: { enabled: true },
                line_items: [
                    {
                        price_data: {
                            unit_amount: Math.round(data.totalPrice * 100), // Convert to cents, ensure it's an integer
                            currency: 'usd',
                            product_data: {
                                name: productName,
                                description: productDescription,
                            },
                            recurring: {
                                interval: 'month',
                            }
                        },
                        quantity: 1,
                    }
                ],
                allow_promotion_codes: true,
                success_url: `${config.frontendUrl}/studio/${data.organizationId}/payments?success=true`,
                cancel_url: `${config.frontendUrl}/studio/${data.organizationId}/payments?canceled=true`,
                metadata: metadata,
                subscription_data: {
                    metadata: metadata,
                },
            });

            console.log('✅ Stripe checkout session created', { 
                sessionId: session.id,
                organizationId: organization._id,
                metadata: session.metadata,
                tier: tier,
                price: data.totalPrice
            });
            return { url: session.url };
        } catch (error) {
            console.error('❌ Failed to create checkout session', error);
            throw new HttpException(400, 'Failed to create checkout session');
        }
    }

    // Helper method to determine tier based on price
    private getTierFromPrice(price: number): string {
        if (price <= 10) return 'free';
        if (price <= 50) return 'creator';
        if (price <= 100) return 'pro';
        return 'studio';
    }

    // Helper method to get tier name for display
    private getTierNameFromPrice(price: number): string {
        if (price <= 10) return 'Free Plan';
        if (price <= 50) return 'Creator Plan';
        if (price <= 100) return 'Pro Plan';
        return 'Studio Plan';
    }

    // Helper method to get tier description
    private getTierDescriptionFromPrice(price: number): string {
        if (price <= 10) return 'Basic streaming features with limited uploads';
        if (price <= 50) return 'Enhanced features for creators with more uploads';
        if (price <= 100) return 'Professional features with multistream support';
        return 'Enterprise features with unlimited uploads and priority support';
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

    // Handle subscription lifecycle events
    async handleSubscriptionCreated(subscription: any): Promise<void> {
        try {
            const organization = await this.getOrganizationFromMetadata(subscription.metadata);
            if (!organization) return;

            const tier = subscription.metadata.tier || 'free';
            
            // Parse feature details from metadata or use defaults based on tier
            const tierFeatures = this.TIER_FEATURES[tier as keyof typeof this.TIER_FEATURES] || this.TIER_FEATURES.free;
            
            // Parse metadata values, using tier defaults if metadata doesn't have them
            const maxVideoLibrarySize = subscription.metadata.maxVideoLibrarySize ? 
                parseInt(subscription.metadata.maxVideoLibrarySize, 10) : 
                tierFeatures.maxVideoLibrarySize;
                
            const maxSeats = subscription.metadata.maxSeats ? 
                parseInt(subscription.metadata.maxSeats, 10) : 
                tierFeatures.maxSeats;
                
            const isLivestreamingEnabled = subscription.metadata.isLivestreamingEnabled === 'true' || 
                tierFeatures.isLivestreamingEnabled;
                
            const isMultistreamEnabled = subscription.metadata.isMultistreamEnabled === 'true' || 
                tierFeatures.isMultistreamEnabled;
                
            const isCustomChannelEnabled = subscription.metadata.isCustomChannelEnabled === 'true' || 
                tierFeatures.isCustomChannelEnabled;
                
            const hasPrioritySupport = subscription.metadata.hasPrioritySupport === 'true' || 
                tierFeatures.hasPrioritySupport;

            // Convert -1 to Infinity for unlimited values
            const finalMaxVideoLibrarySize = maxVideoLibrarySize === -1 ? Infinity : maxVideoLibrarySize;
            const finalMaxSeats = maxSeats === -1 ? Infinity : maxSeats;

            await Organization.updateOne(
                { _id: organization._id },
                {
                    $set: {
                        subscriptionTier: tier,
                        subscriptionStatus: 'active',
                        subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
                        customerId: subscription.customer,
                        // Set feature details from metadata
                        maxVideoLibrarySize: finalMaxVideoLibrarySize,
                        maxSeats: finalMaxSeats,
                        isLivestreamingEnabled,
                        isMultistreamEnabled,
                        isCustomChannelEnabled,
                        hasPrioritySupport,
                    }
                }
            );

            console.log('✅ Organization subscription activated', {
                organizationId: organization._id,
                tier,
                subscriptionId: subscription.id,
                features: {
                    maxVideoLibrarySize: finalMaxVideoLibrarySize,
                    maxSeats: finalMaxSeats,
                    isLivestreamingEnabled,
                    isMultistreamEnabled,
                    isCustomChannelEnabled,
                    hasPrioritySupport,
                }
            });
        } catch (error) {
            console.error('❌ Failed to handle subscription created', error);
            throw error;
        }
    }

    async handleSubscriptionUpdated(subscription: any): Promise<void> {
        try {
            const organization = await this.getOrganizationFromMetadata(subscription.metadata);
            if (!organization) return;

            // Extract features from metadata
            const tier = subscription.metadata.tier || 'free';
            const maxVideoLibrarySize = Number(subscription.metadata.maxVideoLibrarySize || 0);
            const maxSeats = Number(subscription.metadata.maxSeats || 1);
            const isLivestreamingEnabled = subscription.metadata.isLivestreamingEnabled === 'true';
            const isMultistreamEnabled = subscription.metadata.isMultistreamEnabled === 'true';
            const isCustomChannelEnabled = subscription.metadata.isCustomChannelEnabled === 'true';
            const hasPrioritySupport = subscription.metadata.hasPrioritySupport === 'true';

            // Convert unlimited values
            const finalMaxVideoLibrarySize = maxVideoLibrarySize === -1 ? Infinity : maxVideoLibrarySize;
            const finalMaxSeats = maxSeats === -1 ? Infinity : maxSeats;
            
            // Get subscription status from Stripe
            let status = subscription.status;
            
            // Check if subscription is marked to be canceled at the end of the period
            // but is still active (cancel_at_period_end = true)
            const isCancelingAtPeriodEnd = subscription.cancel_at_period_end === true && 
                                          subscription.canceled_at !== null;
                                          
            // If subscription is canceling at period end but still active, mark as "canceling"
            if (isCancelingAtPeriodEnd && status === 'active') {
                status = 'canceling'; // Custom status for our application
            }

            // Get the period end date, handling the case of cancelled subscriptions
            const currentPeriodEnd = subscription.current_period_end;
            const periodEnd = new Date(currentPeriodEnd * 1000);

            await Organization.updateOne(
                { _id: organization._id },
                {
                    $set: {
                        subscriptionTier: tier,
                        subscriptionStatus: status,
                        subscriptionPeriodEnd: periodEnd,
                        customerId: subscription.customer,
                        // Set feature details from metadata
                        maxVideoLibrarySize: finalMaxVideoLibrarySize,
                        maxSeats: finalMaxSeats,
                        isLivestreamingEnabled,
                        isMultistreamEnabled,
                        isCustomChannelEnabled,
                        hasPrioritySupport,
                    }
                }
            );

            console.log('✅ Organization subscription updated', {
                organizationId: organization._id,
                status,
                tier,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                subscriptionId: subscription.id,
                features: {
                    maxVideoLibrarySize: finalMaxVideoLibrarySize,
                    maxSeats: finalMaxSeats,
                    isLivestreamingEnabled,
                    isMultistreamEnabled,
                    isCustomChannelEnabled,
                    hasPrioritySupport,
                }
            });
        } catch (error) {
            console.error('❌ Failed to handle subscription update', error);
            throw error;
        }
    }

    async handleSubscriptionCanceled(subscription: any): Promise<void> {
        try {
            const organization = await this.getOrganizationFromMetadata(subscription.metadata);
            if (!organization) return;

            await Organization.updateOne(
                { _id: organization._id },
                {
                    $set: {
                        subscriptionStatus: 'canceled',
                        // Keep their tier until the end of their period
                    }
                }
            );

            console.log('✅ Organization subscription canceled', {
                organizationId: organization._id,
                subscriptionId: subscription.id
            });
        } catch (error) {
            console.error('❌ Failed to handle subscription cancellation', error);
            throw error;
        }
    }

    async handleCheckoutCompleted(session: any): Promise<void> {
        try {
            // Skip if this wasn't a subscription
            if (session.mode !== 'subscription') {
                console.log('⚠️ Checkout is not a subscription, skipping organization update');
                return;
            }
            
            // If subscription ID is available, handle it as a subscription
            if (session.subscription) {
                // Fetch the subscription details
                const subscription = await this.stripe.subscriptions.retrieve(session.subscription);
                
                // Process the subscription
                await this.handleSubscriptionCreated(subscription);
                
                console.log('✅ Checkout completed, subscription processed', {
                    subscriptionId: subscription.id,
                    organizationId: subscription.metadata?.organizationId
                });
            } else {
                console.log('⚠️ No subscription ID in checkout session, skipping');
            }
        } catch (error) {
            console.error('❌ Failed to handle checkout completion', error);
            throw error;
        }
    }

    // Helper method to retrieve a subscription by ID
    async retrieveSubscription(subscriptionId: string): Promise<any | null> {
        try {
            return await this.stripe.subscriptions.retrieve(subscriptionId);
        } catch (error) {
            console.error('❌ Failed to retrieve subscription', error);
            return null;
        }
    }

    // Handle failed payment for subscription
    async handleSubscriptionPaymentFailed(subscription: any): Promise<void> {
        try {
            const organization = await this.getOrganizationFromMetadata(subscription.metadata);
            if (!organization) return;

            // Update the organization with past_due status
            await Organization.updateOne(
                { _id: organization._id },
                {
                    $set: {
                        subscriptionStatus: 'past_due',
                        // Keep the other subscription details
                    }
                }
            );

            console.log('⚠️ Organization subscription payment failed', {
                organizationId: organization._id,
                subscriptionId: subscription.id,
                status: 'past_due',
            });
        } catch (error) {
            console.error('❌ Failed to handle subscription payment failure', error);
            throw error;
        }
    }

    // Handle upcoming invoice notifications
    async handleUpcomingInvoice(invoice: any): Promise<void> {
        try {
            // If no subscription is attached, skip processing
            if (!invoice.subscription) return;
            
            // Get the subscription to access its metadata
            const subscription = await this.retrieveSubscription(invoice.subscription);
            if (!subscription || !subscription.metadata) return;
            
            const organization = await this.getOrganizationFromMetadata(subscription.metadata);
            if (!organization) return;
            
            // We're just logging here, but in the future we could:
            // 1. Send an email notification
            // 2. Update a notification flag in the database
            // 3. Create an in-app notification
            
            console.log('📢 Upcoming invoice notification prepared', {
                organizationId: organization._id,
                subscriptionId: subscription.id,
                invoiceId: invoice.id,
                amountDue: invoice.amount_due / 100, // Convert from cents
                dueDate: new Date(invoice.due_date * 1000),
            });
            
            // For now, no database updates are made
        } catch (error) {
            console.error('❌ Failed to handle upcoming invoice', error);
            // Don't throw error to keep webhook processing going
        }
    }

    // Handle trial ending soon notifications
    async handleTrialWillEnd(subscription: any): Promise<void> {
        try {
            const organization = await this.getOrganizationFromMetadata(subscription.metadata);
            if (!organization) return;
            
            // Update the organization to indicate trial ending
            await Organization.updateOne(
                { _id: organization._id },
                {
                    $set: {
                        // Set a flag or update status as needed
                        // This is just an example - implement based on your needs
                        trialEndingSoon: true,
                        trialEndDate: new Date(subscription.trial_end * 1000),
                    }
                }
            );
            
            console.log('⏳ Trial ending soon notification processed', {
                organizationId: organization._id,
                subscriptionId: subscription.id,
                trialEnd: new Date(subscription.trial_end * 1000),
            });
        } catch (error) {
            console.error('❌ Failed to handle trial ending notification', error);
            // Don't throw error to keep webhook processing going
        }
    }

    /**
     * Specifically handles subscription upgrade scenarios
     * Called when a subscription is updated with a new price/product
     */
    async handleSubscriptionUpgrade(subscription: any, previousAttributes?: any): Promise<void> {
        try {
            const organization = await this.getOrganizationFromMetadata(subscription.metadata);
            if (!organization) {
                console.log('⚠️ No organization found for subscription upgrade', { subscriptionId: subscription.id });
                return;
            }
            
            // Get the current tier from metadata - this might be outdated
            let tier = subscription.metadata.tier || organization.subscriptionTier || 'free';
            
            // Check if we have items data to determine the actual product/price
            if (subscription.items?.data?.length > 0) {
                const item = subscription.items.data[0];
                const productId = item.price?.product || item.plan?.product;
                
                // Determine tier based on product ID
                if (productId === this.PRODUCTS.creator.id) {
                    tier = 'creator';
                } else if (productId === this.PRODUCTS.pro.id) {
                    tier = 'pro';
                } else if (productId === this.PRODUCTS.studio.id) {
                    tier = 'studio';
                }
                
                console.log('🔄 Detected product change during upgrade', { 
                    productId, 
                    newTier: tier,
                    oldTier: subscription.metadata.tier
                });
            }
            
            // Get the features for this tier
            const tierFeatures = this.TIER_FEATURES[tier as keyof typeof this.TIER_FEATURES] || this.TIER_FEATURES.free;
            
            // Prepare new metadata with updated tier and features
            const updatedMetadata = {
                ...subscription.metadata,
                tier: tier,
                maxVideoLibrarySize: String(tierFeatures.maxVideoLibrarySize),
                maxSeats: String(tierFeatures.maxSeats),
                isMultistreamEnabled: String(tierFeatures.isMultistreamEnabled),
                isCustomChannelEnabled: String(tierFeatures.isCustomChannelEnabled),
                hasPrioritySupport: String(tierFeatures.hasPrioritySupport),
            };
            
            // Update the subscription metadata in Stripe to match the new tier
            try {
                await this.stripe.subscriptions.update(subscription.id, {
                    metadata: updatedMetadata
                });
                console.log('✅ Updated subscription metadata after tier change', { 
                    subscriptionId: subscription.id,
                    tier: tier
                });
            } catch (error) {
                console.error('❌ Failed to update Stripe subscription metadata', error);
                // Continue with organization update even if Stripe update fails
            }
            
            // Convert -1 to Infinity for unlimited values
            const finalMaxVideoLibrarySize = tierFeatures.maxVideoLibrarySize === -1 ? 
                Infinity : tierFeatures.maxVideoLibrarySize;
            const finalMaxSeats = tierFeatures.maxSeats === -1 ? 
                Infinity : tierFeatures.maxSeats;
            
            // Update organization with the new tier and features
            await Organization.updateOne(
                { _id: organization._id },
                {
                    $set: {
                        subscriptionTier: tier,
                        subscriptionStatus: 'active',
                        subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
                        // Set feature details based on the new tier
                        maxVideoLibrarySize: finalMaxVideoLibrarySize,
                        maxSeats: finalMaxSeats,
                        isMultistreamEnabled: tierFeatures.isMultistreamEnabled,
                        isCustomChannelEnabled: tierFeatures.isCustomChannelEnabled,
                        hasPrioritySupport: tierFeatures.hasPrioritySupport,
                    }
                }
            );
            
            console.log('✅ Organization subscription upgraded', {
                organizationId: organization._id,
                previousTier: subscription.metadata.tier,
                newTier: tier,
                subscriptionId: subscription.id,
                features: {
                    maxVideoLibrarySize: finalMaxVideoLibrarySize,
                    maxSeats: finalMaxSeats,
                    isMultistreamEnabled: tierFeatures.isMultistreamEnabled,
                    isCustomChannelEnabled: tierFeatures.isCustomChannelEnabled,
                    hasPrioritySupport: tierFeatures.hasPrioritySupport,
                }
            });
        } catch (error) {
            console.error('❌ Failed to handle subscription upgrade', error);
            throw error;
        }
    }

    /**
     * Diagnostic method to help debug subscription details
     * This can be called from any webhook handler to get detailed info about a subscription
     */
    async logSubscriptionDiagnostics(subscription: any): Promise<void> {
        try {
            console.log('📊 Subscription Diagnostics', {
                id: subscription.id,
                status: subscription.status,
                currentPeriod: {
                    start: new Date(subscription.current_period_start * 1000),
                    end: new Date(subscription.current_period_end * 1000)
                },
                metadata: subscription.metadata,
                customer: subscription.customer,
            });
            
            // Log items and prices
            if (subscription.items?.data?.length > 0) {
                const items = subscription.items.data.map((item: any) => ({
                    id: item.id,
                    priceId: item.price?.id,
                    productId: item.price?.product,
                    amount: item.price?.unit_amount ? 
                        `${(item.price.unit_amount / 100).toFixed(2)} ${item.price.currency}` : 
                        'unknown',
                    interval: item.price?.recurring?.interval || 'unknown',
                    metadata: item.metadata
                }));
                
                console.log('📦 Subscription Items:', items);
                
                // Fetch actual product details
                for (const item of subscription.items.data) {
                    if (item.price?.product) {
                        try {
                            const product = await this.stripe.products.retrieve(item.price.product);
                            console.log('🏷️ Product:', {
                                id: product.id,
                                name: product.name,
                                description: product.description,
                                active: product.active,
                                metadata: product.metadata
                            });
                        } catch (error) {
                            console.error('❌ Failed to fetch product details', {
                                productId: item.price.product,
                                error: error.message
                            });
                        }
                    }
                }
            } else {
                console.log('⚠️ No subscription items found');
            }
            
            // Determine tier based on product ID
            let detectedTier = 'unknown';
            if (subscription.items?.data?.length > 0) {
                const productId = subscription.items.data[0].price?.product;
                if (productId === this.PRODUCTS.creator.id) {
                    detectedTier = 'creator';
                } else if (productId === this.PRODUCTS.pro.id) {
                    detectedTier = 'pro';
                } else if (productId === this.PRODUCTS.studio.id) {
                    detectedTier = 'studio';
                }
            }
            
            console.log('🔍 Tier Analysis:', {
                fromMetadata: subscription.metadata?.tier || 'none',
                fromProductId: detectedTier,
                mismatch: subscription.metadata?.tier !== detectedTier && detectedTier !== 'unknown'
            });
            
        } catch (error) {
            console.error('❌ Error in subscription diagnostics', error);
        }
    }

    // Add a method to handle successful invoice payments
    async handleInvoicePaymentSucceeded(invoice: any): Promise<void> {
        try {
            console.log('⚙️ Processing invoice payment succeeded event', { invoiceId: invoice.id });
            
            // Check if this is a subscription invoice with the right metadata
            if (!invoice.subscription || !invoice.subscription_details?.metadata?.organizationId) {
                console.log('⏩ Skipping invoice - not related to a subscription with organization metadata');
                return;
            }
            
            const organizationId = invoice.subscription_details.metadata.organizationId;
            
            // Get the related organization
            const organization = await this.organizationService.get(organizationId);
            if (!organization) {
                console.error('❌ Organization not found', { organizationId });
                return;
            }
            
            // Extract invoice information
            const invoiceData = {
                id: invoice.id,
                number: invoice.number,
                hostedInvoiceUrl: invoice.hosted_invoice_url,
                invoicePdf: invoice.invoice_pdf,
                total: invoice.total,
                currency: invoice.currency,
                status: invoice.status,
                paidAt: invoice.status_transitions.paid_at,
                receiptNumber: invoice.receipt_number,
                createdAt: invoice.created
            };
            
            // Update organization with latest invoice data
            await Organization.updateOne(
                { _id: organizationId },
                {
                    $set: {
                        latestInvoice: invoiceData
                    }
                }
            );
            
            console.log('✅ Updated organization with latest invoice data', { 
                organizationId, 
                invoiceId: invoice.id 
            });
        } catch (error) {
            console.error('❌ Failed to process invoice payment succeeded event', error);
        }
    }

    // Update the webhookStripe method to handle invoice events
    async webhookStripe(event: any): Promise<void> {
        try {
            console.log('🎯 Processing Stripe webhook event:', event.type);

            switch (event.type) {
                case 'customer.subscription.created':
                    await this.handleSubscriptionCreated(event.data.object);
                    break;
                case 'customer.subscription.updated':
                    await this.handleSubscriptionUpdated(event.data.object);
                    break;
                case 'customer.subscription.deleted':
                    await this.handleSubscriptionCanceled(event.data.object);
                    break;
                case 'checkout.session.completed':
                    await this.handleCheckoutCompleted(event.data.object);
                    break;
                case 'invoice.payment_succeeded':
                    await this.handleInvoicePaymentSucceeded(event.data.object);
                    break;
                case 'invoice.payment_failed':
                    await this.handleSubscriptionPaymentFailed(event.data.object);
                    break;
                // ... other cases ...
                default:
                    console.log(`⏩ Unhandled event type: ${event.type}`);
            }
        } catch (error) {
            console.error('❌ Error processing webhook event:', error);
            throw error;
        }
    }

    /**
     * Creates a customer portal session for managing subscriptions
     * 
     * @param customerId The Stripe customer ID
     * @param returnUrl The URL to redirect to after the portal session
     * @returns The URL to the customer portal session
     */
    async createCustomerPortalSession(customerId: string, returnUrl: string): Promise<{ url: string }> {
        try {
            if (!customerId) {
                throw new Error('Customer ID is required to create a portal session');
            }

            console.log('🔄 Creating customer portal session', { customerId, returnUrl });
            
            const session = await this.stripe.billingPortal.sessions.create({
                customer: customerId,
                return_url: returnUrl,
            });
            
            console.log('✅ Customer portal session created successfully');
            return { url: session.url };
        } catch (error) {
            console.error('❌ Failed to create customer portal session', error);
            throw error;
        }
    }
}