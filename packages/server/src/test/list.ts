import { expect } from 'chai';
import * as req from 'supertest';

const url = `http://localhost:8080`;
const request = req(url);

const post = '/graphql';

describe('Test List API', () => {
  it('List facilities with limit & offset', done => {
    request
      .post(post)
      .send({
        query: `query list {
            facilities(offset: 21, limit: 10) {
              total
              items {
                id
                name
                address
                size
              }
            }
          }`
      })
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          return done(err);
        }
        expect(res.body.data.facilities.total).equal(1001); // based on data.json, and after create tests
        expect(res.body.data.facilities.items[0].id).equal(22);
        expect(res.body.data.facilities.items[0].name).equal('Walter Group');
        expect(res.body.data.facilities.items[0].address).equal('887 Mcbride Terrace');
        expect(res.body.data.facilities.items[0].size).equal('LARGE');
        expect(res.body.data.facilities.items.length).equal(10);
        done();
      });
  });

  it('List facilities with sizeFilter', done => {
    request
      .post(post)
      .send({
        query: `query list {
          facilities(offset: 0, limit: 25, sizeFilter: SMALL) {
            total
              items {
                id
                size
              }
            }
          }`
      })
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          return done(err);
        }
        expect(res.body.data.facilities.total).equal(319); // based on data.json
        expect(res.body.data.facilities.items.every((f: any) => f.size === 'SMALL')).equal(true);
        expect(res.body.data.facilities.items.length).equal(25);
        done();
      });
  });

  it('List facilities with filter', done => {
    request
      .post(post)
      .send({
        query: `query list {
          facilities(offset: 0, limit: 25, filter: "LLC") {
            total
              items {
                id
                size
              }
            }
          }`
      })
      .expect(200)
      .end((err: any, res: any) => {
        if (err) {
          return done(err);
        }
        expect(res.body.data.facilities.total).equal(96); // based on data.json
        expect(res.body.data.facilities.items.length).equal(25);
        done();
      });
  });
});
