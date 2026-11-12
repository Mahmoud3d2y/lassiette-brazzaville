// Generates public/apple-touch-icon.png (180×180) without dependencies: the logo's turquoise disc with a white Eiffel-tower A.
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SIZE = 180, out = fileURLToPath(new URL('../public/apple-touch-icon.png', import.meta.url));
const BG = [0x2f, 0xb4, 0xbe], FG = [0xff, 0xff, 0xff];
// Tower silhouette (same path as lib.mjs eiffel()), sampled as a polygon with the arch approximated by a curve.
const P = [[20,0],[21,7],[22,14],[24,14],[24,16],[22.5,16],[25.5,30],[29,30],[29,32],[26.5,32],[34,52],[40,60],[31,60]];
for (let i = 1; i < 12; i++) { const t = i / 12, x = 31 + (9 - 31) * t, y = (1 - t) ** 2 * 60 + 2 * (1 - t) * t * 42 + t * t * 60; P.push([x, y]); }
P.push([9,60],[0,60],[6,52],[13.5,32],[11,32],[11,30],[14.5,30],[17.5,16],[16,16],[16,14],[18,14],[19,7]);
const inside = (x, y) => { let hit = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit; } return hit; };
const S = 1.55, OX = 90 - 20 * S, OY = 90 - 30 * S; // centre the 40×60 glyph
const px = Buffer.alloc(SIZE * SIZE * 3);
const c = SIZE / 2;
for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
  const r = Math.hypot(x + .5 - c, y + .5 - c);
  if (r > c) { px.set([0xff, 0xff, 0xff], (y * SIZE + x) * 3); continue; }
  const col = inside((x + .5 - OX) / S, (y + .5 - OY) / S) ? FG : BG;
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
