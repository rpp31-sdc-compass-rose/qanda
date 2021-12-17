const mongoose = require('mongoose');


module.exports = {
  qandaCollection: mongoose.connection.collection('qandas')
}