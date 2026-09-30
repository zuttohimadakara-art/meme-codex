const fs = require('fs');
const t = fs.readFileSync('index.html', 'utf8');
const title = t.match(/<title>([^<]+)<\/title>/)[1];
const close = t.match(/close-x">([^<]+)</)[1];
const heroSub = t.match(/class="hero-sub">([^<]+)</)[1];
const footer = t.match(/footer-base">([\s\S]+?)<\/div>/)[1].trim();

console.log('Title:    ', JSON.stringify(title));
console.log('Close:    ', JSON.stringify(close), '(char codes:', [...close].map(c => 'U+' + c.charCodeAt(0).toString(16)).join(' '), ')');
console.log('Hero sub: ', JSON.stringify(heroSub));
console.log('Footer:   ', JSON.stringify(footer));
