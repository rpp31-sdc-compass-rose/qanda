const dbhandler = require('../dbhandler.js');
const { getAllQuestions } = require('../../db/services.js');

let questions;
let productID = 1;
beforeAll(async () => {
  await dbhandler.connect()
  questions = await getAllQuestions(productID);
})

afterAll(async () => {
  await dbhandler.disconnect();
})


describe('Get all questions from DB', () => {

  it('Fetches all questions by product id', async () => {
    console.log('TEST QUESTIONS:', questions);
    expect(questions).toBeDefined();
    expect(Number(questions.product_id)).toBe(productID);
  })

  it('Returns an object with results', async () => {
    expect(typeof questions).toBe('object');
    expect(Array.isArray(questions.results)).toBe(true);
    expect(questions.results.length).toBeGreaterThan(0);
  })

  it('Contains the correct shape of question data', async () => {
    for (let question of questions.results) {
      expect(typeof question.question_id).toBe('number');
      expect(typeof question.question_body).toBe('string');
      expect(typeof question.question_date).toBeDefined();
      expect(typeof question.asker_name).toBe('string');
      expect(typeof question.question_helpfulness).toBe('number');
      expect(typeof question.reported).toBe('boolean');
      expect(question.answers).toBeDefined();
    }
  })
})