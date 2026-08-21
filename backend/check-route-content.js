// check-route-content.js
const fs = require('fs');
const path = require('path');

console.log('Checking route files for invalid patterns...\n');

const files = [
  'adminRoutes.js',
  'auth.js', 
  'listingRoutes.js',
  'liveStreamRoutes.js',
  'messageRoutes.js',
  'postRoutes.js',
  'statusRoutes.js',
  'user.js'
];

files.forEach(filename => {
  console.log(`\n=== Checking ${filename} ===`);
  try {
    const filePath = path.join(__dirname, 'routes', filename);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for any malformed routes
    const lines = content.split('\n');
    let hasIssues = false;
    
    lines.forEach((line, index) => {
      // Look for route definitions
      if (line.includes('router.') && 
          (line.includes('get(') || line.includes('post(') || 
           line.includes('put(') || line.includes('delete(') || 
           line.includes('patch('))) {
        
        // Extract the route path
        const match = line.match(/["']([^"']+)["']/);
        if (match) {
          const route = match[1];
          
          // Check for malformed parameters
          if (route.includes('/:') && route.split('/:').length > 1) {
            const parts = route.split('/:');
            for (let i = 1; i < parts.length; i++) {
              const paramPart = parts[i];
              if (!paramPart || paramPart.trim() === '' || 
                  /^[^a-zA-Z_]/.test(paramPart) || paramPart.includes('/:')) {
                console.log(`  ❌ Line ${index + 1}: Invalid parameter in route: "${route}"`);
                hasIssues = true;
              }
            }
          }
          
          // Check for double slashes
          if (route.includes('//')) {
            console.log(`  ❌ Line ${index + 1}: Double slash in route: "${route}"`);
            hasIssues = true;
          }
          
          // Check for colon without parameter
          if (route.includes(':/') && !route.includes('/:')) {
            console.log(`  ❌ Line ${index + 1}: Colon without parameter in route: "${route}"`);
            hasIssues = true;
          }
        }
      }
    });
    
    if (!hasIssues) {
      console.log(`  ✅ ${filename} looks good`);
    }
  } catch (err) {
    console.log(`  ❌ Error reading ${filename}: ${err.message}`);
  }
});

console.log('\n=== Checking complete ===');