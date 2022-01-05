const db = require('../../models/qandas.js');
const dbhandler = require('../dbhandler.js');
const { putQuestionHelpful } = require('../../db/services.js');

let question;
let questionID = 1;
beforeAll(async () => {
  await dbhandler.connect()
})

afterAll(async () => {
  await dbhandler.disconnect();
})


describe('Marks a question helpful', () => {

  it('Updates question by question id', async () => {
    let findQuestion = await db.qandaCollection.find({id: questionID});
    let markQuestionHelpful = await putQuestionHelpful(questionID);
    let updatedQuestion = await db.qandaCollection.find({id: questionID});
    console.log('TEST QUESTION:', updatedQuestion);
    expect(findQuestion).toBeDefined();
    expect(updatedQuestion).toBeDefined();
    expect(findQuestion[0].id).toEqual(updatedQuestion[0].id);
  })
  it('Increments the helpful value by 1', async () => {
    let findQuestion = await db.qandaCollection.find({id: questionID});
    let markQuestionHelpful = await putQuestionHelpful(questionID);
    let updatedQuestion = await db.qandaCollection.find({id: questionID});
    expect(updatedQuestion[0].helpful - findQuestion[0].helpful).toEqual(1);
  })
  // it('Throws an error for the incorrect query', async () => {
  //   let incorrectID = 123456789123456789;
  //   let markQuestionHelpful = await putQuestionHelpful(incorrectID)
  //   console.log('ERR:', markQuestionHelpful)
  //   expect(markQuestionHelpful.matchedCount).toEqual(0);
  // })

})