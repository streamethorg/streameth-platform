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

      await this.stripeService.webhookStripe(body);
      
      return SendApiResponse('Webhook processed successfully');
    } catch (error) {
      console.error('❌ Failed to process webhook event', error);
      throw error;
    }
  }
}

