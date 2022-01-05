const request = require('supertest');
const app = require('../../server/app.js');
const mongoose = require('mongoose');
let testPort = 3001;
let server;

let question_id;
let response;
beforeAll(async () => {
  server = await app.listen(testPort, () => {
    console.log(`Test Server listening on port ${testPort}!`)
  })
  question_id = 3518963;
  response = await request(app)
  .put(`/qa/questions/${question_id}/helpful`)
})

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
})

describe('PUT /qa/questions/:question_id/helpful', () => {

  describe('status codes', () => {
    it('sends an HTTP status code of 200 on success', async () => {
      expect(response.statusCode).toBe(200);
    })
    it('sends an HTTP status code of 500 on error', async () => {
      let incorrectID = '1a2b3c';
      let response = await request(app).put(`/qa/questions/${incorrectID}/helpful`)
      expect(response.statusCode).toBe(500);
    })
  })

  describe('content and data', () => {
    it('responds with message that question was marked helpful', async () => {
      expect(response.headers['content-type']).toEqual(expect.stringContaining('text'));
      expect(response.text).toMatch(/helpful/i)
    })

  })


})