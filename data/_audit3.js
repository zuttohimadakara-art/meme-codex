const fs = require('fs');
const path = require('path');

const TARGET_IDS = [
  'tide-pod-challenge', 'hawk-tuah', 'korean-kkk', 'coquette-bow',
  'mexico-orale-vale', 'india-vada-chennai-dhanush', 'india-soorari-pottru',
  'korea-kpop-stan-twitter', 'korea-running-man-bell', 'korea-knowing-bros',
  'korea-squid-game-guard', 'korea-kim-chaewon-leap-high',
  'japan-touhou-reimu', 'japan-hatsune-miku', 'japan-vtuber-hololive',
  'japan-kagurabachi', 'japan-chainsaw-man-power', 'china-lao-wang',
  'china-douyin-trend', 'china-erciyuan-erta', 'china-wanghong-meme',
  'russia-gopnik-squat', 'france-balek', 'italy-mamma-mia',
  'germany-ja-klar', 'nigeria-e-no-easy', 'haw', 'korea',
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
      console.log(`tags: ${obj.tags.join(', ')}`);
      console.log(`short_desc: ${obj.short_desc}`);
      console.log(`origin_story: ${obj.origin_story}`);
      console.log(`meaning: ${obj.meaning}`);
    }
  }
}
