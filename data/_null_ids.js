const fs = require('fs');
const path = require('path');
for (const file of ['memes_en.js', 'memes_intl.js']) {
  const txt = fs.readFileSync(path.join('data', file), 'utf8');
  const ids = [...txt.matchAll(/"id":"([^"]+)"/g)].map(m => m[1]);
  // Find all "image_url": occurrences and pair with nearest preceding id
  const entries = [];
  const re = /"id":"([^"]+)"[\s\S]*?"image_url":(null|"[^"]*")/g;
  let m;
  while ((m = re.exec(txt)) !== null) {
    entries.push({ id: m[1], url: m[2] });
  }
  const nulls = entries.filter(e => e.url === 'null');
  const withUrl = entries.filter(e => e.url !== 'null');
  console.log(file, '— total', entries.length, '— with url', withUrl.length, '— null', nulls.length);
  if (nulls.length) console.log('  Nulls:', nulls.map(e => e.id).join(', '));
}
