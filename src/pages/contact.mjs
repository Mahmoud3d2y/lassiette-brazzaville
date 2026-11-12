import { esc, typo, icon, waLink } from '../lib.mjs';
import { visitSection } from './home.mjs';

export default function contact(ctx) {
  const { t, lang, site } = ctx;
  const f = t.contact.form;
  const slots = [];
  for (let m = 7 * 60 + 30; m <= 23 * 60; m += 30) {
    const h = String(Math.floor(m / 60)).padStart(2, '0'), mm = String(m % 60).padStart(2, '0');
    const label = lang === 'fr' ? `${h}h${mm}` : `${h}:${mm}`;
    slots.push(`<option value="${h}:${mm}">${label}</option>`);
  }
  const guests = Array.from({ length: site.reservation.maxGuestsOnline }, (_, i) => i + 1)
    .map((n) => `<option value="${n}"${n === 2 ? ' selected' : ''}>${n} ${n === 1 ? f.guestsSuffix.one : f.guestsSuffix.other}</option>`).join('');
  const endpoint = site.reservation.formEndpoint || '';

  const body = `
    <section class="page-head">
      <div class="container">
        <p class="eyebrow eyebrow--rule">${esc(t.book.eyebrow)}</p>
        <h1 class="title-display">${esc(t.contact.heading)}</h1>
        <p class="lead">${typo(esc(t.contact.intro))}</p>
        <div class="contact-actions">
          <a class="btn btn--whatsapp btn--lg" href="${waLink(site.whatsapp, t.contact.whatsappMessage)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${esc(t.contact.whatsapp)}</span></a>
          <a class="btn btn--ghost btn--lg" href="tel:${site.phones[0].e164}">${icon('phone')}<span>${esc(t.contact.call)} ${esc(site.phones[0].display)}</span></a>
          <a class="btn btn--ghost btn--lg" href="mailto:${site.email}">${icon('mail')}<span>${esc(t.contact.write)}</span></a>
        </div>
      </div>
    </section>

    <section class="section section--tight" aria-labelledby="form-title">
      <div class="container reservation">
        <div class="reservation__aside">
          <p class="eyebrow">${esc(t.book.eyebrow)}</p>
          <h2 id="form-title" class="title-xl">${esc(f.heading)}</h2>
          <p>${typo(esc(f.note))}</p>
          <div class="summary" aria-live="polite" data-summary data-template="${esc(t.contactSummary.line)}" data-one="${esc(f.guestsSuffix.one)}" data-other="${esc(f.guestsSuffix.other)}">
            <p class="summary__title">${esc(t.contactSummary.title)}</p>
            <p class="summary__line is-empty" data-summary-line>${esc(t.contactSummary.empty)}</p>
          </div>
          <figure class="reservation__photo photo fade-up">${ctx.img('salon', { sizes: '(min-width: 64em) 30vw, 100vw' })}</figure>
        </div>
        <form class="form" method="post" action="${esc(endpoint)}" novalidate data-reservation data-endpoint="${esc(endpoint)}" data-whatsapp="${site.whatsapp}" data-template="${esc(f.waTemplate)}" data-min-time="07:30" data-max-time="23:00">
          <div class="form__grid">
            <div class="field field--full">
              <label for="r-name">${esc(f.name)}</label>
              <input id="r-name" name="name" type="text" autocomplete="name" required minlength="2" placeholder="${esc(f.namePlaceholder)}" aria-describedby="e-name">
              <p class="field__error" id="e-name" data-error-for="name">${esc(f.errors.name)}</p>
            </div>
            <div class="field field--full">
              <label for="r-phone">${esc(f.phone)}</label>
              <input id="r-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required pattern="^\\+?[0-9 ().-]{7,20}$" placeholder="${esc(f.phonePlaceholder)}" aria-describedby="e-phone">
              <p class="field__error" id="e-phone" data-error-for="phone">${esc(f.errors.phone)}</p>
            </div>
            <div class="field">
              <label for="r-date">${esc(f.date)}</label>
              <input id="r-date" name="date" type="date" required aria-describedby="e-date">
              <p class="field__error" id="e-date" data-error-for="date">${esc(f.errors.date)}</p>
            </div>
            <div class="field">
              <label for="r-time">${esc(f.time)}</label>
              <div class="select"><select id="r-time" name="time" required aria-describedby="e-time"><option value="" selected disabled>${lang === 'fr' ? 'Choisir' : 'Choose'}</option>${slots.join('')}</select>${icon('chevronDown')}</div>
              <p class="field__error" id="e-time" data-error-for="time">${esc(f.errors.time)}</p>
            </div>
            <div class="field">
              <label for="r-guests">${esc(f.guests)}</label>
              <div class="select"><select id="r-guests" name="guests" required aria-describedby="e-guests">${guests}</select>${icon('chevronDown')}</div>
              <p class="field__error" id="e-guests" data-error-for="guests">${esc(f.errors.guests)}</p>
            </div>
            <div class="field field--full">
              <label for="r-message">${esc(f.message)}</label>
              <textarea id="r-message" name="message" rows="4" maxlength="600" placeholder="${esc(f.messagePlaceholder)}"></textarea>
            </div>
            <div class="field field--full field--check">
              <input id="r-consent" name="consent" type="checkbox" required aria-describedby="e-consent">
              <label for="r-consent">${esc(f.consent)}</label>
              <p class="field__error" id="e-consent" data-error-for="consent">${esc(f.errors.consent)}</p>
            </div>
            <input type="text" name="_gotcha" class="visually-hidden" tabindex="-1" autocomplete="off" aria-hidden="true">
            <input type="hidden" name="_language" value="${lang}">
          </div>
          <p class="field__error form__error" data-form-error hidden>${esc(f.errors.network)}</p>
          <button class="btn btn--primary btn--lg form__submit" type="submit" data-submit data-label-default="${esc(endpoint ? f.submit : f.submitWhatsapp)}" data-label-busy="${esc(f.submitting)}">${endpoint ? esc(f.submit) : `${icon('whatsapp')}<span>${esc(f.submitWhatsapp)}</span>`}</button>
        </form>
        <div class="form-success" role="status" aria-live="polite" data-form-success hidden>
          <div class="form-success__icon">${icon('check')}</div>
          <h3 data-success-title data-title-endpoint="${esc(f.successTitle)}" data-title-whatsapp="${esc(f.whatsappTitle)}"></h3>
          <p data-success-text data-text-endpoint="${esc(f.successText)}" data-text-whatsapp="${esc(f.whatsappText)}"></p>
          <a class="btn btn--whatsapp" href="#" target="_blank" rel="noopener" data-whatsapp-link hidden>${icon('whatsapp')}<span>${esc(f.whatsappOpen)}</span></a>
        </div>
      </div>
    </section>

    ${visitSection(ctx, 'contact')}
  `;
  return { body, bodyClass: 'page-contact' };
}
