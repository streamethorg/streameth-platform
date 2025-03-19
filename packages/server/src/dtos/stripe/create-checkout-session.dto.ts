/**
 * Data transfer object for creating a Stripe checkout session
 */
export class CreateCheckoutSessionDto {
  /**
   * The organization's ID (required)
   */
  organizationId!: string;
  
  /**
   * The monthly subscription price (required)
   */
  totalPrice!: number;
  
  /**
   * Optional subscription tier identifier
   */
  tier?: string;
  
  /**
   * Legacy parameters - kept for backwards compatibility but not used
   * @deprecated Use totalPrice as monthly subscription price instead
   */
  streamingDays?: number;
  
  /**
   * Legacy parameters - kept for backwards compatibility but not used
   * @deprecated Use totalPrice as monthly subscription price instead
   */
  numberOfStages?: number;
}