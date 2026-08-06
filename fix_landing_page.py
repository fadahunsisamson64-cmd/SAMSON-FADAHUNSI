import re

with open("app/page.tsx", "r") as f:
    content = f.read()

if "/explore" not in content:
    content = content.replace('href="/login" className="px-6 py-2 rounded-xl bg-brand-primary text-white font-medium hover:bg-brand-accent transition-colors"', 'href="/explore" className="px-6 py-2 rounded-xl bg-brand-primary/10 text-brand-primary font-medium hover:bg-brand-primary/20 transition-colors hidden sm:block">Explore Businesses</Link><Link href="/login" className="px-6 py-2 rounded-xl bg-brand-primary text-white font-medium hover:bg-brand-accent transition-colors"')
    
    with open("app/page.tsx", "w") as f:
        f.write(content)
