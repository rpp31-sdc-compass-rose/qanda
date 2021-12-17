const express = require('express');
const app = express();
const port = 3030;
const db = require('../db/index.js');
const etl = require('../csv/etl.js');
const controllers = require('../controllers/controllers.js');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get('/', (req, res) => {
  res.status(200).send('Welcome to Atelier API!');
})
// get all questions by product_id
app.get('/questions', controllers.getQuestions);

// get all answers by question_id
app.get('/answers', controllers.getAnswers);

// get all answers by question_id
app.post('/questions', controllers.postQuestion);

app.listen(port, () => {
  console.log(`API is listening on port ${port}!`)
});