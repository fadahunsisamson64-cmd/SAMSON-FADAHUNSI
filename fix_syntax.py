import re

for filename in ["app/actions/admin.ts", "app/actions/auth.ts"]:
    with open(filename, "r") as f:
        content = f.read()
    content = content.replace("import { verifyAdmin } from '@/lib/auth-server';\n'use server'", "'use server'\nimport { verifyAdmin } from '@/lib/auth-server';")
    content = content.replace("import { verifyServerToken } from '@/lib/auth-server';\n'use server'", "'use server'\nimport { verifyServerToken } from '@/lib/auth-server';")
    with open(filename, "w") as f:
        f.write(content)

with open("app/actions/dashboard.ts", "r") as f:
    content = f.read()
content = content.replace("const userId = user.id; {\n  try {\n", "const userId = user.id;\n")
# We need to make sure the brackets match in dashboard.ts
