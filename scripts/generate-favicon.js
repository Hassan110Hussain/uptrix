const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgContent = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#080e0b"/>
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <path d="M16 2 L28 8 L28 16 C28 23 23 28 16 30 C9 28 4 23 4 16 L4 8 Z" 
        fill="#00c896" 
        opacity="0.2"
        filter="url(#glow)"/>
  <path d="M16 3 L27 8.5 L27 16 C27 22.5 22.5 27 16 29 C9.5 27 5 22.5 5 16 L5 8.5 Z" 
        fill="none" 
        stroke="#00c896" 
        stroke-width="2"/>
  <path d="M11 10 L11 17 C11 19.76 13.24 22 16 22 C18.76 22 21 19.76 21 17 L21 10" 
        fill="none" 
        stroke="#00c896" 
        stroke-width="3" 
        stroke-linecap="round"/>
</svg>
`;

const publicDir = path.join(__dirname, '..', 'public');

async function generateFavicon() {
  try {
    // Generate PNG at 32x32
    await sharp(Buffer.from(svgContent))
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon-32.png'));

    // Generate PNG at 16x16
    await sharp(Buffer.from(svgContent))
      .resize(16, 16)
      .png()
      .toFile(path.join(publicDir, 'favicon-16.png'));

    console.log('✓ Generated favicon PNGs');
    console.log('Note: For a proper .ico file, use an online converter like:');
    console.log('  https://convertio.co/png-ico/');
    console.log('  Upload favicon-32.png and favicon-16.png');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon();
