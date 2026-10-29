// Cron pass 3: append newly researched 2026 memes.
const fs = require('fs');

const NEW_EN = [
  {
    id: 'grr-mondays',
    name: 'Grr Mondays',
    year: 2026,
    era: 'Gen Z 2020-2026',
    origin_country: 'US',
    origin_platform: 'TikTok',
    category: 'audio_format',
    image_url: 'https://i.kym-cdn.com/entries/icons/original/000/057/498/gmoncover.jpg',
    short_desc: 'Hashtag built on a Ted 2 sperm-bank scene, used to mourn the start of the workweek.',
    origin_story: "Grr Mondays or #GrrrMondays comes from a scene in the 2015 comedy Ted 2, in which Mark Wahlberg's character John is covered in a handful of sperm samples at a sperm bank. Eleven years after the film's release the clip resurfaced on TikTok in September 2026, and creators paired the awkward line about posting it on Facebook with mundane Monday footage.",
    meaning: "Used as a Monday-morning complaint ritual. Creators caption boring Monday scenes with the Grr Mondays audio to signal dread of the workweek, usually tagging #GrrrMondays so the ritual is easy to follow.",
    peak_year: 2026,
    tags: ['monday', 'tiktok', 'ted-2', 'workweek', 'audio', '2026'],
  },
  {
    id: 'loki-walk-edits',
    name: 'Loki Walk Edits',
    year: 2026,
    era: 'Gen Z 2020-2026',
    origin_country: 'US',
    origin_platform: 'TikTok',
    category: 'video_format',
    image_url: 'https://i.kym-cdn.com/entries/icons/original/000/057/494/lokiwalkcover.jpg',
    short_desc: 'Remixes of Tom Hiddleston fighting the Loki Temporal Loom, used to show someone walking into a wall of wind.',
    origin_story: "Loki Walk Edits, also called Loki Temporal Loom Edits, are built on the season two finale scene where Tom Hiddleston pushes into the Temporal Loom as if fighting a storm. TikToker @grantt250 posted the format on September 9th, 2026, and within days the clip became the standard template for wind-blown walk comparisons across TikTok and Instagram.",
    meaning: "Used to depict someone walking into overwhelming pressure, a bad crowd, or a conversation they are enduring. The braced forward-lean reads as grim determination, so the same clip also works for declarations of intent.",
    peak_year: 2026,
    tags: ['loki', 'tiktok', 'temporal-loom', 'hiddleston', 'edit-template', '2026'],
  },
  {
    id: 'misery-girl',
    name: 'Misery Girl',
    year: 2026,
    era: 'Gen Z 2020-2026',
    origin_country: 'US',
    origin_platform: 'TikTok',
    category: 'slang',
    image_url: 'https://i.kym-cdn.com/entries/icons/original/000/057/329/mgirlcover.jpg',
    short_desc: "Mocking slang for alt, emo and goth girls, tied to the song 'Misery' by Pupsies.",
    origin_story: "Misery Girl is a TikTok meme that mocks girls with alt, emo and goth aesthetics, including heavy eyeliner, facial piercings and dyed hair, by pairing them with the song 'Misery' by Pupsies. The joke spread through TikTok in August 2026 via clips where the girls beg 'dada' to play the track, becoming one of the summer's stickiest alt-culture bits.",
    meaning: "Used as teasing shorthand between friends to describe someone's aesthetic shift, and ironically by alt girls themselves. The 'dada' begging clip became a reusable sound in edits and reaction posts well after the trend peaked.",
    peak_year: 2026,
    tags: ['alt', 'goth', 'misery-girls', 'tiktok', 'brainrot', '2026'],
  },
  {
    id: 'whispering-pigeon',
    name: 'Whispering Pigeon',
    year: 2026,
    era: 'Gen Z 2020-2026',
    origin_country: 'US',
    origin_platform: 'TikTok',
    category: 'character',
    image_url: 'https://i.kym-cdn.com/entries/icons/original/000/057/246/Screenshot_2026-08-05_112810.png',
    short_desc: 'Surreal AI-generated man-pigeon hybrid that softly asks viewers whether they have pooped yet.',
    origin_story: 'Whispering Pigeon is a brainrot character from TikTok user @peigengoo28 showing a blue bird-person hybrid quietly whispering absurd reminders, most famously asking whether the viewer has pooped. It debuted in May 2026 and spread wider over the summer after other creators mashed it with the Funky Ehh audio trend, turning the uncanny AI image into a reusable character.',
    meaning: "Deployed as low-effort absurdist commentary, usually captioned with the character's soft reminder. Because the source image is visibly AI-generated, it also works as a 'delusional internet' reaction all by itself.",
    peak_year: 2026,
    tags: ['brainrot', 'ai-generated', 'pigeon', 'tiktok', 'absurd', '2026'],
  },
  {
    id: 'neegy',
    name: 'Neegy',
    year: 2026,
    era: 'Gen Z 2020-2026',
    origin_country: 'US',
    origin_platform: 'TikTok',
    category: 'slang',
    image_url: 'https://i.kym-cdn.com/entries/icons/original/000/057/171/Neegy_meme_banner_image.jpg',
    short_desc: "Brainrot slang from a Fortnite voice-chat clip, used as a dismissive shutdown word.",
    origin_story: "Neegy, also spelled neegie, is a slang term and brainrot meme built around a viral Fortnite voice chat clip from July 2026 in which a kid gets angry and yells at someone to shut up, ending on the word 'neegy'. The clip is usually posted alongside a long-faced gold cartoon character circled in red, turning the audio into a repeatable catchphrase across TikTok.",
    meaning: "Used as a dismissive interjection to end an argument or abandon a conversation. Posting the clip reads as mock outrage, a 'please stop talking' reaction from someone losing patience with everyone at once.",
    peak_year: 2026,
    tags: ['brainrot', 'fortnite', 'slang', 'tiktok', 'voice-chat', '2026'],
  },
  {
    id: 'he-tryna-ignore-it',
    name: 'He Tryna Ignore It',
    year: 2026,
    era: 'Gen Z 2020-2026',
    origin_country: 'US',
    origin_platform: 'TikTok',
    category: 'image_macro',
    image_url: 'https://i.kym-cdn.com/entries/icons/original/000/056/878/hetrynaignoreitcover.jpg',
    short_desc: "Catchphrase paired with a calm white dog in front of a fire, meaning 'he is pretending not to notice'.",
    origin_story: 'He Tryna Ignore It is a 2026 catchphrase most commonly attached to a reaction image of a white dog sitting calmly with its eyes closed in front of a roaring fire. A second widely circulated version pairs the phrase with a screenshot of NBA superfan Jimmy Goldstein watching LeBron James. Both images sell the same performance of deliberate, aggressive obliviousness.',
    meaning: "Posted when someone is obviously aware of a problem but is visibly refusing to engage with it. Works for dodging drama, ignoring a bill, stepping over something dangerous, or letting a bad haircut pass without comment.",
    peak_year: 2026,
    tags: ['reaction', 'dog', 'catchphrase', 'tiktok', 'ignoring', '2026'],
  },
  {
    id: 'whats-your-favorite-cereal',
    name: "What's Your Favorite Cereal?",
    year: 2026,
    era: 'Gen Z 2020-2026',
    origin_country: 'US',
    origin_platform: 'TikTok',
    category: 'audio_format',
    image_url: 'https://i.kym-cdn.com/entries/icons/original/000/057/393/Screenshot_2026-09-02_153831.png',
    short_desc: 'Brainrot audio from a YSK Podcast host answering the cereal question with a long lip trill.',
    origin_story: "What's Your Favorite Cereal? is a TikTok brainrot meme built on a 2025 clip from the YSK Podcast, where a host answers the titular question by flapping his lips instead of naming a cereal. After sitting quietly for eight months the clip exploded in late August 2026, when @td_o_ stretched the trill across the whole video and passed a million views in about nine days.",
    meaning: 'Treated as a standalone instrument: editors stretch, pitch and layer the vibrating brrrr over helicopters, Kevin Hart clips and anything mechanical. On its own it reads as a nonsense reaction sound with no semantic content.',
    peak_year: 2026,
    tags: ['brainrot', 'audio', 'tiktok', 'lip-trill', 'podcast', '2026'],
  },
  {
    id: 'abuse-goblin',
    name: 'Abuse Goblin',
    year: 2026,
    era: 'Gen Z 2020-2026',
    origin_country: 'US',
    origin_platform: 'X / Twitter',
    category: 'character',
    image_url: 'https://i.kym-cdn.com/entries/icons/original/000/057/515/agoblincover.jpg',
    short_desc: 'Chained goblin webcomic character abused as a pressure-release outlet, spawning rescue-themed fan reactions.',
    origin_story: 'Abuse Goblin is a character from a series of webcomics by artist Foolibuster, also known as Vost, showing a goblin chained up and abused by a man in a green shirt and cargo shorts. The comics debuted on X in January 2026 as a deliberately low-stakes outlet for frustration, and quickly spawned a wave of fan art, redraws and rescue-themed reactions.',
    meaning: 'Used as a safe, fictional target when you need to complain about something you cannot actually change. The rescue edits add a sympathetic angle, turning the grievance gag into a small underdog story with a loyal fanbase.',
    peak_year: 2026,
    tags: ['webcomic', 'x-twitter', 'brainrot', 'relief', 'foolibuster', '2026'],
  },
  {
    id: 'wawario-wawaluigi',
    name: 'Wawario and Wawaluigi',
    year: 2026,
    era: 'Gen Z 2020-2026',
    origin_country: 'US',
    origin_platform: 'YouTube / TikTok / X',
    category: 'character',
    image_url: 'https://i.kym-cdn.com/entries/icons/original/000/057/476/wawariocover.jpg',
    short_desc: "Unofficial fan-made evil counterparts to Wario and Waluigi, revived in 2026 by a resurfaced song.",
    origin_story: "Wawario and Wawaluigi are fan characters created as rivals to Wario and Waluigi, who are themselves rivals to Mario and Luigi. Wawario is a large man with no eyes, a missing tooth, an orange hat and green overalls; Wawaluigi is a lanky, grotesque version in a blue shirt and black overalls. The designs date to 2015-2021, but a song resurged in 2026 and sent both to viral.",
    meaning: "Used as a 'forgotten deep-cut character' reaction and as proof of the Mario fandom's obsession with unofficial variants. Fan art keeps expanding the pair's backstory, rivalries and relative heights.",
    peak_year: 2026,
    tags: ['super-mario', 'fan-character', 'nintendo', 'tiktok', 'viral-song', '2026'],
  },
  {
    id: 'ai-viking-rap',
    name: 'AI Viking Rap',
    year: 2026,
    era: 'Gen Z 2020-2026',
    origin_country: 'US',
    origin_platform: 'TikTok / Spotify',
    category: 'audio_format',
    image_url: null,
    short_desc: "AI-generated Viking-themed hip-hop with invented artist personas, widely mocked as 'music slop'.",
    origin_story: 'AI Viking Rap, also called AI Viking Music Slop, refers to a style of AI-generated hip-hop and rap built around Viking and Norse mythology lyrics, imagery and fictional artist personas, typically tattooed muscular men or blonde women. The trend spread across TikTok, Spotify, Facebook and YouTube throughout 2026, drawing both genuine fans and a large mocking audience.',
    meaning: "Used as shorthand for the wave of low-cost AI-generated music flooding feeds. Sharing a track is often a bit, though some listeners engage seriously with the invented mythologies and backstories the songs lay down.",
    peak_year: 2026,
    tags: ['ai-music', 'viking', 'slop', 'tiktok', 'trend', '2026'],
  },
];

