const fs = require('fs');
const content = fs.readFileSync('public/assets/Image/nestcraft-logo.svg', 'utf8');
const whiteContent = content.replace('fill="black"', 'fill="white"');
fs.writeFileSync('public/assets/Image/nestcraft-logo-white.svg', whiteContent);
