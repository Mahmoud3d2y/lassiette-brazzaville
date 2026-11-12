import { esc, typo, icon, waLink, formatPrice } from '../lib.mjs';

export default function home(ctx) {
  const { t, lang, site, menu, img } = ctx;
  const featured = menu.categories.flatMap((c) => c.items.filter((i) => i.featured && i.image).map((i) => ({ ...i, cat: c }))).slice(0, 4);
  const igSlugs = ['tarte-fraises', 'cocktail-lagon', 'bruschetta', 'jardin', 'red-velvet', 'gambas', 'bar-pause-gourmande', 'burger', 'vitrine-patisserie', 'flambe', 'salade-tomate-mozzarella', 'cocktail-detox', 'gateau-fete', 'crevettes-brick', 'terrasse', 'piece-montee'];
  const ig = (slugs) => slugs.map((s) => `<a class="ig-strip__item" href="${site.social.instagram.url}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">${img(s, { sizes: '192px' })}</a>`).join('');
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  const [w1, ...rest] = typo(site.name).split(/(?<=’)/); // "L’" + "Assiette"
  const manifesto = lang === 'fr'
    ? `Un café et une viennoiserie au comptoir le matin. Un déjeuner <em>à l’ombre de la pergola</em>. Une part de gâteau l’après-midi. Un cocktail au lounge bar <em>jusqu’à 23h30</em>.`
    : `Coffee and a croissant at the counter in the morning. Lunch <em>in the shade of the pergola</em>. A slice of cake in the afternoon. A cocktail at the lounge bar <em>until 11:30 pm</em>.`;

  const body = `
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__media" aria-hidden="true">
        <figure class="hero__frame hero__frame--1">${img('flambe', { priority: true, sizes: '(min-width: 64em) 50vw, 100vw', alt: '' })}</figure>
        <figure class="hero__frame hero__frame--2">${img('cocktail-signature', { priority: true, sizes: '(min-width: 64em) 50vw, 1px', alt: '' })}</figure>
      </div>
      <div class="hero__smoke" aria-hidden="true"></div>
      <div class="container hero__content">
        <p class="hero__kicker">${typo(esc(t.hero.kicker))}</p>
        <h1 class="hero__title" id="hero-title"><span class="word"><span>${w1}</span></span><span class="word"><span>${rest.join('')}</span></span><span class="hero__tagline">${esc(site.tagline)}</span></h1>
        <p class="hero__sub">${typo(esc(t.hero.sub))}</p>
        <div class="hero__actions">
          <a class="btn btn--primary btn--lg" href="${ctx.url('contact')}">${esc(t.hero.ctaReserve)}</a>
          <a class="btn btn--ghost btn--lg" href="${ctx.url('menu')}">${esc(t.hero.ctaMenu)}</a>
        </div>
        <dl class="hero__meta">
          <div><dt>${icon('clock')}<span class="visually-hidden">${esc(t.visit.hours)}</span></dt><dd>${esc(t.hero.open)}, ${esc(t.hero.hoursShort)}</dd></div>
          <div><dt>${icon('pin')}<span class="visually-hidden">${esc(t.visit.address)}</span></dt><dd>${esc(site.address.street)}, ${esc(t.hero.where)}</dd></div>
        </dl>
      </div>
      <p class="hero__scroll" aria-hidden="true">${esc(t.hero.scroll)}</p>
    </section>

    <section class="manifesto" aria-labelledby="intro-title">
      <div class="container manifesto__grid">
        <div>
          <h2 id="intro-title" class="visually-hidden">${typo(esc(t.intro.heading))}</h2>
          <p class="manifesto__text fade-up">${manifesto}</p>
          <div class="hairline"></div>
          <p class="lead" style="margin-top:0">${typo(esc(t.intro.text.split('. ').slice(-1)[0]))}</p>
        </div>
        <ul class="facets">
          ${t.intro.facets.map((f) => `<li class="facet fade-up"><h3>${esc(f.title)}</h3><p>${typo(esc(f.text))}</p></li>`).join('\n          ')}
        </ul>
      </div>
    </section>

    <section class="section signatures" aria-labelledby="featured-title">
      <div class="container">
        <div class="signatures__head">
          <div>
            <h2 id="featured-title" class="title-xl">${esc(t.featured.heading)}</h2>
            <p class="lead">${typo(esc(t.featured.text))}</p>
          </div>
        </div>
        <ol class="spreads">
          ${featured.map((d, i) => `<li class="spread">
            <figure class="spread__media reveal"><a href="${ctx.url('menu')}#${d.cat.id}" tabindex="-1" aria-hidden="true">${img(d.image, { sizes: '(min-width: 48em) 50vw, 100vw' })}</a></figure>
            <div class="spread__body fade-up">
              <p class="spread__num">${roman[i]} — ${esc(d.cat.name[lang])}</p>
              <h3 class="spread__name">${typo(esc(d.name[lang]))}</h3>
              <p class="spread__desc">${typo(esc(d.desc[lang]))}</p>
              <p class="spread__price">${formatPrice(d.price, lang) ?? esc(t.featured.priceOnRequest)}</p>
              <a class="spread__link" href="${ctx.url('menu')}#${d.cat.id}">${esc(t.featured.view)}</a>
            </div>
          </li>`).join('\n          ')}
        </ol>
        <div class="signatures__foot"><a class="btn btn--ghost btn--lg" href="${ctx.url('menu')}">${esc(t.featured.cta)}</a></div>
      </div>
    </section>

    <section class="section section--light day" aria-labelledby="day-title">
      <div class="container day__grid">
        <div class="day__copy">
          <p class="day__title">${esc(t.day.title)}</p>
          <h2 id="day-title" class="day__heading">${typo(esc(t.day.heading))}</h2>
          <p class="day__text">${typo(esc(t.day.text))}</p>
          <div class="hairline"></div>
          <a class="btn btn--primary" href="${ctx.url('menu')}#patisserie">${esc(t.day.cta)}</a>
        </div>
        <div class="day__photos">
          <figure class="day__photo day__photo--a reveal">${img('comptoir-patisserie', { sizes: '(min-width: 64em) 34vw, 58vw' })}</figure>
          <figure class="day__photo day__photo--b reveal">${img('tarte-fraises', { sizes: '(min-width: 64em) 24vw, 40vw' })}</figure>
        </div>
      </div>
    </section>

    <section class="night" aria-labelledby="night-title">
      <div class="night__media" aria-hidden="true"><div data-parallax="0.12" style="height:100%">${img('bar-lounge', { sizes: '100vw', alt: '' })}</div></div>
      <div class="container night__content">
        <p class="night__title">${esc(t.night.title)}</p>
        <h2 id="night-title" class="night__heading">${typo(esc(t.night.heading))}</h2>
        <p class="night__text">${typo(esc(t.night.text))}</p>
        <div class="night__actions">
          <a class="btn btn--primary" href="${ctx.url('contact')}">${esc(t.night.cta)}</a>
          <a class="btn btn--ghost" href="${ctx.url('gallery')}">${esc(t.atmosphere.cta)}</a>
        </div>
      </div>
    </section>

    <section class="section why" aria-labelledby="why-title">
      <div class="container why__grid">
        <div class="why__intro">
          <h2 id="why-title" class="title-xl">${typo(esc(t.why.heading))}</h2>
          <figure class="why__photo reveal">${img('jardin', { sizes: '(min-width: 64em) 26vw, 100vw' })}</figure>
        </div>
        <ul class="why__list">
          ${t.why.items.map((w) => `<li class="why__item fade-up"><h3>${typo(esc(w.title))}</h3><p>${typo(esc(w.text))}</p></li>`).join('\n          ')}
        </ul>
      </div>
    </section>

    <section class="section instagram" aria-labelledby="ig-title">
      <div class="container instagram__head">
        <h2 id="ig-title" class="title-xl">${esc(t.instagram.heading)}</h2>
        <a class="instagram__handle" href="${site.social.instagram.url}" target="_blank" rel="noopener">${icon('instagram')}<span>${esc(t.instagram.handle)}</span></a>
      </div>
      <div class="ig-strip" role="group" aria-label="${esc(t.instagram.aria)}">
        <div class="ig-strip__row"><div class="ig-strip__group">${ig(igSlugs.slice(0, 8))}</div><div class="ig-strip__group">${ig(igSlugs.slice(0, 8))}</div></div>
        <div class="ig-strip__row ig-strip__row--reverse"><div class="ig-strip__group">${ig(igSlugs.slice(8))}</div><div class="ig-strip__group">${ig(igSlugs.slice(8))}</div></div>
      </div>
      <div class="container instagram__foot"><a class="btn btn--ghost" href="${site.social.instagram.url}" target="_blank" rel="noopener">${esc(t.instagram.cta)}</a></div>
    </section>

    ${visitSection(ctx, 'home')}
  `;
  return { body, bodyClass: 'page-home' };
}

