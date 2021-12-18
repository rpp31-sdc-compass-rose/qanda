const mongoose = require('mongoose');

let qandaSchema = new mongoose.Schema({
  id: Number,
  product_id: Number,
  body: String,
  date_written: Date,
  asker_name: String,
  asker_email: String,
  reported: Number,
  helpful: Number,
  answers: [
    {
      id: Number,
      question_id: Number,
      body: String,
      date_written: Date,
      answerer_name: String,
      answerer_email: String,
      reported: Number,
      helpful: Number,
      photos: [
        {
          id: Number,
          answer_id: Number,
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
