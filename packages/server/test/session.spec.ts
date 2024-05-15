import { before, describe, it } from 'node:test';
import { generateWalletInfo } from './auth';
import { config } from '@config';
import { Mock } from '.';

export const sessionTest = (mock: Mock, chaiRequest: any, expect: any) => {
  describe('generate auth token', () => {
    before(async () => {
      const sig = await generateWalletInfo();
      const response = await chaiRequest
        .request(config.testUrl)
        .post(`/auth/login`)
        .send({
          walletAddress: sig.walletAddress,
          nonce: sig.nonce,
          signature: sig.signature,
          message: sig.message,
        });
      mock.token = response.body.data.token;
      mock.walletAddress = sig.walletAddress;
    });
  });
};