export function visitSection(ctx, variant = 'home') {
  const { t, lang, site, icon } = ctx;
  const a = site.address;
  return `
    <section class="section visit" aria-labelledby="visit-title">
      <div class="container visit__grid">
        <div class="visit__info">
          <h2 id="visit-title" class="title-xl">${esc(t.visit.heading)}</h2>
          <dl class="info-list">
            <div class="info-list__row">
              <dt>${icon('pin')}<span>${esc(t.visit.address)}</span></dt>
              <dd>${esc(a.street)}<br>${esc(a.landmark[lang])}<br>${esc(a.district[lang])}, ${esc(a.city)}, ${esc(a.country[lang])}<br><a href="${site.mapsUrl}" target="_blank" rel="noopener">${esc(t.visit.directions)}${icon('external', 'icon--inline')}</a></dd>
            </div>
            <div class="info-list__row">
              <dt>${icon('clock')}<span>${esc(t.visit.hours)}</span></dt>
              <dd>${esc(t.visit.hoursText)}<br><span class="muted">${esc(t.visit.services)}</span></dd>
            </div>
            <div class="info-list__row">
              <dt>${icon('phone')}<span>${esc(t.visit.phone)}</span></dt>
              <dd>${site.phones.map((p) => `<a href="tel:${p.e164}">${esc(p.display)}</a>`).join('<br>')}</dd>
            </div>
            <div class="info-list__row">
              <dt>${icon('mail')}<span>${esc(t.visit.email)}</span></dt>
              <dd><a href="mailto:${site.email}">${esc(site.email)}</a></dd>
            </div>
          </dl>
          ${variant === 'home' ? `<div class="visit__actions"><a class="btn btn--primary" href="${ctx.url('contact')}">${esc(t.visit.ctaReserve)}</a><a class="btn btn--whatsapp" href="${waLink(site.whatsapp, t.contact.whatsappMessage)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${esc(t.common.whatsapp)}</span></a></div>` : ''}
        </div>
        <div class="map" data-map data-src="${esc(site.mapsEmbed)}" data-title="${esc(t.visit.mapTitle)}">
          <div class="map__placeholder">
            <p class="map__address">${esc(a.street)}<br>${esc(a.city)}</p>
            <button class="btn btn--primary" type="button" data-map-load>${esc(t.visit.showMap)}</button>
            <p class="map__note">${esc(t.visit.mapNote)}</p>
            <a class="map__link" href="${site.mapsUrl}" target="_blank" rel="noopener">${esc(t.visit.directions)}${icon('external', 'icon--inline')}</a>
          </div>
        </div>
      </div>
    </section>`;
}
