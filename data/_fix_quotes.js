// Final cleanup of the leftover Latin-1 mojibake characters "â" and "€"
// that sit right before em-dashes and en-dashes. Use char codes to
// avoid any source-file encoding confusion.
const fs = require('fs');

const AH_CIRCUMFLEX = '\u00e2'; // â
const EURO = '\u20ac';          // €
const EM_DASH = '\u2014';       // —
const EN_DASH = '\u2013';       // –

const targets = ['index.html', 'about.html'];

for (const f of targets) {
  let txt = fs.readFileSync(f, 'utf8');
  const before = txt;
  txt = txt.split(AH_CIRCUMFLEX + EURO + EM_DASH).join(EM_DASH);
  txt = txt.split(AH_CIRCUMFLEX + EURO + EN_DASH).join(EN_DASH);
  // "â€¦" (â + € + broken-bar ¦) -> "…" (horizontal ellipsis)
  txt = txt.split(AH_CIRCUMFLEX + EURO + '\u00a6').join('\u2026');
  if (txt === before) {
    console.log(`${f}: no changes`);
  } else {
    fs.writeFileSync(f, txt, 'utf8');
    const diff = before.length - txt.length;
    console.log(`${f}: cleaned, removed ${diff} stray characters`);
  }
}
