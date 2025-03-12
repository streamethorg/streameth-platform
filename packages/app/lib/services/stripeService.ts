import { apiUrl } from '@/lib/utils/utils';

interface StripeCheckoutResponse {
  url: string;
}

/**
 * Creates a Stripe subscription checkout session
 * 
 * @param organizationId The ID of the organization to subscribe
 * @param pricePerMonth The monthly subscription price
 * @param tier The subscription tier (creator, pro, studio) - optional
 * @param legacyParam Legacy parameter for backward compatibility (not used)
 * @returns The checkout URL to redirect the user to
 */
export async function acceptPayment(
  organizationId: string,
  pricePerMonth: number,
  tier?: string,
  legacyParam = 0 // Kept for backwards compatibility
): Promise<string> {
  console.log('🔄 Initiating subscription checkout...', {
    organizationId,
    pricePerMonth,
    tier
  });

  try {
    const response = await fetch(`${apiUrl()}/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organizationId,
        totalPrice: pricePerMonth, // This is passed to the server as monthly price
        tier, // Explicitly pass the tier to ensure correct metadata
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Subscription checkout failed:', response.statusText, errorText);
      throw new Error(`Subscription checkout failed: ${response.statusText}`);
    }

    const data = (await response.json()) as { data: StripeCheckoutResponse };
    console.log('✅ Subscription checkout session created successfully');

    return data.data.url;
  } catch (error) {
    console.error('💥 Subscription process error:', error);
    throw new Error('Failed to process subscription. Please try again later.');
  }
}
