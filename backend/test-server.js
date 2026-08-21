const express = require('express');
const app = express();

console.log('Testing route imports one by one...');

try {
  console.log('1. Testing authRoutes...');
  require('./routes/auth');
  console.log('✓ authRoutes OK');
} catch (err) {
  console.log('✗ authRoutes ERROR:', err.message);
}

try {
  console.log('2. Testing userRoutes...');
  require('./routes/user');
  console.log('✓ userRoutes OK');
} catch (err) {
  console.log('✗ userRoutes ERROR:', err.message);
}

try {
  console.log('3. Testing postRoutes...');
  require('./routes/postRoutes');
  console.log('✓ postRoutes OK');
} catch (err) {
  console.log('✗ postRoutes ERROR:', err.message);
}

try {
  console.log('4. Testing statusRoutes...');
  require('./routes/statusRoutes');
  console.log('✓ statusRoutes OK');
} catch (err) {
  console.log('✗ statusRoutes ERROR:', err.message);
}

try {
  console.log('5. Testing listingRoutes...');
  require('./routes/listingRoutes');
  console.log('✓ listingRoutes OK');
} catch (err) {
  console.log('✗ listingRoutes ERROR:', err.message);
}

try {
  console.log('6. Testing liveStreamRoutes...');
  require('./routes/liveStreamRoutes');
  console.log('✓ liveStreamRoutes OK');
} catch (err) {
  console.log('✗ liveStreamRoutes ERROR:', err.message);
}

try {
  console.log('7. Testing messageRoutes...');
  require('./routes/messageRoutes');
  console.log('✓ messageRoutes OK');
} catch (err) {
  console.log('✗ messageRoutes ERROR:', err.message);
}

try {
  console.log('8. Testing adminRoutes...');
  require('./routes/adminRoutes');
  console.log('✓ adminRoutes OK');
} catch (err) {
  console.log('✗ adminRoutes ERROR:', err.message);
}

console.log('\nDone testing all route files.');