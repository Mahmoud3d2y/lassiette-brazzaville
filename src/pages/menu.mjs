import { esc, typo, icon, waLink, formatPrice } from '../lib.mjs';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

export default function menuPage(ctx) {
  const { t, lang, site, menu, img } = ctx;
  const cats = menu.categories;
  const cakeMsg = lang === 'fr' ? 'Bonjour L\'Assiette, je souhaite commander un gâteau.' : 'Hello L\'Assiette, I would like to order a cake.';
  const price = (d) => formatPrice(d.price, lang) ?? esc(t.menuPage.priceOnRequest);

  const body = `
    <section class="page-head">
      <div class="container page-head__grid">
        <div>
          <h1 class="title-display">${esc(t.menuPage.heading)}</h1>
          <p class="lead">${typo(esc(t.menuPage.intro))}</p>
          <p class="menu-note">${typo(esc(t.menuPage.priceNote))}</p>
        </div>
        <figure class="page-head__photo reveal">${img('gambas', { priority: true, sizes: '(min-width: 64em) 34vw, 100vw' })}</figure>
      </div>
    </section>

    <div class="container menu-layout">
      <nav class="menu-nav" aria-label="${esc(t.menuPage.categoriesLabel)}" data-menu-nav>
        <ul>
          ${cats.map((c) => `<li><a href="#${c.id}">${esc(c.name[lang])}</a></li>`).join('\n          ')}
        </ul>
      </nav>
      <div class="menu-sections">
        ${cats.map((c, i) => {
          const hero = c.items.find((d) => d.featured && d.image);
          const others = c.items.filter((d) => d !== hero);
          return `
        <section class="menu-cat" id="${c.id}" aria-labelledby="${c.id}-title">
          <header class="menu-cat__head">
            <p class="menu-cat__num">${ROMAN[i]}</p>
            <h2 id="${c.id}-title">${typo(esc(c.name[lang]))}</h2>
            <p>${typo(esc(c.intro[lang]))}</p>
          </header>
          ${hero ? `<article class="menu-hero">
            <figure class="menu-hero__media reveal">${img(hero.image, { sizes: '(min-width: 64em) 40vw, 100vw' })}</figure>
            <div class="fade-up">
              <p class="menu-hero__tag">${esc(t.menuPage.signature)}</p>
              <h3 class="menu-hero__name">${typo(esc(hero.name[lang]))}</h3>
              <p class="menu-hero__desc">${typo(esc(hero.desc[lang]))}</p>
              <p class="menu-hero__price">${price(hero)}</p>
            </div>
          </article>` : ''}
          <ul class="menu-items">
            ${others.map((d) => `<li class="menu-item${d.image ? ' menu-item--photo' : ''}">
              ${d.image ? `<figure class="menu-item__media">${img(d.image, { sizes: '(min-width: 48em) 6rem, 25vw' })}</figure>` : ''}
              <div class="menu-item__body">
                <div class="menu-item__row"><h3 class="menu-item__name">${typo(esc(d.name[lang]))}</h3><span class="menu-item__dots" aria-hidden="true"></span><span class="menu-item__price${d.price == null ? ' menu-item__price--ask' : ''}">${price(d)}</span></div>
                <p class="menu-item__desc">${typo(esc(d.desc[lang]))}</p>
              </div>
            </li>`).join('\n            ')}
          </ul>
          ${c.id === 'patisserie' ? `<a class="btn btn--whatsapp" href="${waLink(site.whatsapp, cakeMsg)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${esc(t.menuPage.cakeCta)}</span></a>` : ''}
        </section>`; }).join('\n')}
        <p class="menu-allergens">${typo(esc(t.menuPage.allergens))}</p>
        <div class="menu-cta">
          <a class="btn btn--primary btn--lg" href="${ctx.url('contact')}">${esc(t.menuPage.ctaReserve)}</a>
        </div>
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
