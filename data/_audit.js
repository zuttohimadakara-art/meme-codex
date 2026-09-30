// Audit: extract specific meme entries by ID for AdSense policy review
const fs = require('fs');
const path = require('path');

const TARGET_IDS = [
  'tide-pod-challenge', 'bone-smashing', 'hawk-tuah', 'korean-kkk', 'soyjak-wojak',
  'andrew-tate-memes', 'trump-tariff-formula', 'germany-ja-klar', 'sigma-male',
  'gigachad', 'sigma-grindset', 'negative-aura', 'skibidi-toilet', 'skibidi-rizz',
  'stadium-emoji', 'liam-no-last-name', 'charli-xcx-apple-dance', 'stan-wars',
  'bird-box-challenge', 'subway-surfers-coffee', 'real-housewives-memes',
  'selling-sunset-memes', 'andrew-tate-memes', 'mob-wife-aesthetic',
  'korea-kpop-stan-twitter', 'bombardino-crocodilo', 'ballerina-cappuccina',
  'tralalero-tralalala', 'tung-tung-tung-sahur', 'coquette-aesthetic',
  'italian-brainrot-trend', 'kawaii-metal', 'japan-hatsune-miku',
  'japan-yamete-kudasai', 'japan-yabai', 'germany-quatsch', 'germany-ey-ey-ey',
  'italy-ciao-bella', 'italy-magari', 'russia-gopnik-squat', 'france-wesh',
  'mexico-no-manches', 'brazil-bonde-do-tigrao', 'korea-jal-meokgetda',
  'korea-daebak', 'philippines-arat-na', 'philippines-luhod',
  'philippines-hugot', 'india-baahubali-memes', 'india-kgf-rocky-bhai',
  'india-srk-arms-pose', 'nigeria-wahala-dey', 'germany-vong-stern',
  'boris-medvedev-bear', 'russia-brat', 'russia-babushka-meme',
  'russian-dashcam', 'natasha-we-dropped', 'kuso-2ch', 'iya-sigh',
  'brazil-malandramente', 'brazil-bbb-bia', 'colombia-parce',
  'brazil-eu-sou-a-lenda', 'brazil-whindersson-nunes', 'brazil-bonde-do-tigrao',
  'mexico-orale-vale', 'mexico-polemica', 'mexico-chido',
  'chile-cachai', 'argentina-boludo', 'venezuela-chamo', 'peru-causa'
];

for (const file of ['memes_en.js', 'memes_intl.js']) {
  const txt = fs.readFileSync(path.join('data', file), 'utf8');
  // Find all entries via ID -> JSON object
  const re = /\{"id":"([^"]+)"[\s\S]*?\}/g;
  let m;
  while ((m = re.exec(txt)) !== null) {
    if (TARGET_IDS.includes(m[1])) {
      // Print the whole entry
      const obj = JSON.parse(m[0]);
      console.log(`\n=== ${obj.id} (${file}) ===`);
      console.log(`name: ${obj.name}`);
      console.log(`category: ${obj.category}`);
      console.log(`tags: ${obj.tags.join(', ')}`);
      console.log(`short_desc: ${obj.short_desc}`);
      console.log(`origin_story: ${obj.origin_story.substring(0, 250)}...`);
      console.log(`meaning: ${obj.meaning.substring(0, 200)}...`);
    }
  }
}
