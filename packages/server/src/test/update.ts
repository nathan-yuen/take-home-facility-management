import { expect } from 'chai';
import * as req from 'supertest';
import { findQuery, updateQuery } from './queries';

const url = `http://localhost:8080`;
const request = req(url);

const post = '/graphql';

const toUpdate = { id: 20, name: 'AAAA', address: 'BBBB', size: 'SMALL' };

describe('Test Update API', () => {
  it('Update facility', done => {
    request
      .post(post)
      .send({
        query: updateQuery,
        variables: {
          facility: toUpdate
        }
      })
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          return done(err);
        }
        const { success, updated } = res.body.data.updateFacility;
        const { id, name, address, size } = updated;

        expect(success).equal(true);
        expect(id).equal(toUpdate.id);
        expect(name).equal(toUpdate.name);
        expect(address).equal(toUpdate.address);
        expect(size).equal(toUpdate.size);
        done();
      });
  });

  it('Check updated facility', done => {
    request
      .post(post)
      .send({
        query: findQuery,
        variables: {
          id: toUpdate.id
        }
      })
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          return done(err);
        }
        const { id, name, address, size } = res.body.data.facility;
        expect(id).equal(toUpdate.id);
        expect(name).equal(toUpdate.name);
        expect(address).equal(toUpdate.address);
        expect(size).equal(toUpdate.size);
        done();
      });
  });

  it('Update facility with invalid ID', done => {
    const facility = { id: 2000, name: 'AAAA', address: 'BBBB', size: 'SMALL' };

    request
      .post(post)
      .send({
        query: updateQuery,
        variables: {
          facility
        }
      })
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          return done(err);
        }
        const { success, updated, message } = res.body.data.updateFacility;

        expect(success).equal(false);
        expect(updated).equal(null);
        expect(message).not.equal(null);
        expect(message).contains('2000');
        done();
      });
  });
});
