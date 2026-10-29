// Generic data integrity checker for the Meme Codex data files.
// Usage: node data/_verify_final.js
const fs = require('fs');
const path = require('path');
const d = path.resolve(__dirname);

const FIELDS = ['id', 'name', 'year', 'era', 'origin_country', 'origin_platform', 'category',
  'image_url', 'short_desc', 'origin_story', 'meaning', 'peak_year', 'tags'];
const ERAS = new Set(['Classic Web 2007-2012', 'Peak 2012-2017', 'Post-Irony 2017-2020', 'Gen Z 2020-2026']);
const BAD_MOJI = /[\uFFFD]|\u00e2\u20ac|\u00c3\u00a9/g;

function parseArray(raw) {
  return JSON.parse(raw.replace(/^[\s\S]*?=\s*/, '').replace(/[;\s]+$/, ''));
}

let problems = 0;
const all = [];

for (const f of ['memes_en.js', 'memes_intl.js']) {
  const p = path.join(d, f);
  const raw = fs.readFileSync(p, 'utf8');
  const arr = parseArray(raw);
  all.push(...arr);

  const crlf = (raw.match(/\r\n/g) || []).length;
  const lf = (raw.match(/\n/g) || []).length;
  const eolOk = crlf === 0 || crlf === lf;

  const ids = arr.map(m => m.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  const missingField = arr.filter(m => FIELDS.some(k => !(k in m)));
  const badEra = arr.filter(m => !ERAS.has(m.era));
  const badTags = arr.filter(m => !Array.isArray(m.tags) || m.tags.length < 3 || m.tags.length > 6);
  const badSlug = arr.filter(m => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(m.id));
  const longDesc = arr.filter(m => String(m.short_desc).trim().split(/\s+/).length > 20);
  const moji = arr.filter(m => BAD_MOJI.test(JSON.stringify(m)));

  console.log(`${f}: ${arr.length} entries | EOL ${eolOk ? 'consistent' : 'MIXED'} (crlf=${crlf} lf=${lf}) | withImage=${arr.filter(m => m.image_url).length}`);
  console.log(`  duplicate ids: ${dupes.length ? dupes.join(', ') : 'none'}`);
  console.log(`  missing field: ${missingField.length} | bad era: ${badEra.length} | bad slug: ${badSlug.length}`);
  console.log(`  short_desc >20 words: ${longDesc.length} | tags outside 3-6: ${badTags.length} | mojibake: ${moji.length}`);
  if (badSlug.length) console.log(`    bad slugs: ${badSlug.map(m => m.id).join(', ')}`);
  if (longDesc.length) console.log(`    long desc: ${longDesc.map(m => m.id).join(', ')}`);
  if (moji.length) console.log(`    mojibake: ${moji.map(m => m.id).join(', ')}`);
  if (!eolOk || dupes.length || missingField.length || badEra.length || badSlug.length) problems++;
}

const ids = all.map(m => m.id);
const crossDupes = ids.filter((id, i) => ids.indexOf(id) !== i);
console.log(`\nTOTAL=${all.length}  withImage=${all.filter(m => m.image_url).length}  countries=${new Set(all.map(m => m.origin_country)).size}  eras=${new Set(all.map(m => m.era)).size}`);
console.log(`cross-file duplicate ids: ${crossDupes.length ? crossDupes.join(', ') : 'none'}`);
if (crossDupes.length) problems++;
console.log(problems ? `\n*** ${problems} STRUCTURAL PROBLEM(S) ***` : '\nStructure OK (tag-count / mojibake notes above are pre-existing content nits).');
process.exit(problems ? 1 : 0);
