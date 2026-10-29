// Merge new meme batches into the .js data files via RAW TEXT SPLICE.
// - Existing bytes are preserved; only the changed lines are rewritten.
// - Line endings match the file's dominant style (CRLF in this repo).
// - FAIL CLOSED: the spliced text is parsed in memory before it touches disk.
const fs = require('fs');
const path = require('path');

const d = path.resolve(__dirname);

// --- backfill: id -> KYM CDN image url -------------------------------------
const BACKFILL = {
  'pumpkin-spice-latte': 'https://i.kym-cdn.com/entries/icons/original/000/016/537/star.jpg',
  'tide-pod-challenge': 'https://i.kym-cdn.com/entries/icons/original/000/024/993/tide-pods-split-tease-today-160610_73c7e9b8afc60ff6e2ae0ce4200630cc.jpg',
  'kai-cenat': 'https://i.kym-cdn.com/entries/icons/original/000/041/972/kaicenat.jpg',
  'schrute-facts': 'https://i.kym-cdn.com/entries/icons/original/000/006/467/SCHRUTE-FACTS.jpg',
  'soyjak-wojak': 'https://i.kym-cdn.com/entries/icons/original/000/018/433/wojak.jpg',
  'side-eye-chick': 'https://i.kym-cdn.com/entries/icons/original/000/025/446/side-eye.jpg',
  'hot-girl-summer': 'https://i.kym-cdn.com/entries/icons/original/000/030/285/hotgirlsummer.png',
  'bird-box-challenge': 'https://i.kym-cdn.com/entries/icons/original/000/027/958/bird.jpg',
  'i-am-steve': 'https://i.kym-cdn.com/entries/icons/original/000/051/221/mynameasteve.jpg',
  'gonna-tell-my-kids': 'https://i.kym-cdn.com/entries/icons/original/000/031/869/Untitled-1.png',
  'look-at-this-dude': 'https://i.kym-cdn.com/entries/icons/original/000/020/330/lookatthisduddeeee.JPG',
  'sad-keanu': 'https://i.kym-cdn.com/entries/icons/original/000/002/862/SadKeanu.jpg',
};

// --- dedupe fix: 'pepe-the-frog' existed in BOTH files ------------------------
// Same meme, same image, same origin. The INTL copy is the richer write-up,
// but Pepe is a US/4chan meme so it belongs in the Western file. Enrich the
// EN copy with the better text and drop the INTL duplicate.
const PEPE_FIXED = {
  id: 'pepe-the-frog',
  name: 'Pepe the Frog',
  year: 2008,
  era: 'Classic Web 2007-2012',
  origin_country: 'US',
  origin_platform: "4chan / Matt Furie's Boy's Club",
  category: 'character',
  image_url: 'https://i.kym-cdn.com/entries/icons/original/000/017/618/pepefroggie.jpg',
  short_desc: "Matt Furie's cartoon frog turned into a universal feeling-reaction across 4chan.",
  origin_story: "Matt Furie's 2005 comic Boy's Club introduced 'feels good man' Pepe. Starting around 2008, users on 4chan's /b/ and /r9k/ boards exploited his face for 'feels' reaction images: sad, smug, angry, rare and so on, spawning dozens of variants by 2014-2016.",
  meaning: 'Originally an ironic sad-frog reaction, Pepe became the most remixed feeling-meme of the 2010s and later developed into a collectible card subculture through Rare Pepe. It remains a flexible emotional vocabulary.',
  peak_year: 2016,
  tags: ['pepe', 'frog', '4chan', 'feels', 'reaction', 'rare-pepe'],
};

const JOBS = [
  { file: 'memes_en.js', batch: '_new_batch_en.json', drop: [], enrich: { 'pepe-the-frog': PEPE_FIXED } },
  { file: 'memes_intl.js', batch: '_new_batch_intl.json', drop: ['pepe-the-frog'], enrich: {} },
];

const FIELDS = ['id', 'name', 'year', 'era', 'origin_country', 'origin_platform', 'category',
  'image_url', 'short_desc', 'origin_story', 'meaning', 'peak_year', 'tags'];
const ERAS = new Set(['Classic Web 2007-2012', 'Peak 2012-2017', 'Post-Irony 2017-2020', 'Gen Z 2020-2026']);

