import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: "30s", target: 175 },
    { duration: "15s", target: 175 },
    { duration: "30s", target: 0 }
  ]
}

export default function () {
  let product_id = Math.floor(Math.random() * (1000011 - 900294) + 900294);
  http.get(`http://localhost:3030/qa/questions?product_id=${product_id}&page=1&count=5`);
  sleep(1);
}
