const fs = require('fs');
const t = fs.readFileSync('data/memes_en.js', 'utf8');
const i = t.indexOf('"id":"tide-pod-challenge"');
if (i < 0) {
  console.log('NOT FOUND');
  process.exit(0);
}
// Find the next entry start after this one
const re = /"id":"[^"]+"/g;
re.lastIndex = i + 10;
const next = re.exec(t);
const j = next ? next.index : t.length;
console.log(t.slice(i, j));
