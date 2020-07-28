import { expect } from 'chai';
import * as req from 'supertest';
import { findQuery, removeQuery } from './queries';

const url = `http://localhost:8080`;
const request = req(url);

const post = '/graphql';

describe('Test Remove API', () => {
  it('Remove facility', done => {
    request
      .post(post)
      .send({
        query: removeQuery,
        variables: {
          id: 1
        }
      })
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          return done(err);
        }
        const { success, message } = res.body.data.removeFacility;

        expect(success).equal(true);
        expect(message).equal(null);
        done();
      });
  });

  it('Remove facility with invalid ID', done => {
    request
      .post(post)
      .send({
        query: removeQuery,
        variables: {
          id: 2000
        }
      })
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          return done(err);
        }
        const { success, message } = res.body.data.removeFacility;

        expect(success).equal(false);
        expect(message).not.equal(null);
        expect(message).contains('2000');
        done();
      });
  });

  it('Check removed facility', done => {
    request
      .post(post)
      .send({
        query: findQuery,
        variables: {
          id: 1
        }
      })
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          return done(err);
        }
        expect(res.body.data.facility).equal(null);
        done();
      });
  });
});
