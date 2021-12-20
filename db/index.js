const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/qanda')
  .then(() => {
    console.log('Mongoose connected to Q&A!');
  })
  .catch(error => {
    console.log('Database Error:', error);
  });