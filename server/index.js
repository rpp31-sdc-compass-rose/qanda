const express = require('express');
const app = express();
const port = 3030;
const db = require('../db/index.js');
const etl = require('../csv/etl.js');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get('/', function (req, res) {
  res.send('Hello World')
});

app.listen(port, () => {
  console.log(`API is listening on port ${port}!`)
});