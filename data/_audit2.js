// Quick dump of specific meme entries
const fs = require('fs');
const path = require('path');

const TARGET_IDS = [
  'korean-kkk', 'subway-surfers-coffee', 'germany-vong-stern',
  'kuso-2ch', 'boris-medvedev-bear', 'russian-dashcam',
  'japan-yamete-kudasai', 'japan-yabai', 'japan-genki-desu-ka',
  'korea-jal-meokgetda', 'india-bajrangi-bhaijaan', 'nigeria-wahala-dey',
  'russia-brat', 'russia-babushka-meme', 'natasha-we-dropped',
  'france-wesh', 'brazil-bonde-do-tigrao', 'mexico-chido',
  'kawaii-metal', 'germany-ey-ey-ey', 'france-oh-la-la',
  'argentina-boludo', 'korea-kimbap-meme'
];

for (const file of ['memes_en.js', 'memes_intl.js']) {
  const txt = fs.readFileSync(path.join('data', file), 'utf8');
  const re = /\{"id":"([^"]+)"[\s\S]*?\}/g;
  let m;
  while ((m = re.exec(txt)) !== null) {
    if (TARGET_IDS.includes(m[1])) {
      const obj = JSON.parse(m[0]);
      console.log(`\n=== ${obj.id} (${file}) ===`);
      console.log(`name: ${obj.name}`);
      console.log(`category: ${obj.category}`);
      console.log(`tags: ${obj.tags.join(', ')}`);
      console.log(`short_desc: ${obj.short_desc}`);
      console.log(`origin_story: ${obj.origin_story}`);
      console.log(`meaning: ${obj.meaning}`);
    }
  }
}
