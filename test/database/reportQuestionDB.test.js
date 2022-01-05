const db = require('../../models/qandas.js');
const dbhandler = require('../dbhandler.js');
const { putQuestionReported } = require('../../db/services.js');

let question;
let questionID = 1;
beforeAll(async () => {
  await dbhandler.connect()
})

afterAll(async () => {
  await dbhandler.disconnect();
})


describe('Marks a question as reported', () => {

  it('Updates question by question id', async () => {
    let findQuestion = await db.qandaCollection.find({id: questionID});
    let markQuestionHelpful = await putQuestionReported(questionID);
    let updatedQuestion = await db.qandaCollection.find({id: questionID});
    console.log('TEST QUESTION:', updatedQuestion);
    expect(findQuestion).toBeDefined();
    expect(updatedQuestion).toBeDefined();
    expect(findQuestion[0].id).toEqual(updatedQuestion[0].id);
  })
  it('Increments the reported value by 1', async () => {
    let findQuestion = await db.qandaCollection.find({id: questionID});
    let markQuestionHelpful = await putQuestionReported(questionID);
    let updatedQuestion = await db.qandaCollection.find({id: questionID});
    expect(updatedQuestion[0].reported - findQuestion[0].reported).toEqual(1);
  })

})