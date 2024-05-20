import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { before, describe, it } from 'node:test';
import { config } from '@config';
const expect = chai.expect;
const chaiRequest = chai.use(chaiHttp);

export const stages = () => {
  describe('Speakers API', () => {
    let speakerId: string = '';
    let eventId: string = '';
    let organizationId: string = '';

    describe('/POST speakers', async () => {
      let response;

      it('should return 400 when field is empty', async () => {
        let speaker = {
          name: '',
          bio: '',
          eventId: '',
          twitter: '',
          github: '',
          website: '',
          photo: '',
          company: '',
          organizationId: '',
        };

        await chaiRequest
          .request(config.testUrl)
          .post('/speakers')
          .send(speaker);
      });

      it('should create speaker data', async () => {
        let speaker = {
          name: 'vitalik',
          bio: 'ETH',
          eventId: eventId,
          twitter: '',
          github: '',
          website: '',
          photo: '',
          company: '',
          organizationId: '',
        };
        response = await chaiRequest
          .request(config.testUrl)
          .post('/speakers')
          .send(speaker);
        speakerId = response.body.data._id.toString();
      });

      it('should return 201 status code', async () => {
        expect(response).to.have.status(201);
      });

      it('should return an object with the speaker data', async () => {
        const data = response.body.data;
        expect(data).to.be.a('object');
      });
      it('should include necessary properties like name, bio...', async () => {
        const data = response.body.data;
        expect(data).to.have.property('name');
        expect(data).to.have.property('bio');
        expect(data).to.have.property('eventId');
        expect(data).to.have.property('twitter');
        expect(data).to.have.property('github');
        expect(data).to.have.property('website');
        expect(data).to.have.property('photo');
        expect(data).to.have.property('company');
        expect(data).to.have.property('slug');
      });
    });
    describe('/GET speakers/speakerId', async () => {
      let response;
      before(async () => {
        if (!speakerId) {
          throw new Error('No speaker found');
        }
        response = await chaiRequest
          .request(config.testUrl)
          .get(`/speakers/${speakerId}`)
          .send();
        it('should return 200 status code', async () => {
          expect(response).to.have.status(200);
        });
        it('should return an object with the speaker', async () => {
          const data = response.body.data;
          expect(data).to.be.a('object');
        });
        it('should include necessary properties like name, bio...', async () => {
          const data = response.body.data;
          expect(data).to.have.property('name');
          expect(data).to.have.property('bio');
          expect(data).to.have.property('eventId');
          expect(data).to.have.property('twitter');
          expect(data).to.have.property('github');
          expect(data).to.have.property('website');
          expect(data).to.have.property('photo');
          expect(data).to.have.property('company');
          expect(data).to.have.property('slug');
        });
      });
    });

    describe('/GET speakers/event/eventId', async () => {
      let response;
      it('should fetch all speakers of an event', async () => {
        response = await chaiRequest
          .request(config.testUrl)
          .get(`/speakers/event/${eventId}`)
          .send();
      });
      it('should return 200 status code', async () => {
        expect(response).to.have.status(200);
      });
      it('should be an array', async () => {
        expect(response.body.data).to.be.an('array');
      });
    });
  });
};
