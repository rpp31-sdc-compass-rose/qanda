// import app module
const app = require('./app.js');
// define port for API server
const port = 3030;

// Run server on port
app.listen(port, () => {
  console.log(`API is listening on port ${port}!`)
});

