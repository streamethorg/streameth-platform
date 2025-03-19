/**
 * Data transfer object for creating a Stripe customer portal session
 */
export class CreatePortalSessionDto {
  /**
   * The organization's ID (required)
   */
  organizationId!: string;
  
  /**
   * The URL to return to after the customer completes the portal flow (required)
   */
  returnUrl!: string;
} 