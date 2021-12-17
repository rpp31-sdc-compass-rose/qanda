const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/qanda')
  .then(() => {
    console.log('Mongoose connected to Q&A!');
  })
  .catch(error => {
    console.log('Database Error:', error);
  });

  // let qandaSchema = new mongoose.Schema({
  //   product_id: Number,
  //   results: [
  //     {
  //     question_id: Number,
  //     question_body: String,
  //     question_date: Date,
  //     asker_name: String,
  //     question_helpfulness: Number,
  //     reported: String,
  //     helpful: String,
  //     answers: [
  //       {
  //         id: Number,
  //         body: String,
  //         date: Date,
  //         answerer_name: String,
  //         helpfulness: Number,
  //         reported: Number,
  //         photos: [String]
  //       }
  //     ]
  //   }
  // ]
  // });

  // let QandA = mongoose.model('Test', qandaSchema);
  // let allQandA = mongoose.model('qandas', qandaSchema);

  let func2 = (dataFromDB) => {
    console.log('REPO DATA:', dataFromDB);
    Promise.all(dataFromDB)
    .then(data => {
      let mappedData = data.map(doc => {
        console.log(doc);
      })
    })
  }

  let func = () => {

    // let connection = mongoose.connection;

    // connection.on('error', console.error.bind(console, 'connection error:'));
    // connection.once('open', () => {
    //   connection.db.collection('answersandphotos', (err, collection) => {
    //     collection.find().limit(50).toArray((err, data) => {
    //       console.log('DATA:', data);
    //     })
    //   })
    // })

    return new Promise((resolve, reject) => {
      allQandA.find().sort({id: 1}).limit(10).exec((err, results) => {
        if (err) {
          reject(err);
        } else {
          // console.log(results);
          resolve(results);
        }
      })
    })

  }
  // func().then(results => {
  //   console.log('RESULTS:', results);
  //   let mappedOptions = results.map(doc => {
  //     let testSchema = new QandA({

  //   product_id: doc.product_id,
  //   results: []
  //     })
  //   for (let i = 0; i < doc.answers)
  //   })
  // })
  // .catch(err => {
  //   console.log(err);
  // })





  // let testData = new QandA({
  //   product_id: 59553,
  //   results: [{
  //     "question_id": 553673,
  //     "question_body": "Where is this made from?",
  //     "question_date": "2021-11-16T00:00:00.000Z",
  //     "asker_name": "cool",
  //     "question_helpfulness": 12,
  //     "reported": '0',
  //     "answers": [
  //         {
  //             "answer_id": 5181430,
  //             "answer_body": "I think they recently switched the factory to Sri Lanka",
  //             "answer_date": "2021-11-20T00:00:00.000Z",
  //             "answerer_name": "chai",
  //             "answer_helpfulness": 4,
  //             "reported": false,
  //             "photos": []
  //         },
  //         {
  //             "answer_id": 5181552,
  //             "answer_body": "test",
  //             "answer_date": "2021-12-04T00:00:00.000Z",
  //             "answerer_name": "test",
  //             "answer_helpfulness": 0,
  //             "reported": false,
  //             "photos": [
  //                 "https://res.cloudinary.com/dtr701wqi/image/upload/v1638646834/cloudinary/frsrnnsy0oflzvbkgrev.jpg"
  //             ]
  //         },
  //         {
  //             "answer_id": 5181555,
  //             "answer_body": "hello",
  //             "answer_date": "2021-12-04T00:00:00.000Z",
  //             "answerer_name": "aa",
  //             "answer_helpfulness": 0,
  //             "reported": false,
  //             "photos": [
  //                 "http://res.cloudinary.com/dpwwavsdm/image/upload/v1638648407/flow_mkwffr.png"
  //             ]
  //         },
  //         {
  //             "answer_id": 5181557,
  //             "answer_body": "wohoo rpp31!",
  //             "answer_date": "2021-12-04T00:00:00.000Z",
  //             "answerer_name": "test",
  //             "answer_helpfulness": 0,
  //             "reported": false,
  //             "photos": [
  //                 "https://res.cloudinary.com/mustard55/image/upload/v1638650210/mustard/qmuqblcymhtskmjakk8p.jpg"
  //             ]
  //         },
  //         {
  //             "answer_id": 5181559,
  //             "answer_body": "asdf",
  //             "answer_date": "2021-12-10T00:00:00.000Z",
  //             "answerer_name": "asdf",
  //             "answer_helpfulness": 0,
  //             "reported": false,
  //             "photos": []
  //         }
  //       ]
  //   }]
  // })

  // testData.save();