const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/qanda')
  .then(() => {
    console.log('Mongoose connected to Q&A!');
  })
  .catch(error => {
    console.log('Database Error:', error);
  });


  // let func = () => {
  //   return new Promise((resolve, reject) => {
  //     allQandA.find().sort({id: 1}).limit(10).exec((err, results) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         // console.log(results);
  //         resolve(results);
  //       }
  //     })
  //   })
  // }