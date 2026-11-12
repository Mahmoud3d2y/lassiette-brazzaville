// Static site generator: zero dependencies. `node src/build.mjs [--watch]`
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, watch, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const json = (p) => JSON.parse(read(p));

async function build() {
  const started = Date.now();
  const site = json('src/data/site.json');
  const menu = json('src/data/menu.json');
  const images = json('src/data/images.generated.json');
  const i18n = Object.fromEntries(site.langs.map((l) => [l, json(`src/i18n/${l}.json`)]));
  const css = read('src/styles/main.css');
  const js = read('src/js/main.js');
  const version = createHash('md5').update(css + js).digest('hex').slice(0, 8);

  // Fresh import each build so --watch picks up template edits.
  const bust = `?t=${Date.now()}`;
  const pages = {
    home: (await import(`./pages/home.mjs${bust}`)).default,
    menu: (await import(`./pages/menu.mjs${bust}`)).default,
    about: (await import(`./pages/about.mjs${bust}`)).default,
    gallery: (await import(`./pages/gallery.mjs${bust}`)).default,
    contact: (await import(`./pages/contact.mjs${bust}`)).default,
    notFound: (await import(`./pages/not-found.mjs${bust}`)).default,
  };
  const { layout } = await import(`./partials/layout.mjs${bust}`);
  const lib = await import(`./lib.mjs${bust}`);

  rmSync(DIST, { recursive: true, force: true });
  mkdirSync(DIST, { recursive: true });
  cpSync(join(ROOT, 'public'), DIST, { recursive: true });
  mkdirSync(join(DIST, 'assets'), { recursive: true });
  writeFileSync(join(DIST, 'assets/main.css'), css);
  writeFileSync(join(DIST, 'assets/main.js'), js);

  const urls = [];
  for (const lang of site.langs) {
    const t = i18n[lang];
    const ctx = {
      lang, t, site, menu, images, i18n, langs: site.langs, version, lib,
      url: (key, l = lang) => {
        const slug = i18n[l].pages[key]?.slug;
        if (key === 'notFound') return `/${l}/`;
        return `/${l}/` + (slug ? `${slug}/` : '');
      },
      img: (slug, opts = {}) => lib.img(images, slug, { lang, ...opts }),
      icon: lib.icon,
    };
    for (const key of Object.keys(pages)) {
      const { body, ...rest } = pages[key](ctx);
      const html = layout(ctx, { key, body, ...rest });
      const out = key === 'notFound' ? join(DIST, lang, '404.html') : join(DIST, ctx.url(key), 'index.html');
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, html);
      if (key !== 'notFound') urls.push({ loc: site.url + ctx.url(key), key, lang });
    }
  }

  // Root redirect (server-side rules also exist in netlify.toml / vercel.json).
  writeFileSync(join(DIST, 'index.html'), rootRedirect(site));
  // Top-level 404 falls back to the default language version.
  cpSync(join(DIST, site.defaultLang, '404.html'), join(DIST, '404.html'));

  // Sitemap with hreflang alternates.
  const byKey = {};
  for (const u of urls) (byKey[u.key] ??= []).push(u);
  const sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n` +
      byKey[u.key].map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.loc}"/>`).join('\n') +
      `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${byKey[u.key].find((a) => a.lang === site.defaultLang).loc}"/>\n  </url>`).join('\n') +
    `\n</urlset>\n`;
  writeFileSync(join(DIST, 'sitemap.xml'), sm);
  writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

  console.log(`Built ${urls.length} pages in ${Date.now() - started} ms → dist/`);
}

function rootRedirect(site) {
  const def = site.defaultLang;
  const others = site.langs.filter((l) => l !== def);
  return `<!DOCTYPE html>
<html lang="${def}">
<head>
<meta charset="utf-8">
<title>${site.legalName}</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${site.url}/${def}/">
<meta http-equiv="refresh" content="0; url=/${def}/">
<script>
(function(){
  var langs=${JSON.stringify(site.langs)}, def=${JSON.stringify(def)};
  var saved=null; try { saved = localStorage.getItem('lang'); } catch(e){}
  var nav=(navigator.languages&&navigator.languages[0]||navigator.language||def).slice(0,2).toLowerCase();
  var pick = langs.indexOf(saved)>-1 ? saved : (langs.indexOf(nav)>-1 ? nav : def);
  location.replace('/'+pick+'/');
})();
</script>
</head>
<body><p><a href="/${def}/">${site.legalName}</a>${others.map((l) => ` · <a href="/${l}/" lang="${l}">${l.toUpperCase()}</a>`).join('')}</p></body>
</html>
`;
}

await build();

if (process.argv.includes('--watch')) {
  let timer;
  const trigger = (evt, file) => {
    if (file && /\.generated\.json$/.test(file)) return;
    clearTimeout(timer);
    timer = setTimeout(() => build().catch((e) => console.error(e)), 120);
  };
  watch(SRC, { recursive: true }, trigger);
  watch(join(ROOT, 'public'), { recursive: true }, trigger);
  console.log('Watching src/ and public/ for changes…');
}