const NEW_INTL = [
  {
    id: 'france-jean-philanthrope',
    name: 'Jean Philanthrope / Jean Phil',
    year: 2026,
    era: 'Gen Z 2020-2026',
    origin_country: 'FR',
    origin_platform: 'TikTok / Instagram / X',
    category: 'character',
    image_url: 'https://i.kym-cdn.com/entries/icons/original/000/057/495/Jean_Philanthrope_banner_image.jpg',
    short_desc: 'Mysterious French persona with a blond bob and curled moustache, viral over whether he is real or AI.',
    origin_story: 'Jean Philanthrope, known as Jean Phil, is a French internet persona and character who emerged in mid-to-late September 2026 and went viral on TikTok, Instagram and X within days. Recognizable by a perfectly symmetrical blond bob, a curled moustache and formal suits, his shadowboxing videos sparked a large debate over whether he is a real person or an AI-generated character.',
    meaning: "Used as a reaction for dignified, mysterious behaviour, with Jean Phil comparisons standing in for lordly composure. The unresolved real-or-AI question became the meme's own punchline, since half the audience assumes he does not exist at all.",
    peak_year: 2026,
    tags: ['france', 'ai', 'persona', 'shadowboxing', 'tiktok', '2026'],
  },
  {
    id: 'japan-punch-the-monkey',
    name: 'Punch the Monkey (Ichikawa City Zoo)',
    year: 2026,
    era: 'Gen Z 2020-2026',
    origin_country: 'JP',
    origin_platform: 'Zoo footage / TikTok',
    category: 'character',
    image_url: 'https://i.kym-cdn.com/entries/icons/original/000/056/350/punchcover1.jpg',
    short_desc: 'Ichikawa City Zoo macaque raised by hand and filmed carrying a stuffed orangutan, now a local celebrity.',
    origin_story: 'Punch the Monkey is a macaque at the Ichikawa City Zoo near Tokyo who was abandoned by his mother and raised by hand by zookeepers. In early 2026 he was filmed clinging to a stuffed IKEA orangutan and the clip spread internationally. The zoo received so many international phone calls that staff began responding in Japanese only.',
    meaning: 'Used in Japan as a mascot-like symbol of local civic pride, complete with merchandise, fan art and a dedicated social account. Outside Japan the footage circulates as a wholesome-animal reaction image with no awareness of the local context.',
    peak_year: 2026,
    tags: ['japan', 'zoo', 'monkey', 'ichikawa', 'wholesome', '2026'],
  },
  {
    id: 'china-becoming-chinese',
    name: 'Becoming Chinese / Chinamaxxing',
    year: 2026,
    era: 'Gen Z 2020-2026',
    origin_country: 'CN',
    origin_platform: 'X / Twitter / TikTok',
    category: 'slang',
    image_url: 'https://i.kym-cdn.com/entries/icons/original/000/056/678/Screenshot_2026-04-16_160525.png',
    short_desc: "Western users performatively adopting Chinese culture, food and consumer habits as 'Chinamaxxing'.",
    origin_story: "Becoming Chinese, also called Chinamaxxing, traces back to an April 2025 X post parodying Fight Club's line 'you met me at a very strange time in my life' as 'you met me at a very Chinese time in my life.' It went wide in early 2026, especially after the second Trump administration's tariff wars and TikTok ban efforts, with users drinking Tsingtao, walking hands clasped behind their backs and eating congee.",
    meaning: 'Ranges from ironic performance to genuine enthusiasm for Chinese infrastructure, brands and lifestyle. The trend pushed back against stereotypes built on pandas and the Great Wall, and eventually drew an official welcoming response from the Chinese government.',
    peak_year: 2026,
    tags: ['china', 'chinamaxxing', 'gen-z', 'x-twitter', 'tiktok', '2026'],
  },
  {
    id: 'japan-akakichi-no-eleven-redraws',
    name: 'Akakichi no Eleven Redraws',
    year: 2026,
    era: 'Gen Z 2020-2026',
    origin_country: 'JP',
    origin_platform: 'Anime redraws / X',
    category: 'template',
    image_url: 'https://i.kym-cdn.com/entries/icons/original/000/047/907/GDao2PaXIAA5Aq3.jpg',
    short_desc: 'Redraw template using a frame of a large-chinned man from the 1970s soccer anime Akakichi no Eleven.',
    origin_story: 'Akakichi no Eleven Redraws, also called Man Putting Hand On Shoulder, come from a single frame in the 1970s soccer anime Akakichi no Eleven showing a large-chinned man placing a hand on someone\'s shoulder. The still is reused as a reaction image and as a blank canvas, with creators redrawing new characters, outfits and scenarios onto the same distinctive silhouette.',
    meaning: 'Used to show reassurance, pride, or an ominous pat delivered just before something difficult happens. The chin silhouette is the whole joke, so the redraw can be completely absurd as long as the pose still reads.',
    peak_year: 2026,
    tags: ['japan', 'anime', 'redraw', 'template', 'reaction', 'akakichi-no-eleven'],
  },
  {
    id: 'brazil-caramelo-pride',
    name: 'Caramelo Pride',
    year: 2026,
    era: 'Gen Z 2020-2026',
    origin_country: 'BR',
    origin_platform: 'Instagram / TikTok',
    category: 'event',
    image_url: null,
    short_desc: "Brazilian celebration of caramel-coloured street mutts, now a global symbol of Brazilian identity.",
    origin_story: 'Caramelo Pride refers to a widespread Brazilian celebration of caramel-coloured street dogs and cats, which have become an unofficial symbol of the country. Its roots trace to 2023, when Brazilcore carried Brazilian colours and culture globally, and the trend has since grown alongside a larger wave of brasilidade in fashion, music, cinema and sport.',
    meaning: 'Originally a statement by street feeders claiming overlooked animals as their own, it has been absorbed into mainstream Brazilian self-promotion. Abroad, celebrities wearing green and yellow now use it as shorthand for Brazilianness in a single word.',
    peak_year: 2026,
    tags: ['brazil', 'caramelo', 'street-animals', 'brazilcore', 'brasilidade', '2026'],
  },
];

