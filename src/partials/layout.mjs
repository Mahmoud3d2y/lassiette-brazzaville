import { esc, attr, typo, icon, waLink, wordmark } from '../lib.mjs';

export function layout(ctx, { key, body, extraHead = '', bodyClass = '', jsonLd = [] }) {
  const { t, lang, site, langs } = ctx;
  const page = t.pages[key];
  const is404 = key === 'notFound';
  const canonical = site.url + ctx.url(key, lang);
  const alternates = is404 ? '' : langs.map((l) => `<link rel="alternate" hreflang="${l}" href="${site.url}${ctx.url(key, l)}">`).join('\n  ') +
    `\n  <link rel="alternate" hreflang="x-default" href="${site.url}${ctx.url(key, site.defaultLang)}">`;
  const ogImg = ctx.images[site.ogImage];
  const ogW = ogImg.widths.includes(1200) ? 1200 : ogImg.widths[ogImg.widths.length - 1];
  const ld = [restaurantLd(ctx), ...jsonLd];

  return `<!DOCTYPE html>
<html lang="${lang}" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${attr(page.description)}">
  ${is404 ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
  ${alternates}
  <meta name="theme-color" content="#FFFFFF">
  <meta name="color-scheme" content="light">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${attr(site.legalName)}">
  <meta property="og:locale" content="${t.locale}">
  ${langs.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${ctx.i18n[l].locale}">`).join('\n  ')}
  <meta property="og:title" content="${attr(page.title)}">
  <meta property="og:description" content="${attr(page.description)}">
  ${is404 ? '' : `<meta property="og:url" content="${canonical}">`}
  <meta property="og:image" content="${site.url}/img/${site.ogImage}-${ogW}.webp">
  <meta property="og:image:width" content="${ogW}">
  <meta property="og:image:height" content="${Math.round(ogW / ogImg.ratio)}">
  <meta property="og:image:alt" content="${attr(ogImg.alt[lang])}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${attr(page.title)}">
  <meta name="twitter:description" content="${attr(page.description)}">
  <meta name="twitter:image" content="${site.url}/img/${site.ogImage}-${ogW}.webp">
  <link rel="preload" href="/fonts/bodoni-moda-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/main.css?v=${ctx.version}">
  <script type="application/ld+json">${JSON.stringify(ld.length === 1 ? ld[0] : ld)}</script>
  ${extraHead}
</head>
<body class="${attr(bodyClass)}${key === 'contact' ? '' : ' has-action-bar'}" data-lang="${lang}" data-page="${key}">
  <a class="skip-link" href="#main">${esc(t.skip)}</a>
  ${header(ctx, key)}
  <main id="main" tabindex="-1">
${body}
  </main>
  ${footer(ctx, key)}
  ${key === 'contact' ? '' : `<nav class="action-bar" aria-label="${lang === 'fr' ? 'Actions rapides' : 'Quick actions'}" data-action-bar>
    <a href="${ctx.url('contact')}">${esc(t.actionBar.reserve)}</a>
    <a href="${waLink(site.whatsapp, t.contact.whatsappMessage)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${esc(t.actionBar.whatsapp)}</span></a>
  </nav>`}
  <script src="/assets/main.js?v=${ctx.version}" defer></script>
