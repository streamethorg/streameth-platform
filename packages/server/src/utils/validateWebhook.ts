import crypto from 'crypto';

export function validateWebhook(
  livepeerSignature: string,
  payload: any,
): boolean {
  const elements = livepeerSignature.split(',');
  const signatureParts = elements.reduce((acc, element) => {
    const [key, value] = element.split('=');
    acc[key] = value;
    return acc;
  }, {});

  const timestamp = signatureParts['t'];
  const signature = signatureParts['v1'];
  const signedPayload = JSON.stringify(payload);

  const secret = process.env.LIVEPEER_WEBHOOK_SECRET;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  const isSignatureValid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );

  if (!isSignatureValid) {
    return false;
  }

  const tolerance = 8 * 60 * 1000; // 8 minutes in milliseconds
  const currentTime = Date.now(); // Current time in milliseconds
  const isTimestampValid =
    Math.abs(currentTime - parseInt(timestamp, 10)) < tolerance;

  if (!isTimestampValid) {
    return false;
  }

  return true;
}
