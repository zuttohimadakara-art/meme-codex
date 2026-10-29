// Fix all mojibake in index.html and about.html.
// The file is UTF-8 encoded, but several characters were saved as their
// Latin-1 byte representation of the UTF-8 sequence. We replace those
// Latin-1-misdecoded strings with the correct single Unicode character.
const fs = require('fs');
const path = require('path');

const targets = ['index.html', 'about.html'];

// Map of broken-string -> correct character
const fixes = [
  // Ã— (0xC3 0x97) -> × (U+00D7)
  { from: 'Ã—', to: '×', label: 'multiplication sign (close button)' },
  // Â· (0xC2 0xB7) -> · (U+00B7)
  { from: 'Â·', to: '·', label: 'middle dot (footer separator)' },
  // Â© (0xC2 0xA9) -> © (U+00A9)
  { from: 'Â©', to: '©', label: 'copyright symbol' },
  // â€” (0xE2 0x80 0x94) -> — (U+2014)
  { from: 'â€"', to: '—', label: 'em dash' },
  // â†’ (0xE2 0x86 0x92) -> → (U+2192)
  { from: 'â†’', to: '→', label: 'rightwards arrow' },
  // â†— (0xE2 0x86 0x97) -> ↗ (U+2197)
  { from: 'â†—', to: '↗', label: 'north-east arrow' },
];

for (const f of targets) {
  let txt = fs.readFileSync(f, 'utf8');
  const before = txt;
  for (const { from, to, label } of fixes) {
    const count = (txt.match(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    if (count) {
      txt = txt.split(from).join(to);
      console.log(`  ${label}: ${count} replacement(s)`);
    }
  }
  if (txt === before) {
    console.log(`${f}: no changes needed`);
  } else {
    fs.writeFileSync(f, txt, 'utf8');
    console.log(`${f}: fixed and saved`);
  }
}
