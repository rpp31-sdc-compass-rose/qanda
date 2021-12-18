const mongodb = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const csvtojson = require('csvtojson');
// const qandaSchema = require('../db/index.js');

// setup file paths to be read and transformed
let questionsFilePath = './csv/questions.csv';
let answersFilePath = './csv/answers.csv';
let answersPhotosFilePath = './csv/answers_photos.csv';

// convert csv to json
// csvtojson()
//   .fromFile(questionsFilePath)
//   .then(csvData => {
//     // converted data here
//     console.log('QUESTIONS CSV DATA:', csvData);

//     // connect to Q&A database and load
//     mongodb.connect('mongodb://localhost:27017',
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     (err, client) => {
//       if (err) {
//         throw err;
//       }
//       client
//         .db('qanda')
//         .collection('questions')
//         .insertMany(csvData, (err, res) => {
//           if (err) {
//             throw err;
//           }
//           console.log(`Inserted: ${res.insertedCount} rows`);
//             client.close();
//         })
//     })
//   });

  // csvtojson()
  // .fromFile(answersFilePath)
  // .then(csvData => {
  //   // converted data here
  //   console.log('ANSWERS CSV DATA:', csvData);

  //   // connect to Q&A database and load
  //   mongodb.connect('mongodb://localhost:27017',
  //   { useNewUrlParser: true, useUnifiedTopology: true },
  //   (err, client) => {
  //     if (err) {
  //       throw err;
  //     }
  //     client
  //       .db('qanda')
  //       .collection('answers')
  //       .insertMany(csvData, (err, res) => {
  //         if (err) {
  //           throw err;
  //         }
  //         console.log(`Inserted: ${res.insertedCount} rows`);
  //           client.close();
  //       })
  //   })
  // });

  // csvtojson()
  // .fromFile(answersPhotosFilePath)
  // .then(csvData => {
  //   // converted data here
  //   console.log('ANSWERS_PHOTOS CSV DATA:', csvData);

  //   // connect to Q&A database and load
  //   mongodb.connect('mongodb://localhost:27017',
  //   { useNewUrlParser: true, useUnifiedTopology: true },
  //   (err, client) => {
  //     if (err) {
  //       throw err;
  //     }
  //     client
  //       .db('qanda')
  //       .collection('answers_photos')
  //       .insertMany(csvData, (err, res) => {
  //         if (err) {
  //           throw err;
  //         }
  //         console.log(`Inserted: ${res.insertedCount} rows`);
  //           client.close();
  //       })
  //   })
  // });