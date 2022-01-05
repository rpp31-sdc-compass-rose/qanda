const db = require('../../models/qandas.js');
const dbhandler = require('../dbhandler.js');
const { putAnswerHelpful } = require('../../db/services.js');

let answer;
let answerID = 1;
beforeAll(async () => {
  await dbhandler.connect()
})

afterAll(async () => {
  await dbhandler.disconnect();
})


describe('Marks an answer helpful', () => {

  it('Updates answer by answer id', async () => {
    let findAnswer = await db.qandaCollection.find({"answers.id": answerID});
    let markAnswerHelpful = await putAnswerHelpful(answerID);
    let updatedAnswer = await db.qandaCollection.find({"answers.id": answerID});
    console.log('TEST ANSWER:', updatedAnswer);
    console.log('FIND ANSWER:', findAnswer)
    console.log('PUT HELPFUL:', markAnswerHelpful)
    expect(findAnswer).toBeDefined();
    expect(updatedAnswer).toBeDefined();
    expect(findAnswer[0].id).toEqual(updatedAnswer[0].id);
  })
  it('Increments the helpful value by 1', async () => {
    let findAnswer = await db.qandaCollection.find({"answers.id": answerID});
    let markAnswerHelpful = await putAnswerHelpful(answerID);
    let updatedAnswer = await db.qandaCollection.find({"answers.id": answerID});
    expect(updatedAnswer[0].answers[0].helpful - findAnswer[0].answers[0].helpful).toEqual(1);
  })
  // it('Throws an error for the incorrect query', async () => {
  //   let incorrectID = 123456789123456789;
  //   let markQuestionHelpful = await putQuestionHelpful(incorrectID)
  //   console.log('ERR:', markQuestionHelpful)
  //   expect(markQuestionHelpful.matchedCount).toEqual(0);
  // })

})