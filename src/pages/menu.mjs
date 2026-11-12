import { esc, typo, icon, waLink, formatPrice } from '../lib.mjs';

export default function menuPage(ctx) {
  const { t, lang, site, menu, img } = ctx;
  const cats = menu.categories;
  const cakeMsg = lang === 'fr' ? 'Bonjour L\'Assiette, je souhaite commander un gâteau.' : 'Hello L\'Assiette, I would like to order a cake.';
  const price = (d) => formatPrice(d.price, lang) ?? esc(t.menuPage.priceOnRequest);

  const body = `
    <section class="page-head">
      <div class="container">
        <p class="eyebrow">${esc(t.menuPage.chapterIntro)}</p>
        <h1 class="title-display">${esc(t.menuPage.heading)}</h1>
        <p class="lead">${typo(esc(t.menuPage.intro))}</p>
        <p class="menu-note">${typo(esc(t.menuPage.priceNote))}</p>
      </div>
    </section>

    <nav class="menu-nav" aria-label="${esc(t.menuPage.categoriesLabel)}" data-menu-nav>
      <div class="container"><ul>
        ${cats.map((c) => `<li><a href="#${c.id}">${esc(c.name[lang])}</a></li>`).join('\n        ')}
      </ul></div>
    </nav>

    <div class="container menu-sections">
      ${cats.map((c, i) => {
        const hero = c.items.find((d) => d.featured && d.image);
        const others = c.items.filter((d) => d !== hero);
        return `
      <section class="menu-cat" id="${c.id}" aria-labelledby="${c.id}-title">
        <header class="menu-cat__head">
          <p class="eyebrow">${String(i + 1).padStart(2, '0')}</p>
          <h2 id="${c.id}-title">${typo(esc(c.name[lang]))}</h2>
          <p>${typo(esc(c.intro[lang]))}</p>
        </header>
        ${hero ? `<article class="menu-hero fade-up">
          <figure class="photo">${img(hero.image, { sizes: '(min-width: 48em) 36vw, 100vw' })}</figure>
          <div class="menu-hero__body">
            <p class="eyebrow">${esc(t.menuPage.signature)}</p>
            <h3 class="menu-hero__name">${typo(esc(hero.name[lang]))}</h3>
            <p class="menu-hero__desc">${typo(esc(hero.desc[lang]))}</p>
            <p class="menu-hero__price">${price(hero)}</p>
          </div>
        </article>` : ''}
        <ul class="menu-items">
          ${others.map((d) => `<li class="menu-item${d.image ? ' menu-item--photo' : ''}">
            ${d.image ? `<figure class="menu-item__media">${img(d.image, { sizes: '3.5rem' })}</figure>` : ''}
            <div class="menu-item__body">
              <div class="menu-item__row"><h3 class="menu-item__name">${typo(esc(d.name[lang]))}</h3><span class="menu-item__price${d.price == null ? ' menu-item__price--ask' : ''}">${price(d)}</span></div>
              <p class="menu-item__desc">${typo(esc(d.desc[lang]))}</p>
            </div>
          </li>`).join('\n          ')}
        </ul>
        ${c.id === 'patisserie' ? `<a class="btn btn--whatsapp" href="${waLink(site.whatsapp, cakeMsg)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${esc(t.menuPage.cakeCta)}</span></a>` : ''}
      </section>`; }).join('\n')}
      <p class="menu-allergens">${typo(esc(t.menuPage.allergens))}</p>
      <div class="menu-cta">
        <a class="btn btn--primary btn--lg" href="${ctx.url('contact')}">${esc(t.menuPage.ctaReserve)}</a>
      </div>
    </div>
  `;

  const jsonLd = [{
    '@context': 'https://schema.org', '@type': 'Menu', '@id': site.url + ctx.url('menu') + '#menu', name: t.menuPage.heading, inLanguage: lang,
    hasMenuSection: cats.map((c) => ({ '@type': 'MenuSection', name: c.name[lang], description: c.intro[lang],
      hasMenuItem: c.items.map((d) => ({ '@type': 'MenuItem', name: d.name[lang], description: d.desc[lang], ...(d.price != null ? { offers: { '@type': 'Offer', price: d.price, priceCurrency: 'XAF' } } : {}) })) })),
  }];
  return { body, bodyClass: 'page-menu', jsonLd };
}
