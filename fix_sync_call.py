import re

with open("app/dashboard/page.tsx", "r") as f:
    content = f.read()

content = re.sub(r'const syncResult = await syncUserAction\(\{[^}]+\}\);', 'const syncResult = await syncUserAction(session.access_token);', content)

with open("app/dashboard/page.tsx", "w") as f:
    f.write(content)
