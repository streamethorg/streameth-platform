import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { before, describe, it } from 'node:test';
import { generateWalletInfo } from './auth';
import { config } from '@config';
const expect = chai.expect;
const chaiRequest = chai.use(chaiHttp)

let stageId: string = '';
let token: string = '';
const eventId: string = '';
const organizationId: string = '';

describe('Stage API', () => {
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
      token = response.body.data.token;
    });
  });
  describe('/POST stages', async () => {
    let response;
    it('should return 400 when field is empty', async () => {
      let stage = {
        name: '',
      };
      response = await chaiRequest
        .request(config.testUrl)
        .post('/stages')
        .send(stage)
        .set('Authorization', `Bearer ${token}`);
    });
    it('should create a stage', async () => {
      let stage = {
        name: 'test stream',
        organizationId: organizationId,
      };
      response = await chaiRequest
        .request(config.testUrl)
        .post('/stages')
        .send(stage)
        .set('Authorization', `Bearer ${token}`);
      stageId = response.body.data._id.toString();
    });
    it('should return 201 status code', async () => {
      expect(response).to.have.status(201);
    });
    it('should return an object with the stage data', async () => {
      const data = response.body.data;
      expect(data).to.be.a('object');
    });
    it('should include necessary properties like name,description ...', async () => {
      const data = response.body.data;
      expect(data).to.have.property('name');
      expect(data).to.have.property('description');
      expect(data).to.have.property('eventId');
      expect(data).to.have.property('streamSettings');
      expect(data).to.have.property('slug');
      expect(data).to.have.property('mintable');
      expect(data).to.have.property('published');
      expect(data.mintable).to.be.a('boolean');
      expect(data.published).to.be.a('boolean');
    });
  });

  describe('/PUT stages/:id', async () => {
    let response;
    it('should return 400 when field is empty', async () => {
      let stage = {
        name: '',
      };
      let response = await chaiRequest
        .request(config.testUrl)
        .put(`/organizations/${stageId}`)
        .send(stage)
        .set('Authorization', `Bearer ${token}`);
      expect(response).to.have.status(400);
      expect(response.body.data);
    });
    it('should update a stage', async () => {
      let stage = {
        name: 'Backup livestream',
        description: '',
        published: false,
        organizationId: organizationId,
        mintable: true,
      };
      response = await chaiRequest
        .request(config.testUrl)
        .put(`/stages/${stageId}`)
        .send(stage)
        .set('Authorization', `Bearer ${token}`);
    });
    it('should return 200 status code', async () => {
      expect(response).to.have.status(200);
    });
    it('should return an object with the stage data', async () => {
      const data = response.body.data;
      expect(data).to.be.a('object');
    });
    it('should include necessary properties like name, description and streamsettings..', async () => {
      const data = response.body.data;
      expect(data).to.have.property('name');
      expect(data).to.have.property('description');
      expect(data).to.have.property('eventId');
      expect(data).to.have.property('streamSettings');
      expect(data).to.have.property('slug');
      expect(data.mintable).to.be.a('boolean');
      expect(data.published).to.be.a('boolean');
    });
  });

  describe('/GET stages/:id', async () => {
    let response;
    before(async () => {
      if (!stageId) {
        throw new Error('No stage found');
      }
      response = await chaiRequest
        .request(config.testUrl)
        .get(`/stages/${stageId}`)
        .send();
    });
    it('should return 200 status code', async () => {
      expect(response).to.have.status(200);
    });
    it('should return an object with the stage', async () => {
      const data = response.body.data;
      expect(data).to.be.a('object');
    });
    it('should include necessary properties like name, description...', async () => {
      const data = response.body.data;
      expect(data).to.have.property('name');
      expect(data).to.have.property('description');
      expect(data).to.have.property('eventId');
      expect(data).to.have.property('streamSettings');
      expect(data).to.have.property('slug');
    });
  });

  describe('/GET stages', async () => {
    it('should fetch all stages', async () => {
      const res = await chaiRequest
        .request(config.testUrl)
        .get('/stages')
        .send();
      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('array');
    });
  });

  describe('/GET stages/event/eventId', async () => {
    let response;
    it('should fetch all stages of an event', async () => {
      response = await chaiRequest
        .request(config.testUrl)
        .get(`/stages/event/${eventId}`)
        .send();
    });
    it('should return 200 status code', async () => {
      expect(response).to.have.status(200);
    });
    it('should be an array', async () => {
      expect(response.body.data).to.be.an('array');
    });
  });

  describe('/GET stages/organization/organizationId', async () => {
    let response;
    it('should fetch all stages of an event', async () => {
      response = await chaiRequest
        .request(config.testUrl)
        .get(`/stages/organization/${organizationId}`)
        .send();
    });
    it('should return 200 status code', async () => {
      expect(response).to.have.status(200);
    });
    it('should be an array', async () => {
      expect(response.body.data).to.be.an('array');
    });
  });

  describe('/DELETE stages', async () => {
    let response;
    it('should delete a stage', async () => {
      response = await chaiRequest
        .request(config.testUrl)
        .delete(`/stages/${stageId}`)
        .send({ organizationId: organizationId })
        .set('Authorization', `Bearer ${token}`);
    });
    it('should return 200 status code', async () => {
      expect(response).to.have.status(200);
    });
  });
});