</body>
</html>
`;
}

function langSwitch(ctx, key, cls = '') {
  const { lang, langs } = ctx;
  const links = langs.map((l) => `<a class="lang__link" href="${ctx.url(key, l)}" lang="${l}" hreflang="${l}" data-lang-switch="${l}"${l === lang ? ' aria-current="true"' : ''} title="${attr(ctx.i18n[l].langName)}">${l.toUpperCase()}</a>`)
    .join('<span class="lang__sep" aria-hidden="true">/</span>');
  return `<div class="lang${cls ? ' ' + cls : ''}" aria-label="${attr(ctx.t.nav.langSwitch)}">${links}</div>`;
}

function header(ctx, key) {
  const { t, lang, site } = ctx;
  const items = ['home', 'menu', 'about', 'gallery', 'contact'];
  const nav = items.map((k) => `<li><a class="nav__link" href="${ctx.url(k)}"${k === key ? ' aria-current="page"' : ''}>${esc(t.nav[k])}</a></li>`).join('\n          ');

  return `<header class="site-header" data-header>
    <div class="container site-header__inner">
      <a class="brand" href="${ctx.url('home')}">
        ${wordmark(site, { cls: 'wordmark--row' })}
        <span class="visually-hidden">${esc(t.common.brandHome)}</span>
      </a>
      <nav class="nav" id="site-nav" aria-label="${lang === 'fr' ? 'Navigation principale' : 'Main navigation'}" data-nav>
        <ul class="nav__list">
          ${nav}
        </ul>
        <div class="nav__extras">
          ${langSwitch(ctx, key)}
          <a class="btn btn--primary" href="${ctx.url('contact')}">${esc(t.nav.reserve)}</a>
          <a class="btn btn--whatsapp" href="${waLink(site.whatsapp, t.contact.whatsappMessage)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${esc(t.common.whatsapp)}</span></a>
        </div>
      </nav>
      <div class="site-header__actions">
        ${langSwitch(ctx, key, 'lang--header')}
        <a class="btn btn--icon site-header__social" href="${site.social.instagram.url}" target="_blank" rel="noopener" aria-label="${esc(t.common.instagram)}">${icon('instagram')}</a>
        <a class="btn btn--primary btn--sm site-header__cta" href="${ctx.url('contact')}">${esc(t.nav.reserve)}</a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
          <span class="nav-toggle__label" data-label-open>${esc(t.nav.openMenu)}</span>
          <span class="nav-toggle__label" data-label-close hidden>${esc(t.nav.closeMenu)}</span>
          ${icon('menu', 'nav-toggle__open')}${icon('close', 'nav-toggle__close')}
        </button>
      </div>
    </div>
  </header>`;
}

function footer(ctx, key) {
  const { t, lang, site, langs } = ctx;
  const a = site.address;
  const explore = ['menu', 'about', 'gallery', 'contact'].map((k) => `<li><a href="${ctx.url(k)}">${esc(t.nav[k])}</a></li>`).join('');
  const phones = site.phones.map((p) => `<li><a href="tel:${p.e164}">${esc(p.display)}</a></li>`).join('');
  const langLinks = langs.map((l) => `<a href="${ctx.url(key, l)}" lang="${l}" hreflang="${l}" data-lang-switch="${l}"${l === lang ? ' aria-current="true"' : ''}>${esc(ctx.i18n[l].langName)}</a>`).join(' <span aria-hidden="true">·</span> ');
  return `<footer class="site-footer">
    <div class="container site-footer__grid">
      <div class="site-footer__brand">
        <p class="brand brand--footer">${wordmark(site, { cls: 'wordmark--row' })}</p>
        <p class="site-footer__tagline">${esc(t.footer.tagline)}</p>
        <p class="site-footer__hours">${icon('clock')}<span>${esc(t.footer.hours)}</span></p>
      </div>
      <nav class="site-footer__col" aria-label="${esc(t.footer.explore)}">
        <h2 class="site-footer__title">${esc(t.footer.explore)}</h2>
        <ul>${explore}</ul>
      </nav>
      <div class="site-footer__col">
        <h2 class="site-footer__title">${esc(t.footer.contact)}</h2>
        <address>
          <p>${esc(a.street)}<br>${esc(a.district[lang])}, ${esc(a.city)}<br>${esc(a.country[lang])}</p>
          <ul>${phones}<li><a href="mailto:${site.email}">${esc(site.email)}</a></li></ul>
        </address>
      </div>
      <div class="site-footer__col">
        <h2 class="site-footer__title">${esc(t.footer.follow)}</h2>
        <ul class="site-footer__social">
          <li><a href="${site.social.instagram.url}" target="_blank" rel="noopener">${icon('instagram')}<span>${esc(t.common.instagram)}</span></a></li>
          <li><a href="${site.social.facebook.url}" target="_blank" rel="noopener">${icon('facebook')}<span>${esc(t.common.facebook)}</span></a></li>
          <li><a href="${waLink(site.whatsapp, t.contact.whatsappMessage)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${esc(t.common.whatsapp)}</span></a></li>
        </ul>
        <p class="site-footer__lang"><span>${esc(t.footer.language)} :</span> ${langLinks}</p>
      </div>
    </div>
    <div class="container site-footer__bottom">
      <p>© <span data-year>${new Date().getFullYear()}</span> ${typo(site.legalName)}, ${esc(site.address.city)}. ${esc(t.footer.rights)}</p>
      <p>${esc(t.footer.credits)}</p>
    </div>
  </footer>`;
}

export function restaurantLd(ctx) {
  const { site, lang, t } = ctx;
  const a = site.address;
  const img = ctx.images[site.ogImage];
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': site.url + '/#restaurant',
    name: site.legalName,
    alternateName: site.name,
    slogan: site.tagline,
    description: t.pages.home.description,
    url: site.url + ctx.url('home'),
    image: `${site.url}/img/${site.ogImage}-${img.widths[img.widths.length - 1]}.webp`,
    telephone: site.phones[0].e164,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.city,
      addressCountry: a.countryCode,
    },
    hasMap: site.mapsUrl,
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: site.hours.open,
      closes: site.hours.close,
    }],
    servesCuisine: lang === 'fr' ? ['Cuisine internationale', 'Pâtisserie', 'Glaces', 'Cocktails'] : ['International', 'Pastry', 'Ice cream', 'Cocktails'],
    acceptsReservations: 'True',
    sameAs: [site.social.instagram.url, site.social.facebook.url],
    potentialAction: { '@type': 'ReserveAction', target: site.url + ctx.url('contact') },
  };
}
