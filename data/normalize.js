const fs = require('fs');

function loadArray(p) {
  const t = fs.readFileSync(p, 'utf8');
  const m = t.match(/=\s*(\[.*\])\s*;?\s*$/s);
  if (!m) throw new Error('bad');
  return JSON.parse(m[1]);
}

function save(p, varName, items) {
  const body = JSON.stringify(items, null, 2);
  const indented = '[\n' + items.map(m => '  ' + JSON.stringify(m)).join(',\n') + '\n]';
  const out = `/* Meme data — ${varName}. */\nwindow.${varName} = ${indented};\n`;
  fs.writeFileSync(p, out, 'utf8');
}

const aliases = {
  'Peak Web 2013-2017': 'Peak 2012-2017',
  'Post-Irony 2018-2022': 'Post-Irony 2017-2020',
};

function normalize(arr) {
  let changed = 0;
  arr.forEach(m => {
    if (aliases[m.era]) {
      m.era = aliases[m.era];
      changed++;
    }
  });
  return changed;
}

const en = loadArray('memes_en.js');
const intl = loadArray('memes_intl.js');
const enChanged = normalize(en);
const intlChanged = normalize(intl);
console.log('Era fields fixed: EN=' + enChanged + ', Intl=' + intlChanged);

save('memes_en.js', 'MEMES_EN', en);
save('memes_intl.js', 'MEMES_INTL', intl);
console.log('Saved normalized files.');
