const mongoose = require('mongoose');

let qandaSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  product_id: {
    type: Number,
    unique: true,
    required: true
  },
  body: String,
  date_written: Date,
  asker_name: String,
  asker_email: String,
  reported: Number,
  helpful: Number,
  answers: [
    {
      id: {
        type: Number,
        unique: true,
        required: true
      },
      question_id: {
        type: Number,
        unique: true,
        required: true
      },
      body: String,
      date_written: Date,
      answerer_name: String,
      answerer_email: String,
      reported: Number,
      helpful: Number,
      photos: [
        {
          id: {
            type: Number,
            unique: true,
            required: true
          },
          answer_id: {
            type: Number,
            unique: true,
            required: true
          },
          url: String
        }
      ]
    }
  ]
},
{ collection: 'qandas' })

let allQandAs = mongoose.model('qandas', qandaSchema);

let testSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  product_id: {
    type: Number,
    unique: true,
    required: true
  },
  body: String,
  date_written: Date,
  asker_name: String,
  asker_email: String,
  reported: Number,
  helpful: Number,
  answers: [
    {
      id: {
        type: Number,
        unique: true,
        required: true
      },
      question_id: {
        type: Number,
        unique: true,
        required: true
      },
      body: String,
      date_written: Date,
      answerer_name: String,
      answerer_email: String,
      reported: Number,
      helpful: Number,
      photos: [
        {
          id: {
            type: Number,
            unique: true,
            required: true
          },
          answer_id: {
            type: Number,
            unique: true,
            required: true
          },
          url: String
        }
      ]
    }
  ]
},
{ collection: 'tests' })

let testCollection = mongoose.model('tests', testSchema);
// testCollection.create({
//   id: 7,
//   product_id: 107,
//   body: "well this is a new question!"
// })
// .then(results => { console.log(results)} ).catch(err => { console.log(err) })

// testCollection.updateOne({product_id: 107}, { $addToSet: { answers: {
//   id: 123,
//   question_id: 321,
//   body: "well here is an answer!"
// }
// }}).exec().then(results => { console.log(results)} ).catch(err => { console.log(err) })

// testCollection.updateOne({product_id: 107}, { $addToSet: { "answers.0.photos": {
//   id: 456,
//   answer_id: 654,
//   url: 'it even stringifies numbers!'
// }
// }}).exec().then(results => { console.log(results)} ).catch(err => { console.log(err) })

// IS VALIDATION WORKING FOR UPDATE?


module.exports = {
  qandaCollection: allQandAs
}

