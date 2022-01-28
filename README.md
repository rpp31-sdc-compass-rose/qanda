
# 👋 Welcome to `Project Atelier's Q&A API Service`

🎉 ***Serving over 12 million product Q&A's at the speed of light!*** 🎉

**Problem**:
The legacy database and API which served all endpoints for Project Atelier was not as performant as it could be. The API service needed to resolve missing product IDs from the database, improve query performance, and handle production-level web traffic, which more fully supports the newly-updated front-end.

**Solution**:
The system design for this project began with a web-sequence-diagram to visually and technically represent each endpoint that would be needed to fully serve this Product Q&A service. All routes were accounted for with Node.js and Express with middleware. Database migration began with an ELT process, transferring CSV data from three separate files (each ranging from 3M to 7M lines). Three collections were consolidated into one using MongoDB's Database Tools (mongoimport for development, and mongodump/mongorestore for production) and aggregation pipeline; this allowed for faster read queries by searching top-level indexes, nesting entity relationships, and using MongoDB's recommended bucket pattern and pagination.

Server code is lean and modular, leveraging data types and separating concerns for request handlers, controllers, and database services. Environment variables are configurable for your deployment of choice, though a basic production setup is shown here for deployment on Amazon Web Services.

Optimizations are further made in production scaling out to five EC2 instances fetching from a deployed MongoDB. The five instances are load-balanced and via a Reverse Proxy Server with NGINX, and caching is performed on the NGINX layer as well to reduce the need to excessive server or database resources. Redis is installed locally on each instance as an additional caching layer if needed.

The above setup has defined numerous performance advantages which are detailed below!

## 📋 Features

- 8 routes on Node/Express server with options for GET, POST, and PUT
- Lean server code
- Separation of concerns between request handlers, controllers, models, and database services
- Plug and play availability for additional MongoDB clusters or RDBMS
- Middleware optimized for JSON data, keeping payloads compressed for fast fetching
- Database queries optimized across all 8 routes using filters, sorting, and range.
- New and updated Question and Answer IDs are returned to client for ease of tracking
- Use of Jest and Supertest for easier troubleshooting and 98% code coverage
- Built in test suite for K6 with New Relic configured for visual metrics


## 💾 Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/rpp31-sdc-compass-rose/qanda.git
   ```
2. Install NPM packages:
   ```sh
   npm install
    ```
4. Start the server:
   ```sh
   npm start
    ```
5. Open on localhost:3030
  -- or --
   on your preferred deployment service:
   ```sh
   npm run start:production
   ```

## ⚗️ Usage/Examples
A plethora of future-minded server implementations await:

* Server routes are organized and modular:
```javascript
const app = express();
const db = require('../db/index.js');
const controllers = require('../controllers/controllers.js');
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser());
// routes
app.get('/', (req, res) => {
  res.status(200).send('Welcome to Atelier API!');
})
// get all questions by product_id
app.get('/qa/questions/', controllers.getQuestions);
// get all answers by question_id
app.get('/qa/questions/:question_id/answers', controllers.getAnswers);
// post a question
app.post('/qa/questions', controllers.postQuestion);
// post an answer
app.post('/qa/questions/:question_id/answers', controllers.postAnswer);
// mark question as helpful
app.put('/qa/questions/:question_id/helpful', controllers.helpfulQuestion);
// report a question
app.put('/qa/questions/:question_id/report', controllers.reportQuestion);
// mark answer as helpful
app.put('/qa/answers/:answer_id/helpful', controllers.helpfulAnswer);
// report an answer
app.put('/qa/answers/:answer_id/report', controllers.reportAnswer);
// export app for testing or using multiple databases
module.exports = app;
```
* Controllers separate HTTP and database logic, in clean async/await syntax; integrated with Redis:
```javascript
// List Questions
  getQuestions: async (req, res) => {
    let productID = req.query.product_id;
    try {
      let checkCache = await redisClient.get(`${productID}`)
      if (checkCache) {
        console.log(JSON.parse(checkCache))
        res.status(200).send(JSON.parse(checkCache));
      } else {
        let dbQuestions = await services.getAllQuestions(
          productID, req.query.page, req.query.count
          );
        redisClient.set(`${productID}`, JSON.stringify(dbQuestions))
        res.status(200).send(dbQuestions)
      }
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }
```
* A single model allows for fast top-level queries and nested relationships, with schema enforcement
```javascript
let qandaSchema = new mongoose.Schema({
  id: {
    type: Number,
    index: true,
    unique: true,
    required: true
  },
  product_id: {
    type: Number,
    index: true,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date_written: Date,
  asker_name: {
    type: String,
    required: true
  },
  asker_email: {
    type: String,
    required: true
  },
  reported: Number,
  helpful: Number,
  answers: [
    {
      id: {
        type: Number,
        index: true,
        unique: true,
        sparse: true,
        required: true
      },
      question_id: {
        type: Number,
        index: true,
        required: true
      },
      body: {
        type: String,
        required: true
      },
      date_written: Date,
      answerer_name: {
        type: String,
        required: true
      },
      answerer_email: {
        type: String,
        required: true
      },
      reported: Number,
      helpful: Number,
      photos: [
        {
          id: {
            type: Number,
            index: true,
            unique: true,
            sparse: true,
            required: true
          },
          answer_id: {
            type: Number,
            index: true,
            required: true
          },
          url: String
        }
      ]
    }
  ]
},
{ collection: 'qandas' })
```

## 🧪 Running Tests

To run tests using Jest and Supertest, run the following command

```bash
  npm run test
```
-- or --

```bash
  npm run test test/<a single test directory here>
```

* Simply create an account with New Relic to view graphical data
* Install K6 locally to take advantage of the load-testing suite:
```javascript
import http from 'k6/http';
import { Counter } from 'k6/metrics';
import { sleep, check } from 'k6';

let counterErrors = new Counter('server_errors');
export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 100,
      timeUnit: '1s',
      duration: '60s',
      preAllocatedVUs: 100,
      maxVUs: 200,
    },
  },
    thresholds: {
    http_req_duration: ['avg<10'],
    http_req_failed: ['rate<0.02']
  }
};

