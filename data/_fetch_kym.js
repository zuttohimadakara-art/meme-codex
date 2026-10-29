// Temp helper: scrape KYM og:image (direct CDN url) for a list of slugs.
const https = require('https');

const slugs = process.argv.slice(2);

function get(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(get(res.headers.location));
      }
      let body = '';
      res.on('data', (d) => (body += d));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', (e) => resolve({ status: 0, body: '', err: String(e) }));
  });
}

(async () => {
  for (const slug of slugs) {
    const r = await get('https://knowyourmeme.com/memes/' + slug);
    const m = /<meta property='og:image' content='(https:\/\/i\.kym-cdn\.com\/entries\/icons\/original\/[^']+)'/.exec(r.body);
    const d = /<meta name='description' content='([^']+)'/.exec(r.body);
    const t = /<title>\s*([^<]+?)\s*<\/title>/.exec(r.body);
    console.log(JSON.stringify({
      slug,
      status: r.status,
      title: t ? t[1] : null,
      img: m ? m[1] : null,
      desc: d ? d[1].slice(0, 300) : null,
    }));
  }
})();
