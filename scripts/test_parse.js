const fs = require('fs');
const content = fs.readFileSync('D:/Uddipok_Education/questions_raw.txt', 'utf8');
const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

console.log('Total non-empty lines:', lines.length);

// Let's inspect the first 30 lines
lines.slice(0, 30).forEach((l, i) => console.log(`${i}: ${l}`));
