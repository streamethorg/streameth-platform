import { after, before, describe, it } from 'node:test';
import { generateWalletInfo } from './auth';
import { config } from '@config';
import { IStage } from '@interfaces/stage.interface';
import { generateRandomString } from './utils/generateRandomString';
import chai, { expect } from './global';

describe('Stage API', () => {
  let sig: any;
  let stageId = '';
  let token = '';
  let eventId = '';

  let organizationId = '';
  const organizationName = generateRandomString(12);

  const org = {
    name: organizationName,
    email: 'streameth@gmail.com',
    logo: 'https://streameth.com',
    walletAddress: '',
  };

  before(async () => {
    try {
      sig = await generateWalletInfo();
      let response = await chai
        .request(config.testUrl)
        .post(`/auth/login`)
        .send({
          walletAddress: sig.walletAddress,
          nonce: sig.nonce,
          signature: sig.signature,
          message: sig.message,
        });

      if (response.status !== 201) {
        throw new Error('Failed to login');
      }

      token = response.body.data.token;
      org.walletAddress = sig.walletAddress;

      response = await chai
        .request(config.testUrl)
        .post('/organizations')
        .send(org)
        .set('Authorization', `Bearer ${token}`);

      if (response.status !== 201) {
        throw new Error(response.body);
      }

      organizationId = response.body.data._id.toString();
    } catch (error) {
      console.error('Error in setup:', error);
      throw error;
    }
  });

  after(async () => {
    try {
      const response = await chai
        .request(config.testUrl)
        .delete(`/organizations/${organizationId}`)
        .set('Authorization', `Bearer ${token}`);

      if (response.status !== 200) {
        throw new Error(
          `Failed to delete organization - STATUS: ${response.status}`,
        );
      }
    } catch (error) {
      console.error('Error in cleanup:', error);
      throw error;
    }
  });

  describe('/POST stages', async () => {
    let response: any;

    it('should return 400 when field is empty', async () => {
      const stage = {
        name: '',
        organizationId: organizationId
      };

      response = await chai
        .request(config.testUrl)
        .post('/stages')
        .send(stage)
        .set('Authorization', `Bearer ${token}`);
    });

    it('should create a stage', async () => {
      const stage = {
        name: 'test stream',
        organizationId: organizationId,
      };

      response = await chai
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

    it('should include necessary properties like name, description, etc.', async () => {
      const data = response.body.data;

      expect(data).to.have.property('_id');
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
    let response: any;
    let stage: IStage = {
      name: 'Backup livestream',
      description: 'Detailed description here',
      organizationId: '',
    };

    it('should return 400 when field is empty', async () => {
      const stage = {
        name: '',
      };

      const response = await chai
        .request(config.testUrl)
        .put(`/organizations/${stageId}`)
        .send(stage)
        .set('Authorization', `Bearer ${token}`);

      expect(response).to.have.status(400);
      expect(response.body.data);
    });

    it('should update a stage', async () => {
      stage.organizationId = organizationId;

      response = await chai
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

    it('should include necessary properties like name, description & streamsettings', async () => {
      const data = response.body.data;

      expect(data).to.have.property('_id');
      expect(data).to.have.property('name');
      expect(data).to.have.property('description');
      expect(data).to.have.property('eventId');
      expect(data).to.have.property('streamSettings');
      expect(data).to.have.property('slug');
      expect(data.mintable).to.be.a('boolean');
      expect(data.published).to.be.a('boolean');
    });

    it('should have the correct properties', async () => {
      const data = response.body.data;

      expect(data.name).to.equal(stage.name);
      expect(data.description).to.equal(stage.description);
      expect(data.organizationId).to.equal(stage.organizationId);
    });
  });

  describe('/GET stages/:id', async () => {
    let response;
    before(async () => {
      if (!stageId) {
        throw new Error('No stage found');
      }
      response = await chai
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
      const res = await chai.request(config.testUrl).get('/stages').send();
      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('array');
    });
  });

  // describe('/GET stages/event/eventId', async () => {
  //   let response;
  //   it('should fetch all stages of an event', async () => {
  //     response = await chai
  //       .request(config.testUrl)
  //       .get(`/stages/event/${eventId}`)
  //       .send();
  //   });
  //   it('should return 200 status code', async () => {
  //     expect(response).to.have.status(200);
  //   });
  //   it('should be an array', async () => {
  //     expect(response.body.data).to.be.an('array');
  //   });
  // });

  describe('/GET stages/organization/:organizationId', async () => {
    let response: any;

    it('empty string returns a 404', async () => {
      const response = await chai
        .request(config.testUrl)
        .get(`/stages/organization/${''}`)
        .send();

      expect(response).to.have.status(404);
    });

    it('should fetch all stages of an organisation', async () => {
      response = await chai
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
    let response: any;

    it('should delete a stage', async () => {
      response = await chai
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
