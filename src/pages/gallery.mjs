import { esc, typo, icon } from '../lib.mjs';

const ITEMS = [
  ['comptoir-patisserie', 'place'], ['gambas', 'food'], ['tarte-fraises', 'pastry'], ['cocktail-lagon', 'bar'],
  ['terrasse', 'place'], ['bruschetta', 'food'], ['vitrine-patisserie', 'pastry'], ['burger', 'food'],
  ['bar-lounge', 'place'], ['crevettes-brick', 'food'], ['red-velvet', 'pastry'], ['cocktail-signature', 'bar'],
  ['jardin', 'place'], ['pave-saumon', 'food'], ['piece-montee', 'pastry'], ['flambe', 'food'],
  ['salon', 'place'], ['mac-and-cheese', 'food'], ['cheesecake', 'pastry'], ['cocktail-detox', 'bar'],
  ['salade-tomate-mozzarella', 'food'], ['bar-pause-gourmande', 'bar'],
  ['invitee-burger', 'place'], ['soupe-crevettes', 'food'], ['chef-sauce', 'pastry'], ['americain-crunchy', 'food'],
  ['planche-mixte', 'food'], ['gateau-fete', 'pastry'], ['philly-cheese', 'food'], ['pizza', 'food'],
  ['club-sandwich', 'food'], ['grillade', 'food'], ['tartines', 'food'], ['salade-fraicheur', 'food'],
  ['planche-apero', 'food'], ['pates-art', 'food'], ['plat-pistache', 'food'],
];

export default function gallery(ctx) {
  const { t, lang, images } = ctx;
  const filters = Object.entries(t.gallery.filters);
  const body = `
    <section class="page-head page-head--compact">
      <div class="container">
        <h1 class="title-display">${esc(t.gallery.heading)}</h1>
        <p class="lead">${typo(esc(t.gallery.intro))}</p>
        <div class="filters" role="group" aria-label="${esc(t.gallery.filterLabel)}" data-filters>
          ${filters.map(([k, label], i) => `<button type="button" class="filter" data-filter="${k}" aria-pressed="${i === 0}">${esc(label)}</button>`).join('\n          ')}
        </div>
      </div>
    </section>
    <section class="section section--tight">
      <ul class="container masonry" data-gallery>
        ${ITEMS.map(([slug, cat], i) => {
          const m = images[slug];
          const largest = m.widths[m.widths.length - 1];
          return `<li class="masonry__item" data-cat="${cat}">
          <button type="button" class="masonry__btn" data-lightbox-open data-index="${i}" data-full="/img/${slug}-${largest}.webp" data-alt="${esc(m.alt[lang])}" aria-label="${esc(t.gallery.open)} : ${esc(m.alt[lang])}">
            ${ctx.img(slug, { sizes: '(min-width: 64em) 30vw, (min-width: 40em) 46vw, 100vw' })}
          </button>
        </li>`;
        }).join('\n        ')}
      </ul>
      <p class="container gallery-credit">${esc(t.gallery.credit)}</p>
    </section>

    <dialog class="lightbox" data-lightbox aria-label="${esc(t.gallery.heading)}">
      <button type="button" class="lightbox__close" data-lightbox-close aria-label="${esc(t.gallery.close)}">${icon('close')}</button>
      <button type="button" class="lightbox__nav lightbox__nav--prev" data-lightbox-prev aria-label="${esc(t.gallery.prev)}">${icon('chevronLeft')}</button>
      <figure class="lightbox__figure">
        <img class="lightbox__img" src="" alt="" data-lightbox-img>
        <figcaption class="lightbox__caption" data-lightbox-caption></figcaption>
      </figure>
      <button type="button" class="lightbox__nav lightbox__nav--next" data-lightbox-next aria-label="${esc(t.gallery.next)}">${icon('chevronRight')}</button>
    </dialog>
  `;
  const jsonLd = [{
    '@context': 'https://schema.org', '@type': 'ImageGallery', name: t.pages.gallery.title, inLanguage: lang,
    image: ITEMS.slice(0, 12).map(([slug]) => ({ '@type': 'ImageObject', contentUrl: `${ctx.site.url}/img/${slug}-${images[slug].widths.at(-1)}.webp`, caption: images[slug].alt[lang] })),
  }];
  return { body, bodyClass: 'page-gallery', jsonLd };
}