function parseArray(raw) {
  return JSON.parse(raw.replace(/^[\s\S]*?=\s*/, '').replace(/[;\s]+$/, ''));
}

let fatal = 0;

for (const job of JOBS) {
  const p = path.join(d, job.file);
  const raw = fs.readFileSync(p, 'utf8');
  const before = parseArray(raw);
  const beforeIds = new Set(before.map(m => m.id));
  const beforeLen = raw.length;

  // detect dominant line ending
  const crlf = (raw.match(/\r\n/g) || []).length;
  const lf = (raw.match(/\n/g) || []).length;
  const EOL = crlf > 0 ? '\r\n' : '\n';
  console.log(`${job.file}: EOL=${EOL === '\r\n' ? 'CRLF' : 'LF'} (crlf=${crlf} lf=${lf})`);

  // split into physical lines, remembering the trailing newline
  let lines = raw.split(/\r?\n/);
  const trailingNewline = lines[lines.length - 1] === '';
  if (trailingNewline) lines = lines.slice(0, -1);

  // ---- 1. drop duplicate entries ------------------------------------------
  for (const id of job.drop) {
    const idx = lines.findIndex(l => l.startsWith('  {"id":"' + id + '"'));
    if (idx === -1) { console.log(`  !! ${job.file}: drop target ${id} not found`); fatal++; continue; }
    lines.splice(idx, 1);
    console.log(`  dropped duplicate id "${id}" from ${job.file}`);
  }

  // ---- 2. enrich a specific entry in place --------------------------------
  for (const [id, obj] of Object.entries(job.enrich)) {
    const idx = lines.findIndex(l => l.startsWith('  {"id":"' + id + '"'));
    if (idx === -1) { console.log(`  !! ${job.file}: enrich target ${id} not found`); fatal++; continue; }
    const hadComma = lines[idx].trimEnd().endsWith('},');
    lines[idx] = '  ' + JSON.stringify(obj) + (hadComma ? ',' : '');
    console.log(`  enriched "${id}" in ${job.file}`);
  }

  // ---- 3. backfill image_url (line-scoped replace) ------------------------
  let backfilled = 0;
  const skipped = [];
  for (const [id, url] of Object.entries(BACKFILL)) {
    const idx = lines.findIndex(l => l.startsWith('  {"id":"' + id + '"'));
    if (idx === -1) { skipped.push(id); continue; }
    if (!lines[idx].includes('"image_url":null')) { skipped.push(id + ' (already has image)'); continue; }
    lines[idx] = lines[idx].replace('"image_url":null', '"image_url":"' + url + '"');
    backfilled++;
  }

  // ---- 4. append the new batch (raw splice before the closing bracket) ----
  const batch = JSON.parse(fs.readFileSync(path.join(d, job.batch), 'utf8'));
  const dupes = batch.filter(m => beforeIds.has(m.id) && !job.drop.includes(m.id)).map(m => m.id);
  const toAdd = batch.filter(m => !beforeIds.has(m.id) || job.drop.includes(m.id));

  for (const m of toAdd) {
    for (const f of FIELDS) if (!(f in m)) { console.log(`  !! ${job.file} ${m.id}: missing field ${f}`); fatal++; }
    if (!ERAS.has(m.era)) { console.log(`  !! ${job.file} ${m.id}: bad era "${m.era}"`); fatal++; }
    if (!Array.isArray(m.tags) || m.tags.length < 3 || m.tags.length > 6) { console.log(`  !! ${job.file} ${m.id}: tags length ${m.tags && m.tags.length}`); fatal++; }
    const sw = String(m.short_desc).trim().split(/\s+/).length;
    if (sw > 20) { console.log(`  !! ${job.file} ${m.id}: short_desc ${sw} words`); fatal++; }
    const ow = String(m.origin_story).trim().split(/\s+/).length;
    if (ow < 50 || ow > 80) { console.log(`  !! ${job.file} ${m.id}: origin_story ${ow} words (target 50-80)`); fatal++; }
  }
  if (dupes.length) { console.log(`  !! ${job.file}: skipped duplicate ids: ${dupes.join(', ')}`); fatal++; }

  let closeIdx = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() === '];') { closeIdx = i; break; }
  }
  if (closeIdx === -1) { console.log(`  !! ${job.file}: could not find closing '];'`); fatal++; continue; }

  const prev = lines[closeIdx - 1];
  const newLines = toAdd.map(m => '  ' + JSON.stringify(m));
  for (let i = 0; i < newLines.length - 1; i++) newLines[i] += ',';
  if (!prev.trimEnd().endsWith('}')) { console.log(`  !! ${job.file}: unexpected tail before ']: ${prev.slice(-40)}`); fatal++; continue; }
  lines[closeIdx - 1] = prev.replace(/\s+$/, '') + ',';
  lines.splice(closeIdx, 0, ...newLines);

  const out = lines.join(EOL) + (trailingNewline ? EOL : '');

  // FAIL CLOSED: parse the spliced text in memory BEFORE it touches disk
  let staged;
  try {
    staged = parseArray(out);
  } catch (e) {
    console.log(`  !! ${job.file}: spliced text does NOT parse (${e.message}) - file left untouched`);
    fatal++;
    continue;
  }
  const expected = before.length - job.drop.length + toAdd.length;
  if (staged.length !== expected) {
    console.log(`  !! ${job.file}: staged count ${staged.length} != expected ${expected} - file left untouched`);
    fatal++;
    continue;
  }
  fs.writeFileSync(p, out, 'utf8');

  // ---- 5. re-read and verify ----------------------------------------------
  const after = parseArray(fs.readFileSync(p, 'utf8'));
  const afterIds = after.map(m => m.id);
  const dupIdCheck = afterIds.filter((id, i) => afterIds.indexOf(id) !== i);
  const badField = after.filter(m => FIELDS.some(f => !(f in m)));
  const badEra = after.filter(m => !ERAS.has(m.era));
  const badTags = after.filter(m => !Array.isArray(m.tags) || m.tags.length < 3 || m.tags.length > 6);
  const outRaw = fs.readFileSync(p, 'utf8');
  const mixed = (outRaw.match(/\r\n/g) || []).length > 0 && outRaw.split('\n').some(l => l.length && !outRaw.includes(l + '\r\n') && false);
  const preserved = after.slice(0, before.length - job.drop.length).every((m, i) => {
    const orig = before.filter(x => !job.drop.includes(x.id))[i];
    return orig && m.id === orig.id;
  });

  console.log(`${job.file}: ${before.length} -> ${after.length} (+${toAdd.length} new, -${job.drop.length} dup)  bytes ${beforeLen} -> ${outRaw.length}  backfilled=${backfilled}`);
  console.log(`  first=${after[0].id}  last=${after[after.length - 1].id}`);
  console.log(`  prior entries preserved in order: ${preserved}`);
  console.log(`  duplicate ids in file: ${dupIdCheck.length ? dupIdCheck.join(', ') : 'none'}`);
  console.log(`  missing field: ${badField.length}  bad era: ${badEra.length}  bad tags: ${badTags.length}`);
  if (skipped.length) console.log(`  backfill skipped: ${skipped.join(', ')}`);
  if (dupIdCheck.length || badField.length || badEra.length || badTags.length || !preserved) fatal++;
}

// ---- cross-file duplicate check ----
const en = parseArray(fs.readFileSync(path.join(d, 'memes_en.js'), 'utf8'));
const intl = parseArray(fs.readFileSync(path.join(d, 'memes_intl.js'), 'utf8'));
const all = [...en, ...intl];
const ids = all.map(m => m.id);
const crossDupes = ids.filter((id, i) => ids.indexOf(id) !== i);
const withImg = all.filter(m => m.image_url).length;
const countries = new Set(all.map(m => m.origin_country)).size;
console.log(`\nTOTAL=${all.length}  EN=${en.length}  INTL=${intl.length}  withImage=${withImg}  countries=${countries}`);
console.log(`cross-file duplicate ids: ${crossDupes.length ? crossDupes.join(', ') : 'none'}`);
if (crossDupes.length) fatal++;
console.log(fatal ? `\n*** ${fatal} PROBLEM(S) ***` : '\nAll checks passed.');
process.exit(fatal ? 1 : 0);
