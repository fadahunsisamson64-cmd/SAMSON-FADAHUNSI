import os

files = ['app/dashboard/customers/page.tsx', 'app/dashboard/settings/page.tsx', 'app/dashboard/page.tsx']
old_str = """          <Link href="/book" className="flex items-center gap-3 px-3 py-2 text-brand-muted hover:bg-gray-50 hover:text-brand-dark rounded-lg font-medium transition-colors">
            <Sparkles className="w-5 h-5" />
            Customer Booking
          </Link>"""
new_str = """          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-brand-muted hover:bg-gray-50 hover:text-brand-dark rounded-lg font-medium transition-colors">
            <ShieldCheck className="w-5 h-5" />
            Admin Portal
          </Link>"""

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    content = content.replace(old_str, new_str)
    with open(f, 'w') as file:
        file.write(content)
