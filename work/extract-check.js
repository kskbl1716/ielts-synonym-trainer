const fs = require('fs');
const h = fs.readFileSync('outputs/index.html', 'utf8');
const s = h.indexOf('<script>');
const e = h.lastIndexOf('</script>');
if (s < 0 || e < 0) { console.error('script tags not found'); process.exit(1); }
fs.writeFileSync('work/check.js', h.slice(s + '<script>'.length, e), 'utf8');
console.log('check.js written, bytes:', Buffer.byteLength(h.slice(s, e)));
