// find-bad-routes.js
const fs = require('fs');
const path = require('path');

console.log('Searching for potential route issues...\n');

// Check all JS files in the project
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Look for route patterns that might be problematic
      if (line.includes('router.') || line.includes('app.')) {
        // Check for patterns like : without parameter name
        if (line.includes('":') || line.includes("':")) {
          const matches = line.match(/["']([^"']+)["']/g);
          if (matches) {
            matches.forEach(match => {
              const route = match.slice(1, -1); // Remove quotes
              // Check for malformed parameters
              if (route.includes('/:') && route.split('/:').some(part => 
                  part === '' || /^[^a-zA-Z_]/.test(part))) {
                console.log(`❌ ${filePath}:${index + 1}`);
                console.log(`   Route: ${route}`);
                console.log(`   Line: ${line.trim()}\n`);
              }
            });
          }
        }
      }
    });
  } catch (err) {
    // Ignore
  }
}

// Recursively check all JS files
function checkDirectory(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory() && 
        !item.name.includes('node_modules') && 
        !item.name.startsWith('.')) {
      checkDirectory(fullPath);
    } else if (item.isFile() && item.name.endsWith('.js')) {
      checkFile(fullPath);
    }
  }
}

checkDirectory(__dirname);
console.log('Search complete.');