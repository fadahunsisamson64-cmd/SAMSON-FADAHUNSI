const fs = require('fs');

const files = [
  'app/dashboard/page.tsx',
  'app/dashboard/calendar/page.tsx',
  'app/dashboard/customers/page.tsx',
  'app/dashboard/settings/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove all Admin Panel links first
  content = content.replace(/<Link href="\/admin"[\s\S]*?<\/Link>\n*/g, '');
  
  // Add it back cleanly before the Settings link
  const adminLink = `          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-brand-muted hover:bg-gray-50 hover:text-brand-dark rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Admin Panel
          </Link>\n`;
          
  content = content.replace(/(<Link href="\/dashboard\/settings")/g, adminLink + '          $1');
  
  fs.writeFileSync(file, content);
}
