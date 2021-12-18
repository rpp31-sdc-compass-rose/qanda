const qandas = require('../models/qandas.js');
// const db = require('../db/index.js');

module.exports = {
  // List Questions
  getQuestions: (req, res) => {
    console.log('REQ QUERY IN GET QUESTIONS:', req.query.product_id)
    qandas.qandaCollection.findOne({product_id: 59553})
    .then(result => {
      // console.log('LIST QUESTIONS RESULTS:', result)
        // let unixTime = result.date_written.toString().slice(0, -3);
        // let convertedDate = new Date(Number(unixTime) * 1000);
        let reducedAnswers = result.answers.reduce((acc, answer) => {
          let stringId = answer.id;
          // let unixTime = answer.date_written.toString().slice(0, -3);
          // let convertedDate = new Date(Number(unixTime) * 1000);
          return { ...acc,
            [stringId]: {
              "id": answer.id,
              "body": answer.body,
              "date": answer.date_written,
              "answerer_name": answer.answerer_name,
              "helpfulness": answer.helpful,
              "photos": answer.photos.map(item => {
                return item.url;
              })
            }
          }
        }, {});
        // console.log('REDUCED ANSWERS:', reducedAnswers);
        let mappedResult = {
          "product_id": result.product_id.toString(),
          "results": [
            {
              "question_id": result.id,
              "question_body": result.body,
              "question_date": result.date_written,
              "asker_name": result.asker_name,
              "question_helpfulness": result.helpful,
              "reported": result.reported === 0 ? false : true,
              "answers": reducedAnswers
            }
          ]
        }
      res.status(200).send(mappedResult);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    })
  },

  // List Answers
  getAnswers: (req, res) => {
    console.log('REQ QUERY IN GET ANSWERS:', req.query.question_id)
    qandas.qandaCollection.find({"answers.question_id": 1}, {"answers.id": 1, "answers.question_id": 1, "answers.body": 1, "answers.date_written": 1, "answers.answerer_name": 1, "answers.helpful": 1, "answers.photos": 1}).exec()
    .then(results => {
      console.log('GET ANSWERS RESULT:', results);
      let mappedAnswers = results[0].answers.map(answer => {
        return {
          "answer_id": answer.id,
          "body": answer.body,
          "date": answer.date_written,
          "answerer_name": answer.answerer_name,
          "helpfulness": answer.helpful,
          "photos": answer.photos.map(item => {
            return { "id": item.id, "url": item.url }
          })
        }
      })
      let mappedResult = {
        "question": results[0].answers[0].question_id,
        "page": null,
        "count": null,
        "results": mappedAnswers
      }
      res.status(200).send(mappedResult);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    })

  },

  // Add a Question
  postQuestion: (req, res) => {
    console.log('REQ BODY:', req.body);
    res.status(201).send('Question posted!')
  }
}