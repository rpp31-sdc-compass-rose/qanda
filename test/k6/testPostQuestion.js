import http from 'k6/http';
import { Counter } from 'k6/metrics';
import { sleep, check } from 'k6';

let counterErrors = new Counter('server_errors');

// export let options = {
//   stages: [
//     { duration: "30s", target: 100 },
//     { duration: "15s", target: 100 },
//     { duration: "30s", target: 0 }
//   ],
//   thresholds: {
//     http_req_duration: ['avg<10'],
//     http_req_failed: ['rate<0.10']
//   }
// }

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 100,
      timeUnit: '1s',
      duration: '30s',
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
  let productID = Math.floor(Math.random() * (999777 - 900045) + 900045);
  let payload = {
    product_id: productID,
    body: 'Test question from K6!',
    name: 'Person McTester',
    email: 'pmctester@somemail.com'
  }
  let res = http.post(`http://localhost:3030/qa/questions`, payload);

  check(res, {
    'Status Code is 200': (r) => r.status === 201
  })

  if (res.status !== 201) {
    counterErrors.add(1);
  }

  sleep(1);
}
