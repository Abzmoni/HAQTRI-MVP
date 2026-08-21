// test-simple.js
const express = require('express');
const app = express();

// Try loading routes one at a time to find the problematic one
console.log('Testing route loading...\n');

const testOrder = [
  { name: 'auth', file: './routes/auth' },
  { name: 'user', file: './routes/user' },
  { name: 'posts', file: './routes/postRoutes' },
  { name: 'status', file: './routes/statusRoutes' },
  { name: 'listings', file: './routes/listingRoutes' },
  { name: 'live', file: './routes/liveStreamRoutes' },
  { name: 'messages', file: './routes/messageRoutes' },
  { name: 'admin', file: './routes/adminRoutes' }
];

let lastWorking = null;

for (const route of testOrder) {
  try {
    console.log(`Testing ${route.name}...`);
    const router = require(route.file);
    app.use(`/test-${route.name}`, router);
    lastWorking = route.name;
    console.log(`✓ ${route.name} loaded\n`);
  } catch (err) {
    console.log(`\n❌ ERROR loading ${route.name}: ${err.message}\n`);
    console.log(`Last working route was: ${lastWorking}`);
    console.log(`The problem is in: ${route.name} (${route.file})`);
    break;
  }
}

if (lastWorking === testOrder[testOrder.length - 1].name) {
  console.log('✅ All routes loaded successfully!');
  console.log('\nStarting server on port 5000...');
  app.listen(5000, () => {
    console.log('Test server running on http://localhost:5000');
  });
}