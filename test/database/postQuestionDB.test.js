const dbhandler = require('../dbhandler.js');
const { postOneQuestion } = require('../../db/services.js');

let question;
let productID = 1;
let body = 'Hey, this is a Test Question!';
let name = 'Tester123';
let email = 'tester123@test.com';
beforeAll(async () => {
  await dbhandler.connect()
  question = await postOneQuestion(productID, body, name, email);
})

afterAll(async () => {
  await dbhandler.disconnect();
})


describe('Posts one question to DB', () => {
  it('Submits a question for a given product id', async () => {
    console.log('TEST QUESTION:', question);
    expect(question).toBeDefined();
    expect(question.product_id).toEqual(productID);
  })

  it('Contains the data which was submitted', async () => {
    expect(question.product_id).toEqual(productID);
    expect(question.body).toEqual(body);
    expect(question.asker_name).toEqual(name);
    expect(question.asker_email).toEqual(email);
  })

  it('Contains the correct shape of question data', async () => {
    expect(typeof question).toBe('object');
    expect(typeof question.id).toBe('number');
    expect(typeof question.product_id).toEqual('number');
    expect(typeof question.body).toEqual('string');
    expect(typeof question.date_written).toBeDefined()
    expect(typeof question.asker_name).toEqual('string');
    expect(typeof question.asker_email).toEqual('string');
    expect(typeof question.helpful).toBe('number');
    expect(typeof question.reported).toBe('number');
    expect(Array.isArray(question.answers)).toBe(true);
  })
})