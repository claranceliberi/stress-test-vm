import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
 stages: [
   { duration: '30s', target: 20 },  // Ramp up
   { duration: '1m', target: 50 },   // Stay at peak
   { duration: '30s', target: 0 },   // Ramp down
 ],
 thresholds: {
   http_req_failed: ['rate<0.01'],
   http_req_duration: ['p(95)<2000']
 }
};

const URLS = [
 'http://192.168.1.76:3000/stress',
 'http://192.168.1.78:3000/stress'
];

export default function () {
 URLS.forEach(url => {
   const res = http.get(url);
   check(res, { 'status is 200': (r) => r.status === 200 });
 });
 sleep(1);
}
