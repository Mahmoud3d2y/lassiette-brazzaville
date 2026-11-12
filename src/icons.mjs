// Generates public/apple-touch-icon.png (180×180) without dependencies: a lagoon disc with a porcelain plate motif.
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SIZE = 180, out = fileURLToPath(new URL('../public/apple-touch-icon.png', import.meta.url));
const BG = [0x1c, 0x9a, 0xa5], FG = [0xf7, 0xf5, 0xf0];
const px = Buffer.alloc(SIZE * SIZE * 3);
const c = SIZE / 2;
for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
  const r = Math.hypot(x + .5 - c, y + .5 - c);
  const ring = r > 55 && r < 62, disc = r < 34;
  const col = ring || disc ? FG : BG;
  px.set(col, (y * SIZE + x) * 3);
}
const raw = Buffer.alloc((SIZE * 3 + 1) * SIZE);
for (let y = 0; y < SIZE; y++) { raw[y * (SIZE * 3 + 1)] = 0; px.copy(raw, y * (SIZE * 3 + 1) + 1, y * SIZE * 3, (y + 1) * SIZE * 3); }
const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const cr = Buffer.alloc(4); cr.writeUInt32BE(crc(td)); return Buffer.concat([len, td, cr]); };
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(SIZE, 0); ihdr.writeUInt32BE(SIZE, 4); ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
writeFileSync(out, Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
console.log('wrote', out);
