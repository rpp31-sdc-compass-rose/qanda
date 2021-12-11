const express = require('express');
const app = express();
const port = 3030;
const db = require('../db/index.js');

app.get('/', function (req, res) {
  res.send('Hello World')
});

app.listen(port, () => {
  console.log(`API is listening on port ${port}!`)
});