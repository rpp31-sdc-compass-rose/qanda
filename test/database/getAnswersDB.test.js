const dbhandler = require('../dbhandler.js');
const { getAllAnswers } = require('../../db/services.js');

let answers;
let questionID = 5;
beforeAll(async () => {
  await dbhandler.connect()
  answers = await getAllAnswers(questionID, 1, 5);
})

afterAll(async () => {
  await dbhandler.disconnect();
})


describe('Get all questions from DB', () => {

  it('Fetches all answers by question id', async () => {
    console.log('TEST ANSWERS:', answers);
    expect(answers).toBeDefined();
    expect(Number(answers.question)).toBe(questionID);
  })

  it('Returns an object with results', async () => {
    expect(typeof answers).toBe('object');
    expect(Array.isArray(answers.results)).toBe(true);
    expect(answers.results.length).toBeGreaterThan(0);
  })

  it('Contains the correct data shape of answers', async () => {
    for (let answer of answers.results) {
      expect(typeof answer.answer_id).toBe('number');
      expect(typeof answer.body).toBe('string');
      expect(typeof answer.date).toBeDefined();
      expect(typeof answer.answerer_name).toBe('string');
      expect(typeof answer.helpfulness).toBe('number');
      expect(Array.isArray(answer.photos)).toBe(true);
    }
  })
})