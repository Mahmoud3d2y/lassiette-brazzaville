// Image pipeline: crops baked-in captions, resizes and encodes WebP.
// Zero npm dependencies: uses macOS `sips` (dimensions) and `cwebp` (brew install webp).
import { execFileSync } from 'node:child_process';
import { readdirSync, mkdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'assets');
const OUT = join(ROOT, 'public', 'img');
const WIDTHS = [480, 800, 1200, 1600];
const manifest = JSON.parse(readFileSync(join(ROOT, 'src/data/images.json'), 'utf8'));

const files = readdirSync(SRC).filter(f => /\.jpe?g$/i.test(f)).sort();
mkdirSync(OUT, { recursive: true });

function dims(file) {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file]).toString();
  return {
    w: +out.match(/pixelWidth: (\d+)/)[1],
    h: +out.match(/pixelHeight: (\d+)/)[1],
  };
}

const meta = {};
for (const img of manifest.images) {
  const file = join(SRC, files[img.n - 1]);
  if (!file || !existsSync(file)) { console.warn('missing source for', img.slug); continue; }
  const { w, h } = dims(file);
  const top = Math.round(h * (img.crop?.top ?? 0));
  const bottom = Math.round(h * (img.crop?.bottom ?? 0));
  const ch = h - top - bottom;
  const widths = WIDTHS.filter(x => x <= w);
  if (!widths.length || widths[widths.length - 1] < w) widths.push(Math.min(w, 1600));
  const sizes = [];
  for (const tw of widths) {
    const th = Math.round(ch * tw / w);
    const out = join(OUT, `${img.slug}-${tw}.webp`);
    if (!existsSync(out)) {
      execFileSync('cwebp', ['-quiet', '-q', '78', '-sharp_yuv', '-mt', '-af',
        '-crop', '0', String(top), String(w), String(ch),
        '-resize', String(tw), String(th), file, '-o', out]);
    }
    sizes.push(tw);
  }
  meta[img.slug] = { w, h: ch, ratio: +(w / ch).toFixed(4), widths: [...new Set(sizes)], alt: img.alt };
  console.log(`${img.slug.padEnd(28)} ${w}x${ch}  [${sizes.join(', ')}]`);
}
writeFileSync(join(ROOT, 'src/data/images.generated.json'), JSON.stringify(meta, null, 2));
console.log('\nWrote', Object.keys(meta).length, 'images to public/img');
