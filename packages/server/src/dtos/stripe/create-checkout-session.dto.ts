export class CreateCheckoutSessionDto {
  organizationId!: string;
  totalPrice!: number;
  streamingDays!: number;
  numberOfStages!: number;
}