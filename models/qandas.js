const mongoose = require('mongoose');

let qandaSchema = new mongoose.Schema({
  id: {
    type: Number,
    index: true,
    unique: true,
    required: true
  },
  product_id: {
    type: Number,
    index: true,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date_written: Date,
  asker_name: {
    type: String,
    required: true
  },
  asker_email: {
    type: String,
    required: true
  },
  reported: Number,
  helpful: Number,
  answers: [
    {
      id: {
        type: Number,
        index: true,
        unique: true,
        sparse: true,
        required: true
      },
      question_id: {
        type: Number,
        index: true,
        required: true
      },
      body: {
        type: String,
        required: true
      },
      date_written: Date,
      answerer_name: {
        type: String,
        required: true
      },
      answerer_email: {
        type: String,
        required: true
      },
      reported: Number,
      helpful: Number,
      photos: [
        {
          id: {
            type: Number,
            index: true,
            unique: true,
            sparse: true,
            required: true
          },
          answer_id: {
            type: Number,
            index: true,
            required: true
          },
          url: String
        }
      ]
    }
  ]
},
{ collection: 'qandas' })

qandaSchema.index({id: -1});
qandaSchema.index({"answers.id": -1});

console.log('NODE ENVIRONMENT VARIABLE:', process.env.NODE_ENV);

let allQandAs;
// PRODUCTION MODEL
if (process.env.NODE_ENV === 'development') {
  allQandAs = mongoose.model('qandas', qandaSchema);
}
if (process.env.NODE_ENV === 'test') {
  allQandAs = mongoose.model('tests', qandaSchema);
}

// CREATE A NEW QUESTION
// testCollection.create({
//   id: 5,
//   product_id: 55,
//   body: "Here's a new question!",
//   date_written: new Date(),
//   asker_name: 'Cool3000',
//   asker_email: 'cool3000@gmail.com',
//   reported: 0,
//   helpful: 0,
//   answers: []
// })
// .then(results => { console.log(results)} ).catch(err => { console.log(err) })

// ADD AN ANSWER TO A QUESTION
// testCollection.updateOne({id: 5}, { $addToSet: { answers: {
//   id: 7,
//   question_id: 5,
//   body: "Here is an answer!",
//   date_written: new Date(),
//   answerer_name: '',
//   answerer_email: 'answerGuy@gmail.com',
//   reported: 0,
//   helpful: 0,
//   photos: []
// }
// }}).exec().then(results => { console.log(results)} ).catch(err => { console.log(err) })

// ADD A PHOTO TO AN ANSWER
// testCollection.updateOne({"answers.id": 545}, { $addToSet: { "answers.0.photos": {
//   id: 142,
//   answer_id: 545,
//   url: 'it even stringifies numbers 1231243!'
// }
// }}).exec().then(results => { console.log(results)} ).catch(err => { console.log(err) })


// MAKING QUESTIONS REPORTED
// testCollection.updateOne({id: 5},
//   { $inc:
//     { reported: 1
//     }
//   }).exec().then(results => { console.log(results)} ).catch(err => { console.log(err) })


// MAKE A QUESTION HELPFUL
// testCollection.updateOne({id: 5},
//   { $inc:
//     { helpful: 1
//     }
//   }).exec().then(results => { console.log(results)} ).catch(err => { console.log(err) })

// MAKING ANSWERS REPORTED
// testCollection.updateOne(
//   {
//     "answers.id": 6,
//     answers: { $elemMatch: {
//       id: 5
//     }}
//   },
//   { $inc:
//     { "answers.$.reported": 1
//     }
//   }).exec().then(results => { console.log(results)} ).catch(err => { console.log(err) })

  // MAKING ANSWERS HELPFUL
  // testCollection.updateOne(
  //   {
  //     "answers.id": 7,
  //     answers: { $elemMatch: {
  //       id: 7
  //     }}
  //   },
  //   { $inc:
  //     { "answers.$.helpful": 1
  //     }
  //   }).exec().then(results => { console.log(results)} ).catch(err => { console.log(err) })



// IS VALIDATION WORKING FOR UPDATE?


module.exports = {
  qandaCollection: allQandAs
  // testCollection: testQandAs
}

