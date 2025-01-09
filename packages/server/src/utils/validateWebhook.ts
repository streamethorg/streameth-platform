import { config } from '@config';
import { RemotionPayload } from '@interfaces/remotion.webhook.interface';
import crypto from 'crypto';

export function validateRemotionWebhook(
  remotionSignature: string,
  payload: RemotionPayload,
): boolean {
  const signature = crypto
    .createHmac('sha512', config.remotion.webhookSecretKey)
    .update(JSON.stringify(payload))
    .digest('hex');
  if (remotionSignature !== signature) return false;
  return true;
}

export const validateWebhook = (signature: string, payload: any): boolean => {
  console.log('🔐 Starting webhook validation');
  try {
    if (!signature) {
      console.log('❌ No signature provided');
      return false;
    }

    const secret = config.livepeer.webhookSecretKey;
    console.log('🔑 Using webhook secret:', {
      secret,
      configValue: config.livepeer.webhookSecretKey,
      envValue: process.env.LIVEPEER_WEBHOOK_SECRET_FILE,
    });

    // Parse the signature header
    const [timestamp, signatureHash] = signature.split(',');
    const [, timestampValue] = timestamp.split('=');
    const [, hashValue] = signatureHash.split('=');

    console.log('📝 Parsing signature components:', {
      timestamp: timestampValue,
      hash: hashValue,
    });

    // Check timestamp is within tolerance (1 hour to account for timezone differences)
    const tolerance = 60 * 60 * 1000; // 1 hour in milliseconds
    const now = Date.now();
    const timestampMs = parseInt(timestampValue);
    
    if (Math.abs(now - timestampMs) > tolerance) {
      console.log('⏰ Timestamp out of tolerance:', {
        now: new Date(now).toISOString(),
        timestamp: new Date(timestampMs).toISOString(),
        difference: Math.abs(now - timestampMs) / (60 * 1000), // difference in minutes
        toleranceMinutes: tolerance / (60 * 1000),
      });
      return false;
    }

    // Construct the string to sign exactly as Livepeer does
    const payloadString = JSON.stringify(payload);
    console.log('📜 Raw payload string:', payloadString);

    // Livepeer uses the raw timestamp value concatenated with the payload
    const signaturePayload = timestampValue + '.' + payloadString;

    // Calculate expected signature using SHA-256
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signaturePayload)
      .digest('hex');

    console.log('🔍 Comparing signatures:', {
      received: hashValue,
      expected: expectedSignature,
      match: hashValue === expectedSignature,
      timestampInfo: {
        webhookTime: new Date(timestampMs).toISOString(),
        serverTime: new Date(now).toISOString(),
        diffMinutes: (now - timestampMs) / (60 * 1000)
      }
    });

    const isValid = hashValue === expectedSignature;
    console.log(isValid ? '✅ Signature valid' : '❌ Signature invalid');

    if (!isValid) {
      console.log('🔍 Debug info:', {
        timestampValue,
        payloadLength: payloadString.length,
        signaturePayloadLength: signaturePayload.length,
        secretLength: secret.length,
        timezoneOffset: new Date().getTimezoneOffset()
      });
    }

    return isValid;
  } catch (error) {
    console.error('❌ Error validating webhook:', error);
    return false;
  }
};
