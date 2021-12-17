const mongoose = require('mongoose');


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
// },
// { collection: 'qandas'});

module.exports = {
  qandaCollection: mongoose.connection.collection('qandas')
}