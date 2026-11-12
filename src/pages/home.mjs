import { esc, typo, icon, waLink, formatPrice, wordmark, accent } from '../lib.mjs';

export default function home(ctx) {
  const { t, lang, site, menu, img } = ctx;
  const featured = menu.categories.flatMap((c) => c.items.filter((i) => i.featured && i.image).map((i) => ({ ...i, cat: c }))).slice(0, 4);
  const strip = ['terrasse', 'gambas', 'vitrine-patisserie', 'cocktail-signature'];
  const igSlugs = ['tarte-fraises', 'bruschetta', 'jardin', 'red-velvet', 'cocktail-lagon', 'burger'];
  const A = lang === 'fr'
    ? { intro: 'quatre façons', featured: 'incontournables', atm: 'dernier verre', book: 'table.', day: 'jardin', night: 's’allume' }
    : { intro: 'four ways', featured: 'Signature', atm: 'last drink', book: 'seat.', day: 'Garden', night: 'lights up' };

  const body = `
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__media" aria-hidden="true">${img('crevettes-brick', { priority: true, sizes: '100vw', alt: '' })}</div>
      <div class="hero__frame" aria-hidden="true"></div>
      <div class="hero__content">
        <h1 class="hero__title" id="hero-title">${wordmark(site, { cls: 'wordmark--hero' })}</h1>
        <p class="eyebrow hero__eyebrow">${typo(esc(t.hero.kicker))}</p>
        <div class="hero__actions">
          <a class="btn btn--light btn--lg" href="${ctx.url('contact')}">${esc(t.hero.ctaReserve)}</a>
          <a class="btn btn--ghost-light btn--lg" href="${ctx.url('menu')}">${esc(t.hero.ctaMenu)}</a>
        </div>
      </div>
      <dl class="hero__meta">
        <div><dt>${icon('clock')}<span class="visually-hidden">${esc(t.visit.hours)}</span></dt><dd>${esc(t.hero.open)}, ${esc(t.hero.hoursShort)}</dd></div>
        <div><dt>${icon('pin')}<span class="visually-hidden">${esc(t.visit.address)}</span></dt><dd>${esc(site.address.street)}, ${esc(t.hero.where)}</dd></div>
      </dl>
    </section>

    <section class="section intro" aria-labelledby="intro-title">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow eyebrow--rule">${esc(site.address.city)} · ${esc(t.hero.where.split(',')[0])}</p>
          <h2 id="intro-title" class="title-display">${accent(typo(esc(t.intro.heading)), A.intro)}</h2>
          <p class="lead">${typo(esc(t.hero.sub))}</p>
        </div>
        <ul class="facets">
          ${t.intro.facets.map((f) => `<li class="facet fade-up"><h3>${esc(f.title)}</h3><p>${typo(esc(f.text))}</p></li>`).join('\n          ')}
        </ul>
      </div>
    </section>

    <section class="section-tight" aria-label="${esc(t.book.strip)}">
      <div class="container">
        <ul class="strip">
          ${strip.map((s) => `<li><figure class="photo photo--hover fade-up">${img(s, { sizes: '(min-width: 48em) 25vw, 50vw' })}</figure></li>`).join('\n          ')}
        </ul>
        <p class="strip-caption eyebrow">${typo(esc(t.book.strip))}</p>
      </div>
    </section>

    <section class="section signatures" aria-labelledby="featured-title">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow eyebrow--rule">${esc(t.menuPage.chapterIntro)}</p>
          <h2 id="featured-title" class="title-display">${accent(esc(t.featured.heading), A.featured)}</h2>
          <p class="lead">${typo(esc(t.featured.text))}</p>
        </div>
        <ul class="rail">
          ${featured.map((d, i) => `<li class="dish fade-up">
            <a class="photo photo--hover" href="${ctx.url('menu')}#${d.cat.id}" tabindex="-1" aria-hidden="true">${img(d.image, { sizes: '(min-width: 64em) 25vw, 74vw' })}</a>
            <p class="eyebrow dish__cat"><span class="dish__num">${String(i + 1).padStart(2, '0')}</span>${esc(d.cat.name[lang])}</p>
            <h3 class="dish__name"><a href="${ctx.url('menu')}#${d.cat.id}">${typo(esc(d.name[lang]))}</a></h3>
            <p class="dish__desc">${typo(esc(d.desc[lang]))}</p>
            <p class="dish__price${d.price == null ? ' dish__price--ask' : ''}">${formatPrice(d.price, lang) ?? esc(t.featured.priceOnRequest)}</p>
          </li>`).join('\n          ')}
        </ul>
        <div class="section-foot"><a class="btn btn--ghost btn--lg" href="${ctx.url('menu')}">${esc(t.featured.cta)}</a></div>
      </div>
    </section>

    <section class="section section--sand" aria-labelledby="atmosphere-title">
      <div class="container">
        <div class="section-head">
          <h2 id="atmosphere-title" class="title-display">${accent(typo(esc(t.atmosphere.heading)), A.atm)}</h2>
        </div>
        <div class="two-up">
          <article class="panel fade-up">
            <figure class="photo">${img('comptoir-patisserie', { sizes: '(min-width: 48em) 50vw, 100vw' })}</figure>
            <div class="panel__body">
              <p class="eyebrow">${esc(t.day.title)}</p>
              <h3 class="title-lg">${accent(typo(esc(t.day.heading)), A.day)}</h3>
              <p>${typo(esc(t.day.text))}</p>
              <div class="panel__actions"><a class="btn btn--ghost" href="${ctx.url('menu')}#patisserie">${esc(t.day.cta)}</a></div>
            </div>
          </article>
          <article class="panel panel--dark fade-up">
            <figure class="photo">${img('bar-lounge', { sizes: '(min-width: 48em) 50vw, 100vw' })}</figure>
            <div class="panel__body">
              <p class="eyebrow">${esc(t.night.title)}</p>
              <h3 class="title-lg">${accent(typo(esc(t.night.heading)), A.night)}</h3>
              <p>${typo(esc(t.night.text))}</p>
              <div class="panel__actions"><a class="btn btn--light" href="${ctx.url('contact')}">${esc(t.night.cta)}</a><a class="btn btn--ghost-light" href="${ctx.url('gallery')}">${esc(t.atmosphere.cta)}</a></div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section book" aria-labelledby="book-title">
      <div class="container">
        <p class="eyebrow eyebrow--rule">${esc(t.book.eyebrow)}</p>
        <h2 id="book-title" class="title-display">${accent(typo(esc(t.book.heading)), A.book)}</h2>
        <p class="book__text">${typo(esc(t.book.text))}</p>
        <div class="book__actions">
          <a class="btn btn--primary btn--lg" href="${ctx.url('contact')}">${esc(t.book.cta)}</a>
          <a class="btn btn--ghost btn--lg" href="${waLink(site.whatsapp, t.contact.whatsappMessage)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${esc(t.common.whatsapp)}</span></a>
        </div>
      </div>
    </section>

    <section class="section-tight instagram" aria-labelledby="ig-title" style="padding-bottom: var(--section)">
      <div class="container">
        <div class="instagram__head">
          <h2 id="ig-title" class="title-lg">${esc(t.instagram.heading)}</h2>
          <a class="instagram__handle" href="${site.social.instagram.url}" target="_blank" rel="noopener">${icon('instagram')}<span>${esc(t.instagram.handle)}</span></a>
        </div>
        <ul class="ig-grid" aria-label="${esc(t.instagram.aria)}">
          ${igSlugs.map((s) => `<li><a href="${site.social.instagram.url}" target="_blank" rel="noopener">${img(s, { sizes: '(min-width: 48em) 16vw, 33vw' })}</a></li>`).join('\n          ')}
        </ul>
      </div>
    </section>

    ${visitSection(ctx, 'home')}
  `;
  return { body, bodyClass: 'page-home' };
}

