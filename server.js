const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const os = require('os');

const app = express();
const port = 3000;

app.use(cors());

const getLocalIP = () => {
   const interfaces = os.networkInterfaces();
   for (const name of Object.keys(interfaces)) {
       for (const iface of interfaces[name]) {
           if (iface.family === 'IPv4' && !iface.internal) {
               return iface.address;
           }
       }
   }
};

// Intensive CPU operations
const hashingStress = () => {
  for(let i = 0; i < 1000000; i++) {
    crypto.pbkdf2Sync('password', 'salt', 100000, 512, 'sha512');
  }
};

// Memory stress
const memoryStress = () => {
  const arrays = [];
  for(let i = 0; i < 100; i++) {
    arrays.push(new Array(1000000).fill(Math.random()));
  }
  return arrays.length;
};

// Network stress
const networkStress = () => {
  const data = crypto.randomBytes(50 * 1024 * 1024); // 50MB
  return data.toString('base64');
};

app.get('/stress', (req, res) => {
  hashingStress();
  memoryStress();
  const networkData = networkStress();
  res.send(networkData);
});

app.listen(port, '0.0.0.0', () => {
   const ip = getLocalIP();
   console.log(`Server running at http://${ip}:${port}`);
   console.log('Stress test endpoint: /stress');
});
