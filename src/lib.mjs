// Shared helpers for templates. No dependencies.
export const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const attr = (s) => esc(s).replace(/'/g, '&#39;');

/** Typographic apostrophe for display copy (L'Assiette -> L’Assiette). */
export const typo = (s) => String(s ?? '').replace(/(\p{L})'(\p{L})/gu, '$1’$2');

export function formatPrice(n, lang) {
  if (n == null) return null;
  const s = new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { maximumFractionDigits: 0 }).format(n);
  return `${s.replace(/ | /g, ' ')} FCFA`;
}

/** Responsive <img> from the generated image manifest. */
export function img(images, slug, { lang = 'fr', alt, sizes = '100vw', cls = '', loading = 'lazy', priority = false } = {}) {
  const m = images[slug];
  if (!m) throw new Error(`Unknown image slug: ${slug}`);
  const largest = m.widths[m.widths.length - 1];
  const fallback = m.widths.includes(800) ? 800 : largest;
  const srcset = m.widths.map((w) => `/img/${slug}-${w}.webp ${w}w`).join(', ');
  const h = Math.round(largest / m.ratio);
  const text = alt ?? m.alt[lang] ?? '';
  return `<img src="/img/${slug}-${fallback}.webp" srcset="${srcset}" sizes="${attr(sizes)}" width="${largest}" height="${h}" alt="${attr(text)}"` +
    ` loading="${priority ? 'eager' : loading}"${priority ? ' fetchpriority="high"' : ''} decoding="async"${cls ? ` class="${attr(cls)}"` : ''}>`;
}

/** Inline SVG icon set: one stroke weight (1.6), 24px grid. */
const ICONS = {
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronLeft: '<path d="m15 6-6 6 6 6"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  leaf: '<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19c3-4 6-7 10-9"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
  facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5z"/>',
  whatsapp: '<path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.5-4.3A8.5 8.5 0 1 1 20.5 11.6z"/><path d="M9.2 8.6c.2-.4.5-.4.8-.4h.6c.2 0 .4.1.5.4l.8 1.9c.1.2 0 .4-.1.6l-.6.7c.6 1.1 1.5 2 2.7 2.6l.7-.7c.2-.2.4-.2.6-.1l1.9.9c.3.1.4.3.4.5 0 .8-.3 1.5-1 1.9-.6.4-1.3.5-2 .3-2.6-.8-4.7-2.9-5.6-5.5-.2-.7-.1-1.5.3-2.1z"/>',
};
export function icon(name, cls = '') {
  const body = ICONS[name];
  if (!body) throw new Error(`Unknown icon: ${name}`);
  return `<svg class="icon${cls ? ' ' + cls : ''}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}

/** Eiffel-tower glyph used as the "A" of the wordmark (drawn after the restaurant's own logo). */
export const eiffel = (cls = '') => `<svg class="eiffel${cls ? ' ' + cls : ''}" viewBox="0 0 40 60" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20 0 21 7 22 14 24 14 24 16 22.5 16 25.5 30 29 30 29 32 26.5 32 34 52 40 60 31 60 Q20 42 9 60 L0 60 6 52 13.5 32 11 32 11 30 14.5 30 17.5 16 16 16 16 14 18 14 19 7Z"/><path fill="#fff" fill-opacity=".9" d="M17 22h6v1.2h-6zM15 40h10v1.3H15z"/></svg>`;

/** Wordmark: L’A(tower)SSIETTE in small caps, optional tagline. Accessible name stays the plain restaurant name. */
export function wordmark(site, { cls = '', tagline = true } = {}) {
  const n = typo(site.name);
  const i = n.search(/a/i);
  const visual = i === -1 ? esc(n) : `${esc(n.slice(0, i))}${eiffel('wordmark__a')}${esc(n.slice(i + 1))}`;
  return `<span class="wordmark${cls ? ' ' + cls : ''}"><span class="wordmark__name" aria-hidden="true">${visual}</span><span class="visually-hidden">${esc(site.name)}</span>${tagline ? `<span class="wordmark__tag">${esc(site.tagline)}</span>` : ''}</span>`;
}

export const waLink = (number, text) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
export const telLink = (e164) => `tel:${e164}`;
