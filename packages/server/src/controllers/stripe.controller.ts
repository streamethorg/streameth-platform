import { Body, Controller, Post, Route, Tags } from "tsoa";
import { IStandardResponse, SendApiResponse } from "@utils/api.response";
import { CreateCheckoutSessionDto } from "@dtos/stripe/create-checkout-session.dto";
import { StripeService } from "@services/stripe.service";

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
      return result;
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

      switch (body.type) {
        case 'payment_intent.created': {
          // Initial payment creation - Log and track
          const { id, amount, metadata } = body.data.object;
          console.log('💰 Payment intent created:', { id, amount, metadata });
          // TODO: Update organization payment status to 'pending'
          break;
        }

        case 'checkout.session.completed': {
          // Customer completed checkout - Confirm and prepare fulfillment
          const session = body.data.object;
          console.log('✅ Checkout completed:', {
            sessionId: session.id,
            customerId: session.customer,
            metadata: session.metadata
          });
          
          // TODO: Update organization status to 'payment_processing'
          // Store customer information for future reference
          break;
        }

        case 'payment_intent.succeeded': {
          // Payment successfully processed - Fulfill the order
          const paymentIntent = body.data.object;
          console.log('🌟 Payment succeeded:', {
            paymentId: paymentIntent.id,
            amount: paymentIntent.amount,
            metadata: paymentIntent.metadata
          });

          // TODO: 
          // 1. Update organization status to 'active'
          // 2. Grant access to streaming features
          // 3. Send confirmation email
          break;
        }

        case 'payment_intent.payment_failed': {
          // Payment failed - Handle the failure
          const paymentIntent = body.data.object;
          const error = paymentIntent.last_payment_error;
          console.error('❌ Payment failed:', {
            paymentId: paymentIntent.id,
            error: error?.message,
            code: error?.code,
            metadata: paymentIntent.metadata
          });

          // TODO:
          // 1. Update organization status to 'payment_failed'
          // 2. Send notification to user about failed payment
          // 3. Provide retry instructions
          break;
        }

        case 'charge.succeeded': {
          // Additional confirmation of successful charge
          const charge = body.data.object;
          console.log('💫 Charge succeeded:', {
            chargeId: charge.id,
            amount: charge.amount,
            metadata: charge.metadata
          });
          break;
        }

        default: {
          // Log unhandled events for monitoring
          console.log('ℹ️ Unhandled event type:', body.type);
        }
      }

      return SendApiResponse('Webhook processed successfully');
    } catch (error) {
      console.error('💥 Webhook processing failed:', error);
      // Important: Return 200 even for errors to prevent Stripe from retrying
      return SendApiResponse('Webhook processing failed, but acknowledged', null, '200');
    }
  }
}

