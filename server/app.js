const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const db = require('../db/index.js');
// const etl = require('../csv/etl.js');
const controllers = require('../controllers/controllers.js');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser());

// routes
app.get('/', (req, res) => {
  res.status(200).send('Welcome to Atelier API!');
})
// get all questions by product_id
app.get('/qa/questions/', controllers.getQuestions);

// get all answers by question_id
app.get('/qa/questions/:question_id/answers', controllers.getAnswers);

// post a question
app.post('/qa/questions', controllers.postQuestion);

//post an answer
app.post('/qa/questions/:question_id/answers', controllers.postAnswer);

// mark question as helpful
app.put('/qa/questions/:question_id/helpful', controllers.helpfulQuestion);

// report a question
app.put('/qa/questions/:question_id/report', controllers.reportQuestion);

// mark answer as helpful
app.put('/qa/answers/:answer_id/helpful', controllers.helpfulAnswer);

// report an answer
app.put('/qa/answers/:answer_id/report', controllers.reportAnswer);

module.exports = app;