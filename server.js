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
const hashingStress = async () => {
 for(let i = 0; i < 10000; i++) {
   crypto.pbkdf2Sync('password', 'salt', 1000, 512, 'sha512');
 }
};

// Memory stress
const memoryStress = async () => {
   const arrays = [];
   const chunk = new Array(10000000).fill('A').join(''); // ~10MB per chunk
   try {
       while(true) {
           arrays.push(chunk);
           arrays.push(new Array(5000000).fill(Math.random())); // Additional random arrays
           // Force allocation
           JSON.stringify(arrays[arrays.length-1]);
       }
   } catch(e) {
       return arrays.length;
   }
};
// Network stress
const networkStress = async () => {
  const data = crypto.randomBytes(50 * 1024 * 1024); // 50MB
  return data.toString('base64');
};

app.get('/stress', async (req, res) => {
  try {
     await Promise.all([
       hashingStress(),
       memoryStress(),
       networkStress()
     ]);
     res.send(`Stressed PID: ${process.pid}`);
   } catch(e) {
     res.status(500).send(e.message);
   }
});

app.listen(port, '0.0.0.0', () => {
   const ip = getLocalIP();
   console.log(`Server running at http://${ip}:${port}`);
   console.log('Stress test endpoint: /stress');
});
