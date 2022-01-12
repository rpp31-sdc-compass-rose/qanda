const mongoose = require('mongoose');

let uri;
if (process.env.NODE_ENV === 'development') {
  uri = 'mongodb://localhost:27017/qandaservice';
}
if (process.env.NODE_ENV === 'production') {
  uri = 'productionURI';
}

mongoose.connect(uri)
  .then(() => {
    console.log('Mongoose connected to Q&A!');
  })
  .catch(error => {
    console.log('Database Error:', error);
  });