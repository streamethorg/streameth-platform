import { Body, Controller, Post, Route, Tags } from "tsoa";
import { IStandardResponse, SendApiResponse } from "@utils/api.response";
import { CreateCheckoutSessionDto } from "@dtos/stripe/create-checkout-session.dto";
import { CreatePortalSessionDto } from "@dtos/stripe/create-portal-session.dto";
import StripeService from "@services/stripe.service";
import OrganizationService from "@services/organization.service";

@Tags('Stripe')
@Route('stripe')
export class StripeController extends Controller {
  private stripeService: StripeService;
  private organizationService: OrganizationService;

  constructor() {
    super();
    this.stripeService = new StripeService();
    this.organizationService = new OrganizationService();
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

  @Post('create-portal-session')
  async createPortalSession(
    @Body() body: CreatePortalSessionDto,
  ): Promise<IStandardResponse<any>> {
    try {
      console.log('🎯 Received portal session request', { body });
      
      // Get the organization to retrieve the customer ID
      const organization = await this.organizationService.get(body.organizationId);
      
      if (!organization) {
        return SendApiResponse('Organization not found', null, 'error');
      }
      
      if (!organization.customerId) {
        return SendApiResponse('Organization has no associated customer', null, 'error');
      }
      
      // Create the portal session with the customer ID
      const result = await this.stripeService.createCustomerPortalSession(
        organization.customerId,
        body.returnUrl
      );
      
      console.log('✨ Customer portal session created successfully');
      return SendApiResponse('Portal session created', result);
    } catch (error) {
      console.error('💥 Failed to create portal session', error);
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

