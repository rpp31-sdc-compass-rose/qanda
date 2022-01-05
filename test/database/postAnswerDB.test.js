const dbhandler = require('../dbhandler.js');
const { postOneAnswer } = require('../../db/services.js');

let answer;
let questionID = 1;
let body = 'Hey, this is a Test Answer here!';
let name = 'Tester123';
let email = 'tester123@test.com';
beforeAll(async () => {
  await dbhandler.connect()
  answer = await postOneAnswer(questionID, body, name, email);
})

afterAll(async () => {
  await dbhandler.disconnect();
})


describe('Posts one answer to DB', () => {
  it('Submits an answer for a given question id', async () => {
    console.log('TEST ANSWER:', answer);
    expect(answer).toBeDefined();
  })

  it('Response indicates a posted answer', async () => {
    expect(answer.acknowledged).toBe(true);
    expect(answer.modifiedCount).toBe(1);
    expect(answer.matchedCount).toBe(1);
  })

  it('Answer id numbers are incremented and tracked', async () => {
    expect(answer.id).toBeDefined();
    expect(typeof answer.id).toBe('number');
  })

})