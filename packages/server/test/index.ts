import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { before, describe, it } from 'node:test';
import { generateWalletInfo } from './auth';
import { config } from '@config';
import { generateRandomString } from './utils/generateRandomString';

import { sessionTest } from './session.spec';
import { organizationTest } from './organization.spec';
import { stageTest } from './stage.spec';
import { eventTest } from './event.spec';

const expect = chai.expect;
const chaiRequest = chai.use(chaiHttp);

export type Mock = {
  organizationName: string;
  organizationId: string;
  token: string;
  walletAddress: string;
};

const start = () => {
  describe('start test', () => {
    const mock: Mock = {
      token: '',
      organizationId: '',
      walletAddress: '',
      organizationName: generateRandomString(12),
    };

    // before(async () => {
    //   const sig = await generateWalletInfo();
    //   const response = await chaiRequest
    //     .request(config.testUrl)
    //     .post(`/auth/login`)
    //     .send({
    //       walletAddress: sig.walletAddress,
    //       nonce: sig.nonce,
    //       signature: sig.signature,
    //       message: sig.message,
    //     });
    //
    //   console.log(response.body);
    //   mock.token = response.body.data.token;
    //   mock.walletAddress = sig.walletAddress;
    //
    //   console.log('Should print first');
    // });

    // organizationTest(mock, chaiRequest, expect);
    // stageTest(chaiRequest, expect);
    sessionTest(chaiRequest, expect);
    // eventTest(chaiRequest, expect);
  });
};

start();
