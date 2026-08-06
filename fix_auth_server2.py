import re

with open("lib/auth-server.ts", "r") as f:
    content = f.read()

content = re.sub(
    r"const supabase = getSupabase\(\);([\s\n]+)const \{ data",
    r"const supabase = getSupabase();\n  if (!supabase) return null;\1const { data",
    content
)

with open("lib/auth-server.ts", "w") as f:
    f.write(content)
