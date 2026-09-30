// Debug the split behavior
const fs = require('fs');
const t = fs.readFileSync('index.html', 'utf8');

// Show a small slice of the file around "Meme Codex"
const idx = t.indexOf('Meme Codex');
const slice = t.slice(idx, idx + 30);
console.log('Slice bytes:');
for (let i = 0; i < slice.length; i++) {
  const c = slice.charCodeAt(i);
  console.log(`  [${i}] char=${JSON.stringify(slice[i])}  U+${c.toString(16)}`);
}

// Try the split
const target = 'â€"—';  // supposed to be 3 chars
console.log('Target bytes:');
for (let i = 0; i < target.length; i++) {
  const c = target.charCodeAt(i);
  console.log(`  [${i}] char=${JSON.stringify(target[i])}  U+${c.toString(16)}`);
}

const parts = slice.split(target);
console.log('Split result:', parts);
