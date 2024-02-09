import { IStandardResponse, SendApiResponse } from '@utils/api.response';
import { Controller, Get, Route, Tags, Body, Post, Header } from 'tsoa';
import startAITools from '@aitools/main';
import crypto from 'crypto';

@Tags('Index')
@Route('')
export class IndexController extends Controller {
  @Get()
  async index(): Promise<IStandardResponse<string>> {
    return SendApiResponse('OK');
  }
  @Post('/webhook')
  async webhook(
    @Header('Livepeer-Signature') livepeerSignature: string,
    @Body() payload: any,
  ): Promise<IStandardResponse<string>> {
    try {
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

      const tolerance = 8 * 60 * 1000; // 8 minutes in milliseconds
      const currentTime = Date.now(); // Current time in milliseconds
      const isTimestampValid =
        Math.abs(currentTime - parseInt(timestamp, 10)) < tolerance;

      if (!isSignatureValid || !isTimestampValid) {
        console.log('Invalid signature or timestamp');
        return SendApiResponse('Invalid signature or timestamp', null, '401');
      }

      await startAITools(payload.payload.id);
      return SendApiResponse('OK');
    } catch (err) {
      console.log(err);
      return SendApiResponse(err.toString(), null, '500');
    }
  }
}
