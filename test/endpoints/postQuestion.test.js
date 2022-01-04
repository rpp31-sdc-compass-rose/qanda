const request = require('supertest');
const app = require('../../server/app.js');

describe('POST /qa/questions', () => {

  describe('status codes', () => {
    it('sends an HTTP status code of 201 on success', async () => {
      let correctBody = {
        body: 'Test Question Here!',
        name: 'Tester123',
        email: 'Tester123@gmail.com',
        product_id: 1
      };
      let response = await request(app)
        .post('/qa/questions/')
        .send(correctBody)
        expect(response.statusCode).toBe(201);
    })
    it('sends an HTTP status code of 500 on error', async () => {
      let incorrectBody = {
        body: 12345,
        name: null,
        email: 'null@null.com',
        product_id: 1
      };
      let response = await request(app)
        .post('/qa/questions/')
        .send(incorrectBody)
        expect(response.statusCode).toBe(500);
    })
  })

  let correctBody;
  let response;
  beforeAll(async () => {
    correctBody = {
      body: 'Test Question Here!',
      name: 'Tester123',
      email: 'Tester123@gmail.com',
      product_id: 1
    };
    response = await request(app)
    .post('/qa/questions/')
    .send(correctBody)
  })

  describe('content and data', () => {
    it('sends a message that the question was posted', () => {
      expect(response.headers['content-type']).toEqual(expect.stringContaining('json' || 'text'))
      // expect(response.text).toMatch(/posted/i)
    })

  })

})