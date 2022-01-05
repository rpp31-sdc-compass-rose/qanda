const request = require('supertest');
const app = require('../../server/app.js');
const mongoose = require('mongoose');
let testPort = 3001;
let server;

let response;
let question_id;
beforeAll(async () => {
  server = await app.listen(testPort, () => {
    console.log(`Test Server listening on port ${testPort}!`)
  })
  question_id = 2;
  response = await request(app)
    .get(`/qa/questions/${question_id}/answers`)
})

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
})

describe('GET /qa/questions/:question_id/answers', () => {
  describe('status codes', () => {
    it('sends an HTTP status code of 200 on success', async () => {
      let question_id = 2;
      let response = await request(app)
        .get(`/qa/questions/${question_id}/answers`)
        expect(response.statusCode).toBe(200);
    })
    it('sends an HTTP status code of 500 on error', async () => {
      let question_id = '1a2b3c4d';
      let response = await request(app)
        .get(`/qa/questions/${question_id}/answers`)
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

    it('sends back the correct data by question ID', async () => {
      expect(response.body.question).toEqual(question_id);
    })

    it('sends back an array of object results', async () => {
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results.length).toBeGreaterThan(0);
    })

    it('each object has correct return data for client', async () => {
      for (let i = 0; i < response.body.results.length; i++) {
        expect(typeof response.body.results[i]).toBe('object');
        expect(response.body.results[i].answer_id).toBeDefined();
        expect(response.body.results[i].body).toBeDefined();
        expect(response.body.results[i].answerer_name).toBeDefined();
        expect(response.body.results[i].photos).toBeDefined();
      }
    })

    it('should contain an array of product photos', async () => {
      for (let i = 0; i < response.body.results.length; i++) {
        if (response.body.results[i].photos.length) {
          for (let j = 0; j < response.body.results[i].photos.length; j++) {
            expect(typeof response.body.results[i].photos[j].id).toBe('number')
            expect(typeof response.body.results[i].photos[j].url).toBe('string')
            expect(response.body.results[i].photos[j].url).toMatch(/http/i)
          }
        }
      }
    })

  })


});