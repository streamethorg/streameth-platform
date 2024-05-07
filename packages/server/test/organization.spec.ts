import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { after, before, describe, it } from 'node:test';
import { config } from '@config';
import ethers from 'ethers';
const expect = chai.expect;
const chaiRequest = chai.use(chaiHttp);

let organizationId: string = '';
let walletAddress = '';

describe('Organization API', () => {
  describe('/POST organizations', async () => {
    let response;
    it('should return 400 when field is empty', async () => {
      let org = {
        name: 'test',
        email: 'test@gmail.com',
        walletAddress: walletAddress,
      };
      let response = await chaiRequest
        .request(config.port)
        .post('/organizations')
        .send(org);
      expect(response).to.have.status(400);
      expect(response.body.data);
    });
    it('should create an organization', async () => {
      let org = {
        name: 'streameth',
        email: 'streameth@gmail.com',
        logo: 'https://streameth.com',
        walletAddress: walletAddress,
      };
      response = await chaiRequest
        .request(config.port)
        .post('/organizations')
        .send(org);
      organizationId = response.body.data._id.toString();
    });
    it('should return a 201 status code', async () => {
      expect(response).to.have.status(201);
    });
    it('should return an object with the organization', async () => {
      const data = response.body.data;
      expect(data).to.be.a('object');
    });
    it('should include necessary properties like name, email, and description', async () => {
      const data = response.body.data;
      expect(data).to.have.property('name');
    });
  });

  describe('/GET organizations', () => {
    it('should fetch all organizations', async () => {
      const res = await chaiRequest
        .request(config.port)
        .get('/organizations')
        .send();
      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('array');
      organizationId = res.body.data[0]._id;
    });
  });

  describe('/GET organization/:id', () => {
    let response;
    before(async () => {
      if (!organizationId) {
        throw new Error('No organization id found');
      }
      response = await chaiRequest
        .request(config.port)
        .get(`/organizations/${organizationId}`)
        .send();
    });
    it('should return a 200 status code', async () => {
      expect(response).to.have.status(200);
    });
    it('should return an object with the organization', async () => {
      const data = response.body.data;
      expect(data).to.be.a('object');
    });
  });

  describe('/PUT /member/:organizationId', () => {
    let response;
    it('should add a member to organization', async () => {
      response = await chaiRequest
        .request(config.port)
        .put(`/organizations/member/${organizationId}`)
        .send({ walletAddress: walletAddress });
    });
    it('should return a 200 status code', async () => {
      expect(response).to.have.status(200);
    });
  });

  describe('/GET /member/:organizationId', () => {
    let response;
    it('should fetch all members of an organization', async () => {
      response = await chaiRequest
        .request(config.port)
        .get(`/organizations/member/${organizationId}`)
        .send();
    });
    it('should return a 200 status code', async () => {
      expect(response).to.have.status(200);
    });
    it('should return a 200 status code', async () => {
      expect(response).to.have.status(200);
    });
    it('should be an array', async () => {
      expect(response.body.data).to.be.an('array');
    });
  });

  describe('/DELETE /member/:organizationId', () => {
    let response;
    it('should fetch all members of an organization', async () => {
      response = await chaiRequest
        .request(config.port)
        .delete(`/organizations/member/${organizationId}`)
        .send({ walletAddress: walletAddress });
    });
    it('should return a 200 status code', async () => {
      expect(response).to.have.status(200);
    });
  });

  describe('/DELETE organization/:id', () => {
    let response;
    it('should delete an organization', async () => {
      response = await chaiRequest
        .request(config.port)
        .delete(`/organizations/${organizationId}`)
        .send({ organizationId: organizationId });
    });
    it('should return a 200 status code', async () => {
      expect(response).to.have.status(200);
    });
  });

  // describe('/PUT organization', () => {
  //   it('it should update a organization', async () => {
  //     const response = await chaiRequest
  //       .request(config.port)
  //       .put(`/organizations/${organizationId}`)
  //       .send({
  //         name: 'eric',
  //       });
  //   });
  // });
});

after(async () => {});