export default function () {
  let product_id = Math.floor(Math.random() * (999777 - 900045) + 900045);
  let res = http.get(
    `http://localhost:3030/qa/questions?product_id=${product_id}&page=1&count=5`
    );
  check(res, {
    'Status Code is 200': (r) => r.status === 200
  })
  if (res.status !== 200) {
    counterErrors.add(1);
  }
  sleep(1);
}
```


## ⛰️ Environment Variables

To run this service, adjust the .env file, use the production start script in package.json, and update your own database URI:

```.env```:
```javascript
API_KEY=<your API key here>
```

```package.json```:
```javascript
"start:production": "NODE_ENV=production nodemon index.js",
```

```db/index.js```:
```javascript
let uri;
if (process.env.NODE_ENV === 'development') {
  uri = 'mongodb://localhost:27017/qandaservice';
}
if (process.env.NODE_ENV === 'production') {
  uri = 'mongodb://ec2-1-234-567-89.us-east-2.compute.amazonaws.com:27017/qandaservice';
}
```


## ⚙️ Optimizations

**Performance:** Performance increases were carefully planned and implemented with all metrics documented. From utilizing middleware, to improving database queries and load-testing, this service stands up to any high-traffic needs. Additionally, the built in K6 and New Relic test suite enables continuous testing during integration and deployment. Speaking of deployment, NGINX and Redis enabled lightning response which improve latency, error rates, and throughout up to 10K RPS!


## 💻 Tech Stack

* [Express](https://expressjs.com/)
* [NodeJS](https://nodejs.dev/)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose](https://mongoosejs.com/)
* [Jest](https://jestjs.io/docs/expect)
* [Supertest](https://www.npmjs.com/package/supertest)
* [K6](https://k6.io/)
* [New Relic](https://newrelic.com/)
* [Loader](https://loader.io/)
<br>
Full Deployment:
<br>
* [NGINX](https://www.nginx.com/)
* [Redis](https://redis.io/)


## 🤖 Authors

* Cameron Colaco - Product Overview
  * https://github.com/cameron-colaco
  * https://www.linkedin.com/in/cameroncolaco/


## 🔊 Acknowledgements

 - [Hack Reactor](https://www.hackreactor.com/)
    * A special thank you to Hack Reactor!

## 🛠 Skills
Javascript, Node.js, Express, NoSQL, MongoDB, ORDBMS, Mongoose, NGINX, Redis, K6, New Relic, Loader, Amazon Web Services, Amazon Linux 2, Vim, Git, NPM, PM2, Jest, Supertest, RESTful API


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://github.com/cameron-colaco)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/cameroncolaco/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/)


## 📷 Screenshots
### **Web Sequence Diagram:**
![App Screenshot](https://drive.google.com/uc?export=view&id=1h8EZYawK8Hr5LMTVLhFu3M8Hz4KTrdD9)
### **Recommended: consolidate multiple collections into one:**
![App Screenshot](https://drive.google.com/uc?export=view&id=1hYqM3Ve2xZ9H_QM7Dvx4Mn4otfWI3Lw6)
### **High native code test coverage:**
![App Screenshot](https://drive.google.com/uc?export=view&id=1osRLi_iMJ2ZClzKSEaYONvn-QWmBBR6N)
### **Performant under load-testing:**
![App Screenshot](https://drive.google.com/uc?export=view&id=14lXQnMuNCT5-7nKFPIyNEf1z2HY0qsql)
### **Identify bottlenecks and record metrics with New Relic:**
![App Screenshot](https://drive.google.com/uc?export=view&id=18yp0beFTQZMyoN-MzCrL6vrDBNWbu_KD)
### **Configure NGINX to load-balance and cache in top of application layer:**
![App Screenshot](https://drive.google.com/uc?export=view&id=1d91I2fLMCySqxw8uCqfI6g0nx8Pd547V)
### **Enjoy 10,000 requests per second and beyond with dual-layer caching (optional):**
![App Screenshot](https://drive.google.com/uc?export=view&id=1eiRrxjHC7fgkPl6Ab5XQntkuT4Odvhb6)

