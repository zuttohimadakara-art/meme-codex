// Find mojibake patterns in the source files.
// A "Latin-1 reading of UTF-8" looks like:
//   "×" (U+00D7, UTF-8: C3 97) -> "Ã—" (Ã=0xC3, —=0x97)
//   "·" (U+00B7, UTF-8: C2 B7) -> "Â·" (Â=0xC2, ·=0xB7)
//   "→" (U+2192, UTF-8: E2 86 92) -> "â†'" (â=0xE2, †=0x86, '=0x92)
//   "—" (U+2014, UTF-8: E2 80 94) -> "â€"" (â=0xE2, €=0x80, "=0x94)
const fs = require('fs');
const path = require('path');

const files = [
  'index.html', 'about.html', 'app.js', 'style.css',
  'og-image.svg', 'sitemap.xml', 'robots.txt', '404.html',
  'CNAME', 'ads.txt'
];

const mojibakeRe = /[\u00c2\u00c3\u00e2][\u0080-\u00bf\u0080-\u00bf]/g;

for (const f of files) {
  try {
    const txt = fs.readFileSync(f, 'utf8');
    const matches = [...txt.matchAll(mojibakeRe)];
    if (matches.length) {
      console.log(`\n${f}: ${matches.length} mojibake hits`);
      for (const m of matches.slice(0, 5)) {
        const lineStart = txt.lastIndexOf('\n', m.index) + 1;
        const lineEnd = txt.indexOf('\n', m.index);
        const line = txt.slice(lineStart, lineEnd);
        const lineNum = txt.slice(0, m.index).split('\n').length;
        console.log(`  L${lineNum}: ${m[0]?.replace(/[\u00c2\u00c3\u00e2][\u0080-\u00bf\u0080-\u00bf]/g, '?')?.padEnd(6)}  ${line.trim().substring(0, 120)}`);
      }
      if (matches.length > 5) console.log(`  ... and ${matches.length - 5} more`);
    } else {
      console.log(`${f}: clean`);
    }
  } catch (e) {
    console.log(`${f}: ${e.message}`);
  }
}
