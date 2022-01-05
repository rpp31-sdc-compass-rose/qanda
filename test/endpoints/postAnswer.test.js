const request = require('supertest');
const app = require('../../server/app.js');
const mongoose = require('mongoose');
let testPort = 3001;
let server;

let correctBody;
let response;
beforeAll(async () => {
  server = await app.listen(testPort, () => {
    console.log(`Test Server listening on port ${testPort}!`)
  })
  correctBody = {
    body: 'Test Answer Here!',
    name: 'Tester123',
    email: 'Tester123@gmail.com',
    question_id: 1
  };
  response = await request(app)
  .post(`/qa/questions/${correctBody.question_id}/answers`)
  .send(correctBody)
})

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
})

describe('POST /qa/questions/:question_id/answers', () => {

  describe('status codes', () => {
    it('sends an HTTP status code of 201 on success', async () => {
      let correctBody = {
        body: 'Test Answer Here!',
        name: 'Tester123',
        email: 'Tester123@gmail.com',
        question_id: 1
      };
      let response = await request(app)
        .post(`/qa/questions/${correctBody.question_id}/answers`)
        .send(correctBody)
        expect(response.statusCode).toBe(201);
    })
    it('sends an HTTP status code of 500 on error', async () => {
      let incorrectBody = {
        body: 12345,
        name: null,
        email: 'null@null.com',
        question_id: '1a2b3c'
      };
      let response = await request(app)
        .post(`/qa/questions/${incorrectBody.question_id}/answers`)
        .send(incorrectBody)
        expect(response.statusCode).toBe(500);
    })
  })


  describe('content and data', () => {
    it('sends a message that the question was posted', () => {
      expect(response.headers['content-type']).toEqual(expect.stringContaining('text'));
      expect(response.text).toMatch(/posted/i)
    })

  })

})