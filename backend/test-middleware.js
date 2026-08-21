// test-middleware.js
const express = require('express');
const app = express();

console.log('Testing middleware first...\n');

// Test auth middleware
try {
  console.log('1. Testing auth middleware...');
  const { protect, admin } = require('./middleware/auth');
  console.log('✓ auth middleware OK\n');
} catch (err) {
  console.error('✗ Error in auth middleware:', err.message, '\n');
}

// Test upload middleware
try {
  console.log('2. Testing upload middleware...');
  const { upload, handleUploadErrors } = require('./middleware/upload');
  console.log('✓ upload middleware OK\n');
} catch (err) {
  console.error('✗ Error in upload middleware:', err.message, '\n');
}

// Now test with a single route
console.log('3. Testing with minimal app and ONE route...\n');

const app2 = express();
const authRoutes = require('./routes/auth');

app2.use('/api/auth', authRoutes);
app2.get('/', (req, res) => res.send('Test'));

app2.listen(5000, () => {
  console.log('✓ Server running on port 5000');
  console.log('✅ If this works, the issue is in route combinations');
  console.log('\nTry accessing: http://localhost:5000/api/auth');
});