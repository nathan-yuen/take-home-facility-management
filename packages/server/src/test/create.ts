import { expect } from 'chai';
import * as req from 'supertest';
import { findQuery } from './queries';

const url = `http://localhost:8080`;
const request = req(url);

const post = '/graphql';

const toAdd = { name: 'Test Facility', address: '123 A St', size: 'LARGE' };

describe('Test Create API', () => {
  it('Add facility', done => {
    request
      .post(post)
      .send({
        query: `mutation add($facility: FacilityAddInput!) {
          addFacility(facility: $facility) {
            id
            name
            address
            size
          }
        }`,
        variables: { facility: toAdd }
      })
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          return done(err);
        }
        const { id, name, address, size } = res.body.data.addFacility;
        expect(id).equal(1001); // data.json ends with 1000 records
        expect(name).equal(toAdd.name);
        expect(address).equal(toAdd.address);
        expect(size).equal(toAdd.size);
        done();
      });
  });

  it('Check added facility', done => {
    request
      .post(post)
      .send({
        query: findQuery,
        variables: {
          id: 1001
        }
      })
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          return done(err);
        }
        const { id, name, address, size } = res.body.data.facility;
        expect(id).equal(1001);
        expect(name).equal(toAdd.name);
        expect(address).equal(toAdd.address);
        expect(size).equal(toAdd.size);
        done();
      });
  });
});
