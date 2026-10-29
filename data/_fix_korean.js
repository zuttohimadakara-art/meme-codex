// Fix the korean-kekeke entry with proper UTF-8 Korean characters
const fs = require('fs');
const path = require('path');
const file = path.join('data', 'memes_intl.js');
let txt = fs.readFileSync(file, 'utf8');

// Build the proper entry with the actual Korean character ㅋ (U+314B)
const ke = 'ã…‹'; // HANGUL LETTER KIYEOK as it appears in the file's encoding
const giyeok = 'ã„±';
const newEntry = `  {"id":"korean-kekeke","name":"${ke}${ke}${ke} (Korean kekeke laugh)","year":2003,"era":"Classic Web 2007-2012","origin_country":"KR","origin_platform":"Daum / Nateon messenger","category":"slang","image_url":null,"short_desc":"Korean keyboard character ${ke} repeated as the 'laughing out loud' of Korean chat.","origin_story":"The Hangul character ${giyeok} (giyeok) has a 'k' sound; multiple ${ke} stacked is the Korean equivalent of 'lol' or 'haha.' Daum and early Natepang messengers could not transmit English 'ha's easily with older Hangul input methods, so the keke-ke (kekeke) format became universal. The 'ke' syllable became the canonical Korean 'lol' in the same era that 'haha' was spreading in English chatrooms.","meaning":"Pure textual laughter in Korean web culture. Its derivatives (${ke}${ke}${ke}${ke}, ${ke}${ke}${ke}${ke}${ke}) plus the rarer hhhh (hahaha) form the typographic backbone of Korean netizen expression; pre-dates 'lol' adoption by years.","peak_year":2010,"tags":["korea","hangul","laugh","kekeke","slang","daum"]},`;

// Find the existing (corrupted) entry and replace it
const re = /\s*\{"id":"korean-kekeke"[\s\S]*?\},\n/;
const newTxt = txt.replace(re, '\n' + newEntry + '\n');

if (newTxt === txt) {
  console.error('No replacement made — pattern not found');
  process.exit(1);
}

fs.writeFileSync(file, newTxt, 'utf8');
console.log('Korean entry fixed.');

// Verify
const verify = fs.readFileSync(file, 'utf8');
const ok = verify.includes('"id":"korean-kekeke"') &&
           !verify.match(/"id":"korean-kkk"/);
console.log('Verification (id is korean-kekeke, no korean-kkk remains):', ok);
