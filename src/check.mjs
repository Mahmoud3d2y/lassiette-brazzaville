// QA: broken internal links, missing alt text, SEO basics, JSON-LD validity. `node src/check.mjs`
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));
const problems = [];
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const pages = walk(DIST).filter((p) => p.endsWith('.html'));

const resolve = (href) => {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean.startsWith('/')) return true;
  const p = join(DIST, clean);
  if (!existsSync(p)) return false;
  return statSync(p).isDirectory() ? existsSync(join(p, 'index.html')) : true;
};

for (const file of pages) {
  const rel = relative(DIST, file);
  const html = readFileSync(file, 'utf8');
  const note = (m) => problems.push(`${rel}: ${m}`);
  if (rel === 'index.html') continue; // root redirect page
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) note(`expected 1 <h1>, found ${h1}`);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) note('missing or short <title>');
  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) note('missing or short meta description');
  if (!/<html lang="(fr|en)"/.test(html)) note('missing html lang');
  if (!rel.includes('404') && (html.match(/hreflang="/g) || []).length < 3) note('missing hreflang alternates');
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(m[0])) note(`img without alt: ${m[0].slice(0, 80)}`);
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) if (!resolve(m[1])) note(`broken link: ${m[1]}`);
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) for (const part of m[1].split(',')) { const u = part.trim().split(' ')[0]; if (!resolve(u)) note(`broken srcset: ${u}`); }
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch { note('invalid JSON-LD'); } }
  for (const bad of ['undefined', '[object Object]', 'NaN FCFA', '{{']) if (html.includes(bad)) note(`suspicious text "${bad}"`);
  const titleLen = html.match(/<title>([^<]+)<\/title>/)?.[1].length ?? 0;
  if (titleLen > 70) note(`title is ${titleLen} chars (aim ≤ 60–70)`);
}

if (problems.length) { console.error(problems.join('\n')); console.error(`\n${problems.length} problem(s) in ${pages.length} pages`); process.exit(1); }
console.log(`OK: ${pages.length} HTML files checked, no broken links, all images have alt, SEO basics present.`);
