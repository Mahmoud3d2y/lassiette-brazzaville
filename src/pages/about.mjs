import { esc, typo } from '../lib.mjs';

export default function about(ctx) {
  const { t, img } = ctx;
  const block = (key, slug, flip = false, extra = '') => `
        <article class="story${flip ? ' story--flip' : ''}">
          <figure class="story__media photo fade-up">${img(slug, { sizes: '(min-width: 48em) 44vw, 100vw' })}</figure>
          <div class="story__text">
            <h2>${typo(esc(t.about[key].title))}</h2>
            <p>${typo(esc(t.about[key].text))}</p>
            ${extra}
          </div>
        </article>`;

  const body = `
    <section class="page-head">
      <div class="container">
        <p class="eyebrow">${esc(t.nav.about)}</p>
        <h1 class="title-display">${esc(t.about.heading)}</h1>
        <p class="lead lead--wide">${typo(esc(t.about.lead))}</p>
      </div>
    </section>
    <section class="section section--tight">
      <div class="container stories">
        ${block('story', 'terrasse', false, `<!-- ${esc(t.about.story.todo)} -->`)}
        ${block('philosophy', 'chef-sauce', true)}
        ${block('cuisine', 'crevettes-brick')}
        ${block('place', 'salon', true)}
      </div>
    </section>
    <section class="section cta-band">
      <div class="container cta-band__inner">
        <figure class="cta-band__photo photo fade-up">${img('bar-lounge', { sizes: '(min-width: 48em) 44vw, 100vw' })}</figure>
        <div>
          <p class="eyebrow">${esc(t.night.title)}</p>
          <h2 class="title-xl">${typo(esc(t.atmosphere.heading))}</h2>
          <p>${typo(esc(t.atmosphere.night.text))}</p>
          <div class="cta-band__actions">
            <a class="btn btn--primary" href="${ctx.url('contact')}">${esc(t.about.ctaReserve)}</a>
            <a class="btn btn--ghost" href="${ctx.url('gallery')}">${esc(t.about.ctaGallery)}</a>
          </div>
        </div>
      </div>
    </section>
  `;
  return { body, bodyClass: 'page-about' };
}
