// Smoke test: simulate what the browser does when it loads the site.
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');

const indexHtml = fs.readFileSync(path.join(REPO, 'index.html'), 'utf8');
for (const f of ['data/memes_en.js', 'data/memes_intl.js']) {
  const ref = indexHtml.includes(f);
  const exists = fs.existsSync(path.join(REPO, f));
  console.log(`index.html references ${f}: ${ref} | file exists: ${exists}`);
  if (!ref || !exists) process.exitCode = 1;
}

// load both data files exactly as the browser would (evaluate the assignment)
const vm = require('vm');
const ctx = vm.createContext({ window: {} });
for (const f of ['data/memes_en.js', 'data/memes_intl.js']) {
  vm.runInContext(fs.readFileSync(path.join(REPO, f), 'utf8'), ctx, { filename: f });
}
const en = ctx.window.MEMES_EN, intl = ctx.window.MEMES_INTL;
const all = en.concat(intl);
console.log(`\nbrowser-eval: MEMES_EN=${en.length} MEMES_INTL=${intl.length} total=${all.length}`);

// featured picks referenced by app.js must exist
const featured = ['skibidi-toilet', 'doge', 'distracted-boyfriend'];
const missing = featured.filter(id => !all.find(m => m.id === id));
console.log(`featured ids resolvable: ${missing.length ? 'MISSING ' + missing.join(', ') : 'yes'}`);

// every card must be able to resolve its own id (find() takes the first match)
const byId = new Map();
let shadowed = 0;
for (const m of all) {
  if (byId.has(m.id)) shadowed++;
  byId.set(m.id, m);
}
console.log(`ids shadowed by an earlier duplicate: ${shadowed}`);

// image_url sanity: must be a direct kym-cdn url or null
const badImg = all.filter(m => m.image_url && !/^https:\/\/i\.kym-cdn\.com\/entries\/icons\/original\//.test(m.image_url));
console.log(`image_url values not on the kym-cdn original path: ${badImg.length}`);
if (badImg.length) console.log('   ', badImg.map(m => m.id).join(', '));

// every image url must be reachable-shaped (https, non-empty path)
const emptyPath = all.filter(m => m.image_url && m.image_url.length < 40);
console.log(`suspiciously short image_url: ${emptyPath.length}`);

console.log(process.exitCode ? '\nSMOKE TEST FAILED' : '\nSmoke test OK.');
