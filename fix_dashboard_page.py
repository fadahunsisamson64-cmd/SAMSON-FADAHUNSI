import re

with open("app/dashboard/page.tsx", "r") as f:
    content = f.read()

content = content.replace("const dbData = await getDashboardData(session.user.id);", "const dbData = await getDashboardData(session.access_token);")

with open("app/dashboard/page.tsx", "w") as f:
    f.write(content)
