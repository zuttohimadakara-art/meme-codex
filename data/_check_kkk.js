const t = require('fs').readFileSync('data/memes_intl.js', 'utf8');

// korean-kekeke block
{
  const start = t.indexOf('"id":"korean-kekeke"');
  const end = t.indexOf('"id":"baeksang-mask"');
  const block = t.slice(start, end);
  const matches = [...block.matchAll(/kkk/g)];
  console.log('korean-kekeke block: kkk count =', matches.length);
}

// kkkk-brazilian block
{
  const start = t.indexOf('"id":"kkkk-brazilian"');
  const end = t.indexOf('"id":"es-neta"');
  const block = t.slice(start, end);
  const matches = [...block.matchAll(/kkk/g)];
  console.log('kkkk-brazilian block: kkk count =', matches.length);
  if (matches.length) {
    for (const m of matches) {
      console.log('  at', m.index, 'ctx:', JSON.stringify(block.slice(Math.max(0, m.index - 30), m.index + 30)));
    }
  }
}

// hawk-tuah verification
const en = require('fs').readFileSync('data/memes_en.js', 'utf8');
console.log('');
console.log('hawk-tuah still has "raunchy catchphrase":', en.includes('raunchy catchphrase'));
console.log('hawk-tuah still has "original sexual context":', en.includes('original sexual context'));

// tide-pod-challenge
const tpStart = en.indexOf('"id":"tide-pod-challenge"');
const tpEnd = en.indexOf('"id":"subway-surfers-coffee"');
const tpBlock = en.slice(tpStart, tpEnd);
console.log('');
console.log('tide-pod-challenge has "Do not attempt":', tpBlock.includes('Do not attempt'));
console.log('tide-pod-challenge has "CPSC":', tpBlock.includes('CPSC') || tpBlock.includes('Consumer Product'));

// bone-smashing
const bsStart = en.indexOf('"id":"bone-smashing"');
const bsEnd = en.indexOf('"id":"charli-xcx-apple-dance"');
const bsBlock = en.slice(bsStart, bsEnd);
console.log('');
console.log('bone-smashing has "documentary, not an endorsement":', bsBlock.includes('documentary, not an endorsement'));

// andrew-tate-memes tag
const atStart = en.indexOf('"id":"andrew-tate-memes"');
const atEnd = en.indexOf('"id":"apple-vision-pro"');
const atBlock = en.slice(atStart, atEnd);
console.log('');
console.log('andrew-tate-memes still has misogyny tag:', atBlock.includes('"misogyny"'));
console.log('andrew-tate-memes has satire tag:', atBlock.includes('"satire"'));