export function visitSection(ctx, variant = 'home') {
  const { t, lang, site } = ctx;
  const a = site.address;
  return `
    <section class="visit" aria-labelledby="visit-title">
      <div class="visit__map" data-map data-src="${esc(site.mapsEmbed)}" data-title="${esc(t.visit.mapTitle)}">
        <div class="map__placeholder">
          <p class="map__address">${esc(a.street)}<br>${esc(a.city)}</p>
          <button class="btn btn--primary" type="button" data-map-load>${esc(t.visit.showMap)}</button>
          <p class="map__note">${esc(t.visit.mapNote)}</p>
          <a class="map__link" href="${site.mapsUrl}" target="_blank" rel="noopener">${esc(t.visit.directions)}</a>
        </div>
      </div>
      <div class="visit__panel">
        <p class="eyebrow">${esc(a.city)}</p>
        <h2 id="visit-title" class="title-xl">${accent(esc(t.visit.heading), lang === 'fr' ? 'trouver' : 'us')}</h2>
        <dl class="facts">
          <div>
            <dt>${esc(t.visit.address)}</dt>
            <dd>${esc(a.street)}<br>${esc(a.landmark[lang])}<br><span class="muted">${esc(a.district[lang])}, ${esc(a.city)}, ${esc(a.country[lang])}</span></dd>
          </div>
          <div>
            <dt>${esc(t.visit.hours)}</dt>
            <dd>${esc(t.visit.hoursText)}<br><span class="muted">${esc(t.visit.services)}</span></dd>
          </div>
          <div>
            <dt>${esc(t.footer.contact)}</dt>
            <dd>${site.phones.map((p) => `<a href="tel:${p.e164}">${esc(p.display)}</a>`).join('<br>')}<br><a href="mailto:${site.email}">${esc(site.email)}</a></dd>
          </div>
        </dl>
        <div class="visit__actions">
          ${variant === 'home' ? `<a class="btn btn--light" href="${ctx.url('contact')}">${esc(t.visit.ctaReserve)}</a>` : ''}
          <a class="btn btn--ghost-light" href="${site.mapsUrl}" target="_blank" rel="noopener">${esc(t.visit.directions)}</a>
          <a class="btn btn--ghost-light" href="${site.social.instagram.url}" target="_blank" rel="noopener">${esc(t.common.instagram)}</a>
        </div>
      </div>
    </section>`;
}
