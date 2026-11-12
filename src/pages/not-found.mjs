import { esc, typo } from '../lib.mjs';

export default function notFound(ctx) {
  const { t } = ctx;
  const n = t.pages.notFound;
  const body = `
    <section class="page-head page-head--compact not-found">
      <div class="container">
        <p class="not-found__code" aria-hidden="true">404</p>
        <h1 class="title-display">${esc(n.heading)}</h1>
        <p class="lead">${typo(esc(n.text))}</p>
        <div class="hero__actions">
          <a class="btn btn--primary" href="${ctx.url('home')}">${esc(n.cta)}</a>
          <a class="btn btn--ghost" href="${ctx.url('menu')}">${esc(t.common.seeMenu)}</a>
          <a class="btn btn--ghost" href="${ctx.url('contact')}">${esc(t.common.reserve)}</a>
        </div>
      </div>
    </section>`;
  return { body, bodyClass: 'page-404', };
}
