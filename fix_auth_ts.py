import re

with open("app/actions/auth.ts", "r") as f:
    content = f.read( )

content = content.replace("if (!supabaseUser) return { success: false, error: 'Unauthorized' };", "if (!supabaseUser || !supabaseUser.email) return { success: false, error: 'Unauthorized' };")

with open("app/actions/auth.ts", "w") as f:
    f.write(content)
