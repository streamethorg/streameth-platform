import { before, describe, it } from 'node:test';
import { config } from '@config';
import { Mock } from '.';

export const organizationTest = (mock: Mock, chaiRequest: any, expect: any) => {
  describe('generate auth token', (done) => {
    describe('Organization API', () => {
      describe('/POST organizations', async () => {
        let response: any;

        it('should return 400 when field is missing', async () => {
          const org = {
            email: 'streameth@gmail.com',
            walletAddress: mock.walletAddress,
            // Missing logo & name
          };

          let response = await chaiRequest
            .request(config.testUrl)
            .post('/organizations')
            .send(org)
            .set('Authorization', `Bearer ${mock.token}`);

          expect(response).to.have.status(400);
          expect(response.body.data);
        });

        it('should create an organization', async () => {
          const org = {
            name: mock.organizationName,
            email: 'streameth@gmail.com',
            logo: 'https://streameth.com',
            walletAddress: mock.walletAddress,
          };

          response = await chaiRequest
            .request(config.testUrl)
            .post('/organizations')
            .send(org)
            .set('Authorization', `Bearer ${mock.token}`);

          mock.organizationId = response.body.data._id.toString();
        });

        it('should return 201 status code', async () => {
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
            .request(config.testUrl)
            .get('/organizations')
            .send();
          expect(res).to.have.status(200);
          expect(res.body.data).to.be.an('array');
        });
      });

      describe('/GET organization/:id', () => {
        let response;
        before(async () => {
          if (!mock.organizationId) {
            throw new Error('No organization id found');
          }
          response = await chaiRequest
            .request(config.testUrl)
            .get(`/organizations/${mock.organizationId}`)
            .send();
        });
        it('should return 200 status code', async () => {
          expect(response).to.have.status(200);
        });
        it('should return an object with the organization data', async () => {
          const data = response.body.data;
          expect(data).to.be.a('object');
        });
      });

      describe('/PUT /member/:organizationId', () => {
        let response;
        it('should add a member to organization', async () => {
          response = await chaiRequest
            .request(config.testUrl)
            .put(`/organizations/member/${mock.organizationId}`)
            .send({ walletAddress: mock.walletAddress })
            .set('Authorization', `Bearer ${mock.token}`);
        });
        it('should return 200 status code', async () => {
          expect(response).to.have.status(200);
        });
      });

      describe('/PUT organizations/:id', async () => {
        let response;
        it('should return 400 when field is empty', async () => {
          let org = {
            name: mock.organizationName,
            email: 'streameth@gmail.com',
            walletAddress: mock.walletAddress,
          };
          let response = await chaiRequest
            .request(config.testUrl)
            .put(`/organizations/${mock.organizationId}`)
            .send(org)
            .set('Authorization', `Bearer ${mock.token}`);
          expect(response).to.have.status(400);
          expect(response.body.data);
        });
        it('should update an organization', async () => {
          let org = {
            name: 'streameth1',
            email: 'streameth1@gmail.com',
            logo: 'https://streameths.com',
            walletAddress: mock.walletAddress,
          };
          response = await chaiRequest
            .request(config.testUrl)
            .put(`/organizations/${mock.organizationId}`)
            .send(org)
            .set('Authorization', `Bearer ${mock.token}`);
        });
        it('should return 200 status code', async () => {
          expect(response).to.have.status(200);
        });
        it('should return an object with the organization', async () => {
          const data = response.body.data;
          expect(data).to.be.a('object');
        });
        it('should include necessary properties like name, email, and description', async () => {
          const data = response.body.data;
          expect(data).to.have.property('name');
          expect(data).to.have.property('email');
          expect(data).to.have.property('description');
          expect(data).to.have.property('url');
          expect(data).to.have.property('logo');
          expect(data).to.have.property('slug');
        });
      });

      describe('/GET /member/:organizationId', () => {
        let response: any;

        it('should fetch all members of an organization', async () => {
          response = await chaiRequest
            .request(config.testUrl)
            .get(`/organizations/member/${mock.organizationId}`)
            .send()
            .set('Authorization', `Bearer ${mock.token}`);
        });

        it('should return 200 status code', async () => {
          expect(response).to.have.status(200);
        });

        it('should be an array', async () => {
          expect(response.body.data).to.be.an('array');
        });
      });

      //   describe('/DELETE /member/:organizationId', () => {
      //     let response;
      //     it('should fetch all members of an organization', async () => {
      //     let wallet = await ethers.Wallet.createRandom
      //       response = await chaiRequest
      //         .request(config.testUrl)
      //         .delete(`/organizations/member/${organizationId}`)
      //         .send({ walletAddress: walletAddress })
      //         .set('Authorization', `Bearer ${token}`);
      //     });
      //     it('should return a 200 status code', async () => {
      //       expect(response).to.have.status(200);
      //     });
      //   });

      describe('/DELETE organization/:id', () => {
        let response: any;

        it('should delete organization', async () => {
          response = await chaiRequest
            .request(config.testUrl)
            .delete(`/organizations/${mock.organizationId}`)
            .send({ organizationId: mock.organizationId })
            .set('Authorization', `Bearer ${mock.token}`);
        });
        it('should return 200 status code', async () => {
          expect(response).to.have.status(200);
        });
      });
    });
    done;
  });
};
