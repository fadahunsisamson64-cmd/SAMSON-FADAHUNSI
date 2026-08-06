with open("lib/auth-server.ts", "r") as f:
    content = f.read()

content = content.replace(
    "const supabase = getSupabase();\n    const { data:",
    "const supabase = getSupabase();\n    if (!supabase) return null;\n    const { data:"
)

with open("lib/auth-server.ts", "w") as f:
    f.write(content)
