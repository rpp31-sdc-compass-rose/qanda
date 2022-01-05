const request = require('supertest');
const app = require('../../server/app.js');
const mongoose = require('mongoose');
let testPort = 3001;
let server;

let response;
let correctQuery;
beforeAll(async () => {
  server = await app.listen(testPort, () => {
    console.log(`Test Server listening on port ${testPort}!`)
  })
  correctQuery = {product_id: 1, page: 1, count: 5};
  response = await request(app)
    .get('/qa/questions/')
    .query(correctQuery)
})

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
})

describe('GET /qa/questions/', () => {
  describe('status codes', () => {
    it('sends an HTTP status code of 200 on success', async () => {
      let correctQuery = {product_id: 1, page: 1, count: 5};
      let response = await request(app)
        .get('/qa/questions/')
        .query(correctQuery)
        expect(response.statusCode).toBe(200);
    })
    it('sends an HTTP status code of 500 on error', async () => {
      let incorrectQuery = {product_id: 'zxcv', page: 1, count: 5}
      let response = await request(app)
        .get('/qa/questions/')
        .query(incorrectQuery)
        expect(response.statusCode).toBe(500);
    })
  })


  describe('content and data', () => {
    it('sends JSON content-type upon success', async () => {
      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    })

    it('sends back a response body', async () => {
      expect(response.body).toBeDefined();
      expect(typeof response.body).toBe('object');
    })

    it('sends back the correct data by product ID', async () => {
      expect(response.body.product_id).toEqual(correctQuery.product_id.toString());
    })

    it('sends back an array of object results', async () => {
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results.length).toBeGreaterThan(0);
    })

    it('each object has correct return data for client', async () => {
      for (let i = 0; i < response.body.results.length; i++) {
        expect(typeof response.body.results[i]).toBe('object');
        expect(response.body.results[i].question_id).toBeDefined();
        expect(response.body.results[i].question_body).toBeDefined();
        expect(response.body.results[i].asker_name).toBeDefined();
        expect(response.body.results[i].answers).toBeDefined();
      }
    })

  })
})