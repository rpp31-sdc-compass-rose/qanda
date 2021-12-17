module.exports = {
  // List Questions
  getQuestions: (req, res) => {
    res.status(200).send('Here are questions!');
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