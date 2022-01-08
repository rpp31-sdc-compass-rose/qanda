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
  let questionID = Math.floor(Math.random() * (3492872 - 3167346) + 3167346);
  let res = http.put(`http://localhost:3030/qa/questions/${questionID}/helpful`);

  check(res, {
    'Status Code is 200': (r) => r.status === 200
  })

  if (res.status !== 200) {
    counterErrors.add(1);
  }

  sleep(1);
}