const FIELDS = [
  'id', 'name', 'year', 'era', 'origin_country', 'origin_platform',
  'category', 'image_url', 'short_desc', 'origin_story', 'meaning',
  'peak_year', 'tags',
];

function load(file, globalName) {
  const src = fs.readFileSync(file, 'utf8');
  const m = src.match(new RegExp('window\\.' + globalName + '\\s*=\\s*(\\[[\\s\\S]*?\\]);'));
  if (!m) throw new Error('no array found in ' + file);
  return JSON.parse(m[1]);
}

function serialize(arr, globalName) {
  const lines = arr.map((e) => '  ' + JSON.stringify(e));
  return 'window.' + globalName + ' = [\n' + lines.join(',\n') + '\n];\n';
}

function merge(file, globalName, additions, label) {
  const existing = load(file, globalName);
  const seen = new Set(existing.map((e) => e.id));
  const fresh = [];
  const skipped = [];

  for (const e of additions) {
    if (seen.has(e.id)) {
      skipped.push(e.id);
      continue;
    }
    const ordered = {};
    for (const f of FIELDS) {
      if (!(f in e)) throw new Error(e.id + ' missing field ' + f);
      ordered[f] = e[f];
    }
    seen.add(e.id);
    fresh.push(ordered);
  }

  if (fresh.length) {
    fs.writeFileSync(file, serialize(existing.concat(fresh), globalName), 'utf8');
  }

  console.log(label + ': +' + fresh.length + ' (total ' + (existing.length + fresh.length) + ')'
    + (skipped.length ? ' | skipped dup: ' + skipped.join(', ') : ''));
  return fresh.length;
}

const n1 = merge('data/memes_en.js', 'MEMES_EN', NEW_EN, 'memes_en');
const n2 = merge('data/memes_intl.js', 'MEMES_INTL', NEW_INTL, 'memes_intl');
console.log('TOTAL ADDED: ' + (n1 + n2));
