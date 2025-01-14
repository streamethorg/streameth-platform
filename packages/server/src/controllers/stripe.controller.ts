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

      // Skip processing if metadata is empty
      if (!body.data?.object?.metadata || Object.keys(body.data.object.metadata).length === 0) {
        console.log('⚠️ Skipping webhook event - no metadata found');
        return SendApiResponse('Webhook acknowledged - no metadata');
      }

      switch (body.type) {
        case 'payment_intent.created': {
          const paymentIntent = body.data.object;
          console.log('💰 Payment intent created:', {
            id: paymentIntent.id,
            amount: paymentIntent.amount,
            metadata: paymentIntent.metadata
          });
          await this.stripeService.handlePaymentIntentCreated(paymentIntent);
          break;
        }

        case 'checkout.session.completed': {
          const session = body.data.object;
          console.log('✅ Checkout completed:', {
            sessionId: session.id,
            customerId: session.customer,
            metadata: session.metadata
          });
          await this.stripeService.handleCheckoutCompleted(session);
          break;
        }

        case 'payment_intent.succeeded': {
          const paymentIntent = body.data.object;
          console.log('🌟 Payment succeeded:', {
            paymentId: paymentIntent.id,
            amount: paymentIntent.amount,
            metadata: paymentIntent.metadata
          });
          await this.stripeService.handlePaymentSucceeded(paymentIntent);
          break;
        }

        case 'payment_intent.payment_failed': {
          const paymentIntent = body.data.object;
          const error = paymentIntent.last_payment_error;
          console.error('❌ Payment failed:', {
            paymentId: paymentIntent.id,
            error: error?.message,
            code: error?.code,
            metadata: paymentIntent.metadata
          });
          await this.stripeService.handlePaymentFailed(paymentIntent);
          break;
        }

        case 'charge.succeeded': {
          const charge = body.data.object;
          console.log('💫 Charge succeeded:', {
            chargeId: charge.id,
            amount: charge.amount,
            metadata: charge.metadata
          });
          break;
        }

        default: {
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

