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

        case 'charge.updated': {
          const charge = body.data.object;
          console.log('💫 Charge updated:', {
            chargeId: charge.id,
            amount: charge.amount,
            metadata: charge.metadata,
            status: charge.status,
            paid: charge.paid,
            paymentIntent: charge.payment_intent
          });
          
          // Only process if charge is succeeded and paid
          if (charge.status === 'succeeded' && charge.paid) {
            await this.stripeService.handleChargeSucceeded(charge);
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

