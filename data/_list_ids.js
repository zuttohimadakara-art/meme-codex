const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname);

function extractIds(file) {
  const txt = fs.readFileSync(file, 'utf8');
  return [...txt.matchAll(/"id":"([^"]+)"/g)].map(m => m[1]);
}

const enIds = extractIds(path.join(dataDir, 'memes_en.js'));
const intlIds = extractIds(path.join(dataDir, 'memes_intl.js'));

const all = new Set([...enIds, ...intlIds]);
const result = {
  en: enIds,
  intl: intlIds,
  all: [...all].sort(),
  counts: { en: enIds.length, intl: intlIds.length, total: enIds.length + intlIds.length }
};
fs.writeFileSync(path.join(dataDir, '_existing_ids.json'), JSON.stringify(result, null, 2));
console.log(`EN: ${enIds.length}, INTL: ${intlIds.length}, TOTAL: ${enIds.length + intlIds.length}`);
console.log('Written to _existing_ids.json');
