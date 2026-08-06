const fs = require('fs');
let content = fs.readFileSync('app/dashboard/page.tsx', 'utf8');
content = content.replace(/<Settings className="w-5 h-5" \/>\s*Admin Panel/g, '<ShieldCheck className="w-5 h-5" />\n            Admin Panel');
fs.writeFileSync('app/dashboard/page.tsx', content);
