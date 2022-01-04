const mongoose = require('mongoose');

module.exports = {
  connect: async () => {
    await mongoose.connect('mongodb://localhost:27017/tests')
    .then(() => {
      console.log('Mongoose connected to Test Database');
    })
    .catch(error => {
      console.log('Database Error:', error);
    });
  },

  disconnect: async () => {
    await mongoose.connection.close();
  }
}