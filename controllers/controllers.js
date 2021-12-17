const qandas = require('../models/qandas.js');

module.exports = {
  // List Questions
  getQuestions: (req, res) => {
    qandas.qandaCollection.findOne()
    .then(result => {
      console.log('RESULTS FROM DB:', result)
      // let mappedResult = result.map(doc => {
        let unixTime = result.date_written.toString().slice(0, -3);
        let convertedDate = new Date(Number(unixTime) * 1000);
        let reducedAnswers = result.answers.reduce((acc, answer) => {
          let stringId = answer.id;
          let unixTime = answer.date_written.toString().slice(0, -3);
          let convertedDate = new Date(Number(unixTime) * 1000);
          return { ...acc,
            [stringId]: {
              "id": answer.id,
              "body": answer.body,
              "date": convertedDate,
              "answerer_name": answer.answerer_name,
              "helpfulness": answer.helpful,
              "photos": answer.photos
            }
          }
        }, {});
        console.log('REDUCED ANSWERS:', reducedAnswers);
        let mappedResult = {
          "product_id": result.product_id.toString(),
          "results": [
            {
              "question_id": result.id,
              "question_body": result.body,
              "question_date": convertedDate,
              "asker_name": result.asker_name,
              "question_helpfulness": result.helpful,
              "reported": result.reported === 0 ? false : true,
              "answers": reducedAnswers
            }
          ]
        }
      // })
      res.status(200).send(mappedResult);
    })
    .catch(err => {
      console.log(err);
    })
  },
  // List Answers
  getAnswers: (req, res) => {
    res.status(200).send('Here are answers!')
  },
  // Add a Question
  postQuestion: (req, res) => {
    console.log('REQ BODY:', req.body);
    res.status(201).send('Question posted!')
  }
}