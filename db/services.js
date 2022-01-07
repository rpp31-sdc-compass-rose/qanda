const db = require('../models/qandas.js');


module.exports = {
  getAllQuestions: (productID) => {
    return db.qandaCollection.find({product_id: productID})
    .then(result => {
      // console.log('LIST QUESTIONS RESULTS:', result)
        // let unixTime = result.date_written.toString().slice(0, -3);
        // let convertedDate = new Date(Number(unixTime) * 1000);
        let mappedResult = {
          "product_id": result[0].product_id.toString(),
          "results": []
        }
        for (let i = 0; i < result.length; i++) {
          let reducedAnswers = result[i].answers.reduce((acc, answer) => {
            let stringId = answer.id;
            // let unixTime = answer.date_written.toString().slice(0, -3);
            // let convertedDate = new Date(Number(unixTime) * 1000);
            return { ...acc,
              [stringId]: {
                "id": answer.id,
                "body": answer.body,
                "date": answer.date_written,
                "answerer_name": answer.answerer_name,
                "helpfulness": answer.helpful,
                "photos": answer.photos.map(item => {
                  return item.url;
                })
              }
            }
          }, {});
          let resultsObjects = {
            "question_id": result[i].id,
            "question_body": result[i].body,
            "question_date": result[i].date_written,
            "asker_name": result[i].asker_name,
            "question_helpfulness": result[i].helpful,
            "reported": result[i].reported === 0 ? false : true,
            "answers": reducedAnswers
            }
          mappedResult.results.push(resultsObjects);
          }
        // console.log('REDUCED ANSWERS:', reducedAnswers);
        return mappedResult;
      })
      .catch(err => {
      throw err;
    })
  },

  getAllAnswers: (questionID, page, count) => {
    return db.qandaCollection.find({"answers.question_id": questionID}, {"answers.id": 1, "answers.question_id": 1, "answers.body": 1, "answers.date_written": 1, "answers.answerer_name": 1, "answers.helpful": 1, "answers.photos": 1}).exec()
    .then(results => {
      // console.log('GET ANSWERS RESULT:', results);
      let mappedAnswers = results[0].answers.map(answer => {
        return {
          "answer_id": answer.id,
          "body": answer.body,
          "date": answer.date_written,
          "answerer_name": answer.answerer_name,
          "helpfulness": answer.helpful,
          "photos": answer.photos.map(item => {
            return { "id": item.id, "url": item.url }
          })
        }
      })
      let mappedResult = {
        "question": results[0].answers[0].question_id,
        "page": page,
        "count": count,
        "results": mappedAnswers
      }
      return mappedResult;
    })
    .catch(err => {
      throw err;
    })
  },

  postOneQuestion: (productID, body, name, email) => {
    let latestQuestionID;
    // .sort({id: -1}).limit(1)
    // estimatedDocumentCount()
    return db.qandaCollection.find().sort({id: -1}).limit(1)
      .then(result => {
        // console.log('COUNT:', result)
        currentCount = result[0].id;
        latestQuestionID = currentCount + 1;
        return db.qandaCollection.create({
          id: latestQuestionID,
          product_id: productID,
          body: body,
          date_written: new Date(),
          asker_name: name,
          asker_email: email,
          reported: 0,
          helpful: 0,
          answers: []
        })
        .then(results => {
          return results;
        })
        .catch(err => {
          throw err;
        })
      })
      .catch(err => {
        throw err;
      })
  },

  postOneAnswer: (questionID, body, name, email) => {
    let latestAnswerID;
    let postedAnswer;
    return db.qandaCollection.find().sort({"answers.id": -1}).limit(1)
      .then(result => {
        // console.log(result);
        latestAnswerID = result[0].answers[result[0].answers.length - 1].id + 1;
        // console.log('LATEST ANSWER:', latestAnswerID);
        return db.qandaCollection.updateOne({id: questionID}, { $addToSet: { answers: {
          id: latestAnswerID,
          question_id: questionID,
          body: body,
          date_written: new Date(),
          answerer_name: name,
          answerer_email: email,
          reported: 0,
          helpful: 0,
          photos: []
        }
        }})
        .exec()
        .then(result => {
          result.id = latestAnswerID
          return result;
        }).catch(err => {
          throw err;
        })
      })
      .catch(err => {
        throw err;
      })
  },

  putQuestionHelpful: (questionID) => {
    return db.qandaCollection.updateOne({id: questionID},
      { $inc:
        { helpful: 1 }
      })
      .exec()
      .then(results => {
        return results;
      })
      .catch(err => {
        throw err;
      })
  },

  putQuestionReported: (questionID) => {
    return db.qandaCollection.updateOne({id: questionID},
      { $inc:
        { reported: 1 }
      })
      .exec()
      .then(results => {
        return results;
      })
      .catch(err => {
        throw err;
      })
  },

  putAnswerHelpful: (answerID) => {
    return db.qandaCollection.updateOne(
      {
        "answers.id": answerID,
        answers: { $elemMatch: {
          id: answerID
        }}
      },
      { $inc:
        { "answers.$.helpful": 1
        }
      })
      .exec()
      .then(results => {
        console.log(results)
        return results;
      })
      .catch(err => {
        throw err;
      })
  },

  putAnswerReported: (answerID) => {
    return db.qandaCollection.updateOne(
      {
        "answers.id": answerID,
        answers: { $elemMatch: {
          id: answerID
        }}
      },
      { $inc:
        { "answers.$.reported": 1
        }
      })
      .exec()
      .then(results => {
        return results;
      })
      .catch(err => {
        throw err;
      })
  }

}