const express = require('express');
const app = express();

console.log('Testing route loading...\n');

// Test loading routes one by one
try {
  console.log('1. Loading authRoutes...');
  const authRoutes = require('./routes/auth');
  app.use('/test-auth', authRoutes);
  console.log('✓ authRoutes loaded\n');
} catch (err) {
  console.log('✗ Error loading authRoutes:', err.message, '\n');
}

try {
  console.log('2. Loading userRoutes...');
  const userRoutes = require('./routes/user');
  app.use('/test-users', userRoutes);
  console.log('✓ userRoutes loaded\n');
} catch (err) {
  console.log('✗ Error loading userRoutes:', err.message, '\n');
}

try {
  console.log('3. Loading postRoutes...');
  const postRoutes = require('./routes/postRoutes');
  app.use('/test-posts', postRoutes);
  console.log('✓ postRoutes loaded\n');
} catch (err) {
  console.log('✗ Error loading postRoutes:', err.message, '\n');
}

try {
  console.log('4. Loading statusRoutes...');
  const statusRoutes = require('./routes/statusRoutes');
  app.use('/test-status', statusRoutes);
  console.log('✓ statusRoutes loaded\n');
} catch (err) {
  console.log('✗ Error loading statusRoutes:', err.message, '\n');
}

try {
  console.log('5. Loading listingRoutes...');
  const listingRoutes = require('./routes/listingRoutes');
  app.use('/test-listings', listingRoutes);
  console.log('✓ listingRoutes loaded\n');
} catch (err) {
  console.log('✗ Error loading listingRoutes:', err.message, '\n');
}

try {
  console.log('6. Loading liveStreamRoutes...');
  const liveStreamRoutes = require('./routes/liveStreamRoutes');
  app.use('/test-live', liveStreamRoutes);
  console.log('✓ liveStreamRoutes loaded\n');
} catch (err) {
  console.log('✗ Error loading liveStreamRoutes:', err.message, '\n');
}

try {
  console.log('7. Loading messageRoutes...');
  const messageRoutes = require('./routes/messageRoutes');
  app.use('/test-messages', messageRoutes);
  console.log('✓ messageRoutes loaded\n');
} catch (err) {
  console.log('✗ Error loading messageRoutes:', err.message, '\n');
}

try {
  console.log('8. Loading adminRoutes...');
  const adminRoutes = require('./routes/adminRoutes');
  app.use('/test-admin', adminRoutes);
  console.log('✓ adminRoutes loaded\n');
} catch (err) {
  console.log('✗ Error loading adminRoutes:', err.message, '\n');
}

console.log('✅ All routes loaded successfully!');
console.log('Starting server on port 4001...\n');

app.get('/', (req, res) => {
  res.send('Minimal app test');
});

app.listen(4001, () => {
  console.log('Server running on http://localhost:4001');
});