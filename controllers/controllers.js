const db = require('../models/qandas.js');
const services = require('../db/services.js');
// const db = require('../db/index.js');


module.exports = {
  // List Questions
  getQuestions: (req, res) => {
    console.log('REQ QUERY IN GET QUESTIONS:', req.query);
    let productID = req.query.product_id;
    services.getAllQuestions(productID)
    .then(result => {
      console.log(result)
      res.status(200).send(result)
    })
    .catch(err => {
      console.log(err)
      res.status(500).send(err);
    })

  },

  // List Answers
  getAnswers: (req, res) => {
    console.log('REQ PARAMS IN GET ANSWERS:', req.params.question_id)
    console.log('REQ QUERY IN GET ANSWERS:', req.query)
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
        "page": req.query.page,
        "count": req.query.count,
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
    console.log('POST QUESTION REQ BODY:', req.body);
    let latestQuestionID;
    db.qandaCollection.find().sort({id: -1}).limit(1)
      .then(result => {
        console.log(result[0].id)
        latestQuestionID = result[0].id + 1;
        db.qandaCollection.create({
          id: latestQuestionID,
          product_id: req.body.product_id,
          body: req.body.body,
          date_written: new Date(),
          asker_name: req.body.name,
          asker_email: req.body.email,
          reported: 0,
          helpful: 0,
          answers: []
        })
        .then(results => {
          console.log(results)
          res.status(201).send(`Question ${latestQuestionID} posted!`);
        })
        .catch(err => {
           console.log(err)
           res.status(500).send(err);
          })
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      })
  },
  // Add an Answer
  postAnswer: (req, res) => {
    console.log('POST ANSWER REQ PARAMS:', req.params)
    console.log('POST ANSWER REQ BODY:', req.body);
    let questionID = req.params.question_id;
    let latestAnswerID;
    db.qandaCollection.find().sort({"answers.id": -1}).limit(1)
      .then(result => {
        console.log(result);
        latestAnswerID = result[0].answers[result[0].answers.length - 1].id + 1;
        console.log('LATEST ANSWER:', latestAnswerID);
        db.qandaCollection.updateOne({id: questionID}, { $addToSet: { answers: {
          id: latestAnswerID,
          question_id: questionID,
          body: req.body.body,
          date_written: new Date(),
          answerer_name: req.body.name,
          answerer_email: req.body.email,
          reported: 0,
          helpful: 0,
          photos: []
        }
        }})
        .exec()
        .then(results => {
          console.log(results);
          res.status(201).send(`Answer ${latestAnswerID} posted!`)
        }).catch(err => {
          console.log(err);
          res.status(500).send(err);
        })
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      })
  },

  // Mark question as helpful
  helpfulQuestion: (req, res) => {
    console.log('REQ PARAMS IN HELPFUL QUESTION:', req.params);
    let questionID = req.params.question_id;
    db.qandaCollection.updateOne({id: questionID},
      { $inc:
        { helpful: 1 }
      })
      .exec()
      .then(results => {
         console.log(results);
         res.status(204).send(`Question ${questionID} marked as helpful!`)
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      })
  },

  // Report a question
  reportQuestion: (req, res) => {
    console.log('REQ PARAMS IN REPORT QUESTION:', req.params);
    let questionID = req.params.question_id;
    db.qandaCollection.updateOne({id: questionID},
    { $inc:
      { reported: 1 }
    })
    .exec()
    .then(results => {
      console.log(results);
      res.status(204).send(`Question ${questionID} reported!`);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    })
  },

  // Mark answer as helpful
  helpfulAnswer: (req, res) => {
    console.log('REQ PARAMS IN HELPFUL ANSWER:', req.params);
    let answerID = req.params.answer_id;
    db.qandaCollection.updateOne(
    {
      "answers.id": answerID,
      answers: { $elemMatch: {
        id: answerID
      }}
    },
    { $inc:
      { "answers.$.helpful": 1
      }
    })
    .exec()
    .then(results => {
      console.log(results)
      res.status(204).send(`Answer ${answerID} marked as helpful!`);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send(err);
    })
  },

  // Report an answers
  reportAnswer: (req, res) => {
    console.log('REQ PARAMS IN REPORT ANSWER:', req.params);
    let answerID = req.params.answer_id;
    db.qandaCollection.updateOne(
    {
      "answers.id": answerID,
      answers: { $elemMatch: {
        id: answerID
      }}
    },
    { $inc:
      { "answers.$.reported": 1
      }
    })
    .exec()
    .then(results => {
      console.log(results);
      res.status(204).send(`Answer ${answerID} reported!`);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    })
  }

}