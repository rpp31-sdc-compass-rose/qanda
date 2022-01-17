const db = require('../models/qandas.js');
const services = require('../db/services.js');
// const db = require('../db/index.js');
const Redis = require('redis');

const redisClient = Redis.createClient({url: 'redis://127.0.0.1:6379' });
redisClient.connect();

let defaultExpiration = 600;


module.exports = {

  // List Questions
  getQuestions: async (req, res) => {
    // console.log('REQ QUERY IN GET QUESTIONS:', req.query);
    let productID = req.query.product_id;
    try {
      let checkCache = await redisClient.get(`${productID}`)
      if (checkCache) {
        console.log(JSON.parse(checkCache))
        res.status(200).send(JSON.parse(checkCache));
      } else {
        let dbQuestions = await services.getAllQuestions(productID, req.query.page, req.query.count);
        redisClient.set(`${productID}`, JSON.stringify(dbQuestions))
        res.status(200).send(dbQuestions)
      }
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  },

  // List Answers
  getAnswers: (req, res) => {
    // console.log('REQ PARAMS IN GET ANSWERS:', req.params.question_id)
    // console.log('REQ QUERY IN GET ANSWERS:', req.query)
    let questionID = req.params.question_id;
    services.getAllAnswers(questionID, req.query.page, req.query.count)
    .then(result => {
      // console.log(result)
      res.status(200).send(result)
    })
    .catch(err => {
      // console.log(err)
      res.status(500).send(err)
    })

  },

  // Add a Question
  postQuestion: (req, res) => {
    // console.log('POST QUESTION REQ BODY:', req.body);
    services.postOneQuestion(req.body.product_id, req.body.body, req.body.name, req.body.email)
    .then(result => {
      // console.log(result)
      res.status(201).send(`Question ${result.id} posted!`)
    })
    .catch(err => {
      // console.log(err)
      res.status(500).send(err)
    })
  },

  // Add an Answer
  postAnswer: (req, res) => {
    // console.log('POST ANSWER REQ PARAMS:', req.params)
    // console.log('POST ANSWER REQ BODY:', req.body);
    let questionID = req.params.question_id;
    services.postOneAnswer(questionID, req.body.body, req.body.name, req.body.email)
    .then(result => {
      // console.log(result)
      res.status(201).send(`Answer ${result.id} posted!`)
    })
    .catch(err => {
      // console.log(err)
      res.status(500).send(err)
    })
  },

  // Mark question as helpful
  helpfulQuestion: (req, res) => {
    // console.log('REQ PARAMS IN HELPFUL QUESTION:', req.params);
    let questionID = req.params.question_id;
    services.putQuestionHelpful(questionID)
    .then(results => {
      // console.log(results);
      res.status(200).send(`Question ${questionID} marked as helpful!`);
    })
    .catch(err => {
      // console.log(err);
      res.status(500).send(err);
    })
  },

  // Report a question
  reportQuestion: (req, res) => {
    // console.log('REQ PARAMS IN REPORT QUESTION:', req.params);
    let questionID = req.params.question_id;
    services.putQuestionReported(questionID)
    .then(results => {
      // console.log(results);
      res.status(200).send(`Question ${questionID} reported!`);
    })
    .catch(err => {
      // console.log(err);
      res.status(500).send(err);
    })
  },

  // Mark answer as helpful
  helpfulAnswer: (req, res) => {
    // console.log('REQ PARAMS IN HELPFUL ANSWER:', req.params);
    let answerID = req.params.answer_id;
    services.putAnswerHelpful(answerID)
    .then(results => {
      // console.log(results);
      res.status(200).send(`Answer ${answerID} marked as helpful!`)
    })
    .catch(err => {
      // console.log(err);
      res.status(500).send(err);
    })
  },

  // Report an answer
  reportAnswer: (req, res) => {
    // console.log('REQ PARAMS IN REPORT ANSWER:', req.params);
    let answerID = req.params.answer_id;
    services.putAnswerReported(answerID)
    .then(results => {
      // console.log(results);
      res.status(200).send(`Answer ${answerID} reported!`);
    })
    .catch(err => {
      // console.log(err);
      res.status(500).send(err);
    })
  }

}


// getQuestions: async (req, res) => {
//   // console.log('REQ QUERY IN GET QUESTIONS:', req.query);
//   let productID = req.query.product_id;
//   services.getAllQuestions(productID, req.query.page, req.query.count)
//   .then(result => {
//     // console.log(result)
//     res.status(200).send(result)
//   })
//   .catch(err => {
//     // console.log(err)
//     res.status(500).send(err);
//   })

// },