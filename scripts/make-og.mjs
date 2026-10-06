// Generate the site-wide default OpenGraph image (1200x630) with sharp.
// Run once: `node scripts/make-og.mjs`. Output: public/og-default.png
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', 'public', 'og-default.png');

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#013a30"/>
      <stop offset="55%" stop-color="#006653"/>
      <stop offset="100%" stop-color="#0a7d54"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- soft accent glow bottom-right -->
  <circle cx="1080" cy="560" r="240" fill="#9fe870" opacity="0.10"/>
  <circle cx="120" cy="80" r="160" fill="#9fe870" opacity="0.06"/>

  <!-- top accent bar -->
  <rect x="90" y="150" width="72" height="8" rx="4" fill="#9fe870"/>

  <!-- brand -->
  <text x="90" y="300" font-family="Poppins, Arial, sans-serif" font-size="92" font-weight="800" fill="#ffffff">Harada Oturaq</text>

  <!-- tagline -->
  <text x="92" y="372" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="500" fill="#d7f7e4">Azərbaycanda ən yaxşı restoranları kəşf et</text>

  <!-- pill features -->
  <g font-family="Inter, Arial, sans-serif" font-size="30" font-weight="600">
    <rect x="90" y="440" width="270" height="66" rx="33" fill="#ffffff" opacity="0.10"/>
    <text x="128" y="483" fill="#ffffff">🍽  Menyu &amp; qiymət</text>

    <rect x="384" y="440" width="240" height="66" rx="33" fill="#ffffff" opacity="0.10"/>
    <text x="422" y="483" fill="#ffffff">⭐  Rəylər</text>

    <rect x="648" y="440" width="300" height="66" rx="33" fill="#ffffff" opacity="0.10"/>
    <text x="686" y="483" fill="#ffffff">📍  Onlayn rezerv</text>
  </g>

  <!-- url -->
  <text x="90" y="580" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="600" fill="#9fe870">harada-oturaq.az</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log('Yazıldı:', out);
