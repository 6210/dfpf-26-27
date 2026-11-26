// Regenerates the PNG and ICO app icons in public/ from public/favicon.svg: `node scripts/make-icons.mjs`.
// Raster icons cannot follow the theme, so they use the dark mark on the light page background.
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const source = await readFile('public/favicon.svg', 'utf8');
const mark = source.replace(/<style>.*?<\/style>/s, '').replace('class="df-mark"', 'fill="#181818"');
const background = '#ffffff';

/** The mark centred on a solid square, with `padding` (a share of the size) on each side. */
async function icon(size, padding) {
  const inner = Math.round(size * (1 - padding * 2));
  const art = await sharp(Buffer.from(mark), { density: 72 * (inner / 100) * 2 }).resize(inner, inner).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: art, gravity: 'centre' }])
    .png()
    .toBuffer();
}

await writeFile('public/apple-touch-icon.png', await icon(180, 0.12));
await writeFile('public/icon-192.png', await icon(192, 0.12));
await writeFile('public/icon-512.png', await icon(512, 0.12));
// Maskable icons are cropped to a circle on Android, so the mark keeps to the central safe zone.
await writeFile('public/icon-maskable-512.png', await icon(512, 0.2));

// favicon.ico for browsers and tools that only request /favicon.ico: a single 32px PNG inside an ICO wrapper.
const png = await icon(32, 0.04);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
await writeFile('public/favicon.ico', Buffer.concat([header, png]));
