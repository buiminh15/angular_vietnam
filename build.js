// Gom Day002..Day048 (.md) thành js/content.js và copy ảnh được tham chiếu.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), out = path.join(__dirname);
const files = fs.readdirSync(root).filter(f => /^Day0(0[2-9]|[1-3]\d|4[0-8])-/.test(f)).sort();
const days = {}; const imgs = new Set();
for (const f of files) {
  const n = parseInt(f.slice(3, 6), 10);
  let md = fs.readFileSync(path.join(root, f), 'utf8');
  md = md.replace(/!\[([^\]]*)\]\(\.?\/?(assets\/[^)\s]+)([^)]*)\)/g, (m, alt, p, rest) => { imgs.add(decodeURI(p)); return `![${alt}](${p}${rest})`; });
  md = md.replace(/src="\.?\/?(assets\/[^"]+)"/g, (m, p) => { imgs.add(decodeURI(p)); return `src="${p}"`; });
  days[n] = md;
}
fs.writeFileSync(path.join(out, 'js/content.js'), 'window.DAYS_MD = ' + JSON.stringify(days) + ';');
let copied = 0, missing = [];
for (const p of imgs) {
  const s = path.join(root, p), d = path.join(out, p);
  if (!fs.existsSync(s)) { missing.push(p); continue; }
  fs.mkdirSync(path.dirname(d), { recursive: true }); fs.copyFileSync(s, d); copied++;
}
console.log(Object.keys(days).length, 'days;', copied, 'images;', 'missing:', missing);
