const fs = require('fs');
const path = require('path');

function loadArray(p) {
  const t = fs.readFileSync(p, 'utf8');
  const m = t.match(/=\s*(\[.*\])\s*;?\s*$/s);
  if (!m) throw new Error('bad');
  return JSON.parse(m[1]);
}

const en = loadArray('memes_en.js');
const intl = loadArray('memes_intl.js');
const all = [...en, ...intl];

const eraCounts = {};
all.forEach(m => { eraCounts[m.era] = (eraCounts[m.era] || 0) + 1; });
console.log('Era values:');
Object.entries(eraCounts).forEach(([k,v]) => console.log('  [' + v + ']  ' + JSON.stringify(k)));

const countries = {};
all.forEach(m => { if (m.origin_country) countries[m.origin_country] = (countries[m.origin_country] || 0) + 1; });
console.log();
console.log('Top 15 countries:');
Object.entries(countries).sort((a,b) => b[1]-a[1]).slice(0, 15).forEach(([k,v]) => console.log('  [' + v + ']  ' + k));

console.log();
console.log('With image_url:', all.filter(m => m.image_url).length);
console.log('Total:', all.length);
