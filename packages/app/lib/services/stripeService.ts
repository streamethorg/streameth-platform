import { apiUrl } from '@/lib/utils/utils';

interface StripeCheckoutResponse {
  url: string;
}

export async function acceptPayment(
  organizationId: string,
  totalPrice: number,
  streamingDays: number,
  numberOfStages: number
): Promise<string> {
  console.log('🔄 Initiating payment process...', {
    organizationId,
    totalPrice,
    streamingDays,
    numberOfStages,
  });

  try {
    const response = await fetch(`${apiUrl()}/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organizationId,
        totalPrice,
        streamingDays,
        numberOfStages,
      }),
    });

    if (!response.ok) {
      console.error('❌ Payment initiation failed:', response.statusText);
      throw new Error(`Payment failed: ${response.statusText}`);
    }

    const data = (await response.json()) as { data: StripeCheckoutResponse };
    console.log('✅ Payment session created successfully');

    return data.data.url;
  } catch (error) {
    console.error('💥 Payment process error:', error);
    throw new Error('Failed to process payment. Please try again later.');
  }
}
