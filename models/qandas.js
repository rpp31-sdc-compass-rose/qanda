const mongoose = require('mongoose');

let qandaSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  product_id: {
    type: Number,
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
        required: true
      },
      question_id: {
        type: Number,
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
            required: true
          },
          answer_id: {
            type: Number,
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

module.exports = {
  qandaCollection: allQandAs
}
