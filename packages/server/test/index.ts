import * as chai from 'chai';
import chaiHttp from 'chai-http';

import { sessionTest } from './session.spec';
import { organizationTest } from './organization.spec';
import { stageTest } from './stage.spec';
import { eventTest } from './event.spec';

const expect = chai.expect;
const chaiRequest = chai.use(chaiHttp);

const start = () => {
  organizationTest(chaiRequest, expect);
  stageTest(chaiRequest, expect);
  sessionTest(chaiRequest, expect);
  eventTest(chaiRequest, expect);
};

start();
