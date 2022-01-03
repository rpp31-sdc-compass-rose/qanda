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
    services.getAllAnswers(questionID, req.query.page, req.query.count)
    .then(result => {
      console.log(result)
      res.status(200).send(result)
    })
    .catch(err => {
      console.log(err)
      res.status(500).send(err)
    })

  },

  // Add a Question
  postQuestion: (req, res) => {
    console.log('POST QUESTION REQ BODY:', req.body);
    services.postOneQuestion(req.body.product_id, req.body.body, req.body.name, req.body.email)
    .then(result => {
      console.log(result)
      res.status(201).send(result)
    })
    .catch(err => {
      console.log(err)
      res.status(500).send(err)
    })
  },
  // Add an Answer
  postAnswer: (req, res) => {
    console.log('POST ANSWER REQ PARAMS:', req.params)
    console.log('POST ANSWER REQ BODY:', req.body);
    let questionID = req.params.question_id;
    services.postOneAnswer(questionID, req.body.body, req.body.name, req.body.email)
    .then(result => {
      console.log(result)
      res.status(200).send(result)
    })
    .catch(err => {
      console.log(err)
      res.status(500).send(err)
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