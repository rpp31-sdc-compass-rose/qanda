const db = require('../models/qandas.js');
// const db = require('../db/index.js');

module.exports = {
  // List Questions
  getQuestions: (req, res) => {
    console.log('REQ QUERY IN GET QUESTIONS:', req.query.product_id);
    let productID = req.query.product_id;
    db.qandaCollection.find({product_id: productID})
    .then(result => {
      // console.log('LIST QUESTIONS RESULTS:', result)
        // let unixTime = result.date_written.toString().slice(0, -3);
        // let convertedDate = new Date(Number(unixTime) * 1000);
        let mappedResult = {
          "product_id": result[0].product_id.toString(),
          "results": []
        }
        for (let i = 0; i < result.length; i++) {
          let reducedAnswers = result[i].answers.reduce((acc, answer) => {
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
          let resultsObjects = {
            "question_id": result[i].id,
            "question_body": result[i].body,
            "question_date": result[i].date_written,
            "asker_name": result[i].asker_name,
            "question_helpfulness": result[i].helpful,
            "reported": result[i].reported === 0 ? false : true,
            "answers": reducedAnswers
            }
          mappedResult.results.push(resultsObjects);
          }
        // console.log('REDUCED ANSWERS:', reducedAnswers);
        res.status(200).send(mappedResult);
      })
      .catch(err => {
      console.log(err);
      res.status(500).send(err);
    })
  },

  // List Answers
  getAnswers: (req, res) => {
    console.log('REQ PARAMS IN GET ANSWERS:', req.params.question_id)
    let questionID = req.params.question_id;
    db.qandaCollection.find({"answers.question_id": questionID}, {"answers.id": 1, "answers.question_id": 1, "answers.body": 1, "answers.date_written": 1, "answers.answerer_name": 1, "answers.helpful": 1, "answers.photos": 1}).exec()
    .then(results => {
      // console.log('GET ANSWERS RESULT:', results);
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
    let latestQuestionID;
    db.qandaCollection.find().sort({id: -1}).limit(1)
      .then(result => {
        console.log(result[0].id)
        latestQuestionID = result[0].id;
        db.qandaCollection.create({
          id: latestQuestionID + 1,
          product_id: 0000000000,
          body: "Here's a new question!",
          date_written: new Date(),
          asker_name: 'Cool3000',
          asker_email: 'cool3000@gmail.com',
          reported: 0,
          helpful: 0,
          answers: []
        })
        .then(results => {
          console.log(results)
          res.status(201).send('Question posted!')
        })
        .catch(err => {
           console.log(err)
          })
      })
      .catch(err => {
        console.log(err);
      })


  }
}