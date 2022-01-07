import http from 'k6/http';
import { Counter } from 'k6/metrics';
import { sleep, check } from 'k6';

let counterErrors = new Counter('server_errors');

export let options = {
  stages: [
    { duration: "30s", target: 100 },
    { duration: "15s", target: 100 },
    { duration: "30s", target: 0 }
  ],
  thresholds: {
    http_req_duration: ['avg<10'],
    http_req_failed: ['rate<0.10']
  }
}

export default function () {
  let product_id = Math.floor(Math.random() * (999777 - 900045) + 900045);
  let res = http.get(`http://localhost:3030/qa/questions?product_id=${product_id}&page=1&count=5`);

  check(res, {
    'Status Code is 200': (r) => r.status === 200
  })

  if (res.status !== 200) {
    counterErrors.add(1);
  }

  sleep(1);
}
