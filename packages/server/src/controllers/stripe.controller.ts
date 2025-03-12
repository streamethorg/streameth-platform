import { Body, Controller, Post, Route, Tags } from "tsoa";
import { IStandardResponse, SendApiResponse } from "@utils/api.response";
import { CreateCheckoutSessionDto } from "@dtos/stripe/create-checkout-session.dto";
import StripeService from "@services/stripe.service";

@Tags('Stripe')
@Route('stripe')
export class StripeController extends Controller {
  private stripeService: StripeService;

  constructor() {
    super();
    this.stripeService = new StripeService();
  }

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body() body: CreateCheckoutSessionDto,
  ): Promise<IStandardResponse<any>> {
    try {
      console.log('🎯 Received checkout session request', { body });
      const result = await this.stripeService.createCheckoutSession(body);
      console.log('✨ Checkout session created successfully');
      return SendApiResponse('Checkout session created', result);
    } catch (error) {
      console.error('💥 Failed to create checkout session', error);
      throw error;
    }
  }

  @Post('webhook')
  async webhookStripe(
    @Body() body: any,
  ): Promise<IStandardResponse<any>> {
    try {
      console.log('🎯 Received webhook event:', body.type);

      // Skip processing if metadata is empty or no object is present
      if (!body.data?.object) {
        console.log('⚠️ Skipping webhook event - no object data found');
        return SendApiResponse('Webhook acknowledged - no object data');
      }

      // For events related to subscriptions and invoices, check for metadata
      const requiresMetadata = [
        'checkout.session.completed', 
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'invoice.payment_succeeded',
        'invoice.payment_failed'
      ].includes(body.type);

      if (requiresMetadata && 
          (!body.data.object.metadata || Object.keys(body.data.object.metadata).length === 0)) {
        console.log('⚠️ Skipping webhook event - no metadata found for a subscription-related event');
        return SendApiResponse('Webhook acknowledged - no metadata for subscription event');
      }

      switch (body.type) {
        // Checkout session completed
        case 'checkout.session.completed': {
          const session = body.data.object;
          console.log('🤑 Checkout completed:', {
            sessionId: session.id,
            amount_subtotal: session.amount_subtotal,
            amount_total: session.amount_total,
            metadata: session.metadata,
            status: session.status,
            paid: session.paid,
            payment_status: session.payment_status,
            discounts: session.discounts
          });
          if (session.status === 'complete' && session.payment_status === 'paid') {
            await this.stripeService.handleCheckoutCompleted(session);
          }
          break;
        }

        // Subscription events
        case 'customer.subscription.created': {
          const subscription = body.data.object;
          console.log('🔔 Subscription created:', {
            subscriptionId: subscription.id,
            status: subscription.status,
            metadata: subscription.metadata
          });
          await this.stripeService.handleSubscriptionCreated(subscription);
          break;
        }

        case 'customer.subscription.updated': {
          const subscription = body.data.object;
          console.log('📝 Subscription updated:', {
            subscriptionId: subscription.id,
            status: subscription.status,
            metadata: subscription.metadata
          });
          
          // Log detailed diagnostics for troubleshooting
          await this.stripeService.logSubscriptionDiagnostics(subscription);
          
          // Check if this is a plan change (upgrade/downgrade)
          const previousAttributes = body.previous_attributes || {};
          const isPlanChange = previousAttributes.items || 
                             previousAttributes.plan || 
                             body.data.object.items?.data?.some((item: any) => 
                               item.previous_attributes || item.price?.previous_attributes);
          
          if (isPlanChange) {
            console.log('🔄 Detected subscription plan change, handling as upgrade/downgrade');
            await this.stripeService.handleSubscriptionUpgrade(subscription, previousAttributes);
          } else {
            // Regular update (not a plan change)
            await this.stripeService.handleSubscriptionUpdated(subscription);
          }
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = body.data.object;
          console.log('❌ Subscription deleted:', {
            subscriptionId: subscription.id,
            status: subscription.status,
            metadata: subscription.metadata
          });
          await this.stripeService.handleSubscriptionCanceled(subscription);
          break;
        }

        // Invoice events
        case 'invoice.payment_succeeded': {
          const invoice = body.data.object;
          console.log('💰 Invoice payment succeeded:', {
            invoiceId: invoice.id,
            subscriptionId: invoice.subscription,
            amount: invoice.amount_paid,
            status: invoice.status
          });
          
          // Check if this is potentially an upgrade by examining line items
          let isUpgradeInvoice = false;
          let productId = null;
          
          if (invoice.lines?.data?.length > 0) {
            for (const item of invoice.lines.data) {
              if (item.type === 'subscription') {
                productId = item.price?.product || item.plan?.product;
                // If we find subscription line item, it might be an upgrade
                isUpgradeInvoice = true;
                break;
              }
            }
          }
          
          if (isUpgradeInvoice && invoice.subscription) {
            console.log('🔍 Checking if invoice payment represents a subscription upgrade', {
              invoiceId: invoice.id, 
              subscriptionId: invoice.subscription,
              productId
            });
            
            // Fetch the full subscription details
            const subscription = await this.stripeService.retrieveSubscription(invoice.subscription);
            if (subscription) {
              // Handle as potential upgrade
              await this.stripeService.handleSubscriptionUpgrade(subscription);
            } else {
              console.log('⚠️ Could not retrieve subscription for potential upgrade', {
                subscriptionId: invoice.subscription
              });
            }
          } else if (invoice.subscription) {
            // Regular invoice payment, just update subscription details
            const subscription = await this.stripeService.retrieveSubscription(invoice.subscription);
            if (subscription) {
              await this.stripeService.handleSubscriptionUpdated(subscription);
            }
          }
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = body.data.object;
          console.log('❗ Invoice payment failed:', {
            invoiceId: invoice.id,
            subscriptionId: invoice.subscription,
            amount: invoice.amount_due,
            status: invoice.status
          });
          // Mark subscription as past_due if applicable
          if (invoice.subscription) {
            const subscription = await this.stripeService.retrieveSubscription(invoice.subscription);
            if (subscription) {
              await this.stripeService.handleSubscriptionPaymentFailed(subscription);
            }
          }
          break;
        }

        case 'invoice.upcoming': {
          const invoice = body.data.object;
          console.log('📅 Upcoming invoice:', {
            invoiceId: invoice.id,
            subscriptionId: invoice.subscription,
            amount: invoice.amount_due,
            dueDate: new Date(invoice.due_date * 1000)
          });
          // Optionally notify users about upcoming charge
          await this.stripeService.handleUpcomingInvoice(invoice);
          break;
        }

        // Discount events
        case 'customer.discount.created': {
          const discount = body.data.object;
          console.log('🎟️ Discount applied:', {
            discountId: discount.id,
            coupon: discount.coupon,
            promotionCode: discount.promotion_code,
            checkoutSession: discount.checkout_session
          });
          break;
        }

        case 'promotion_code.updated': {
          const promoCode = body.data.object;
          console.log('🏷️ Promotion code updated:', {
            code: promoCode.code,
            timesRedeemed: promoCode.times_redeemed,
            coupon: promoCode.coupon
          });
          break;
        }

        // Subscription item events
        case 'customer.subscription.trial_will_end': {
          const subscription = body.data.object;
          console.log('⏰ Subscription trial ending soon:', {
            subscriptionId: subscription.id,
            trialEnd: new Date(subscription.trial_end * 1000)
          });
          await this.stripeService.handleTrialWillEnd(subscription);
          break;
        }

        // Additional invoice event - invoice.paid
        case 'invoice.paid': {
          const invoice = body.data.object;
          console.log('💳 Invoice paid:', {
            invoiceId: invoice.id,
            subscriptionId: invoice.subscription,
            amount: invoice.amount_paid,
            status: invoice.status
          });
          
          // Similar logic to invoice.payment_succeeded
          if (invoice.subscription) {
            // Check if this is potentially an upgrade by examining line items
            let isUpgradeInvoice = false;
            let productId = null;
            
            if (invoice.lines?.data?.length > 0) {
              for (const item of invoice.lines.data) {
                if (item.type === 'subscription') {
                  productId = item.price?.product || item.plan?.product;
                  isUpgradeInvoice = true;
                  break;
                }
              }
            }
            
            if (isUpgradeInvoice) {
              console.log('🔍 Checking if paid invoice represents a subscription upgrade', {
                invoiceId: invoice.id, 
                subscriptionId: invoice.subscription,
                productId
              });
              
              const subscription = await this.stripeService.retrieveSubscription(invoice.subscription);
              if (subscription) {
                await this.stripeService.handleSubscriptionUpgrade(subscription);
              }
            }
          }
          break;
        }

        case 'invoice.updated': {
          const invoice = body.data.object;
          console.log('📄 Invoice updated:', {
            invoiceId: invoice.id,
            subscriptionId: invoice.subscription,
            status: invoice.status
          });
          
          // Focus mainly on invoice status changes
          if (invoice.subscription && 
              (body.previous_attributes?.status || 
               body.data.previous_attributes?.status)) {
            console.log('📊 Invoice status changed:', {
              from: body.previous_attributes?.status,
              to: invoice.status
            });
            
            // For completed/paid invoices, check if this is an upgrade
            if (['paid', 'uncollectible', 'void'].includes(invoice.status)) {
              const subscription = await this.stripeService.retrieveSubscription(invoice.subscription);
              if (subscription) {
                // Check if this invoice references a different product than current subscription
                let productChanged = false;
                if (invoice.lines?.data?.length > 0) {
                  const invoiceProductId = invoice.lines.data[0].price?.product;
                  const subscriptionProductId = subscription.items?.data[0]?.price?.product;
                  
                  if (invoiceProductId && subscriptionProductId && 
                      invoiceProductId !== subscriptionProductId) {
                    productChanged = true;
                  }
                }
                
                if (productChanged) {
                  await this.stripeService.handleSubscriptionUpgrade(subscription);
                } else {
                  await this.stripeService.handleSubscriptionUpdated(subscription);
                }
              }
            }
          }
          break;
        }

        default: {
          console.log('ℹ️ Skipping unhandled event type:', body.type);
        }
      }

      return SendApiResponse('Webhook processed successfully');
    } catch (error) {
      console.error('💥 Webhook processing failed:', error);
      // Return 200 to acknowledge receipt
      return SendApiResponse('Webhook processing failed, but acknowledged', null, '200');
    }
  }
}

