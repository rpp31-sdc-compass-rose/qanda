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
  let question_id = Math.floor(Math.random() * (3518963 - 3167773) + 3167773);
  http.get(`http://localhost:3030/qa/questions/${question_id}/answers`);
  sleep(1);
}
