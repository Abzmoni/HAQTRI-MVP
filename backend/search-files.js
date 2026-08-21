// search-files.js
const fs = require('fs');
const path = require('path');

function searchInFiles(dir, searchString) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      searchInFiles(fullPath, searchString);
    } else if (file.isFile() && fullPath.endsWith('.js')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(searchString)) {
          console.log(`Found in: ${fullPath}`);
        }
      } catch (err) {
        // Ignore read errors
      }
    }
  }
}

console.log('Searching for "git.new/pathToRegexpError"...');
searchInFiles(__dirname, 'git.new/pathToRegexpError');
console.log('Search complete.');