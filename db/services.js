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
      console.log(err);
    })
  }
}