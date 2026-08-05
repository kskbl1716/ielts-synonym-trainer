const fs = require('fs');
const h = fs.readFileSync('outputs/index.html','utf8');
const i = h.indexOf('<script>');
const j = h.indexOf('</script>', i);
if(i<0||j<0) throw new Error('script block not found');
fs.writeFileSync('work/check-v4.js', h.slice(i+8, j), 'utf8');
console.log('extracted', j-i-8, 'bytes');
