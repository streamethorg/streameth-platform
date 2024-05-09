import { config } from '@config';
import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { before, describe, it } from 'node:test';
const expect = chai.expect;
const chaiRequest = chai.use(chaiHttp);

let eventId: string = '';
const organizationId = '';
describe('Event API', () => {
  describe('/POST events', async () => {
    let response;
    it('should return 400 when field is empty', async () => {
      let event = {
        name: '',
        description: '',
        start: '',
        end: '',
        location: '',
        logo: '',
        banner: '',
        organizationId: '',
      };
      await chaiRequest.request(config.testUrl).post('/events').send(event);
    });
    it('should create an event', async () => {
      let event = {
        name: 'Security',
        description: 'Security Auditing',
        start: '2024-05-13',
        end: '2024-05-18',
        location: 'Germany',
        logo: '',
        banner: '',
        organizationId: organizationId,
        timezone: 'Europe',
        dataImporter: [
          {
            type: 'gsheet',
            config: {
              sheetId: 'HuBa0dpUTf2EdtGZKFf6LOqVQ0BMM3iM',
            },
          },
        ],
      };
      response = await chaiRequest
        .request(config.testUrl)
        .post('/events')
        .send(event);
      eventId = response.body.data._id.toString();
    });
    it('should return 201 status code', async () => {
      expect(response).to.have.status(201);
    });
    it('should return an object with the stage', async () => {
      const data = response.body.data;
      expect(data).to.be.a('object');
    });
    it('should include necessary properties like name, email, and description', async () => {
      const data = response.body.data;
      expect(data).to.have.property('name');
      expect(data).to.have.property('description');
      expect(data).to.have.property('start');
      expect(data).to.have.property('end');
      expect(data).to.have.property('location');
      expect(data).to.have.property('logo');
      expect(data).to.have.property('banner');
      expect(data).to.have.property('organizationId');
      expect(data).to.have.property('timezone');
      expect(data).to.have.property('slug');
      expect(data).to.have.property('unlisted');
      expect(data.unlisted).to.be.a('boolean');
    });
  });

  describe('/PUT events', async () => {});

  describe('/GET events/eventId', async () => {
    let response;
    before(async () => {
      if (!eventId) {
        throw new Error('No event found');
      }
      response = await chaiRequest
        .request(config.testUrl)
        .get(`/events/${eventId}`)
        .send();
    });
    it('should return 200 status code', async () => {
      expect(response).to.have.status(200);
    });
    it('should return an object with the event', async () => {
      const data = response.body.data;
      expect(data).to.be.a('object');
    });
    it('should include necessary properties like name, description..', async () => {
      const data = response.body.data;
      expect(data).to.have.property('name');
      expect(data).to.have.property('description');
      expect(data).to.have.property('start');
      expect(data).to.have.property('end');
      expect(data).to.have.property('location');
      expect(data).to.have.property('logo');
      expect(data).to.have.property('banner');
      expect(data).to.have.property('organizationId');
      expect(data).to.have.property('timezone');
      expect(data).to.have.property('slug');
      expect(data).to.have.property('unlisted');
      expect(data.unlisted).to.be.a('boolean');
      expect(data.archiveMode).to.be.a('boolean');
    });
  });

  describe('/GET events', async () => {
    it('should fetch all events', async () => {
      const res = await chaiRequest
        .request(config.testUrl)
        .get('/events')
        .send();
      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('array');
    });
  });

  describe('/PUT events/import/eventId', async () => {
    let response;
    it('should sync event importer service', async () => {
      let event = {
        organizationId: organizationId,
      };
      response = await chaiRequest
        .request(config.testUrl)
        .put(`/events/import/${eventId}`)
        .send(event);
    });
    it('should return a 200 status code', async () => {
      expect(response).to.have.status(200);
    });
  });

  describe('/DELETE events/eventId', async () => {
    let response;
    it('should delete a event', async () => {
      response = await chaiRequest
        .request(config.testUrl)
        .delete(`/events/${eventId}`)
        .send({ organizationId: organizationId });
    });
    it('should return 200 status code', async () => {
      expect(response).to.have.status(200);
    });
  });
});
