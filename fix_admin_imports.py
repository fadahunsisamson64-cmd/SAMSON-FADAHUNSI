import re

for filename in ["app/super-admin/businesses/page.tsx", "app/super-admin/users/page.tsx"]:
    with open(filename, "r") as f:
        content = f.read()

    # Move "use client" to the top
    content = content.replace("import { getSupabase } from '@/lib/supabase';\n'use client';", "'use client';\nimport { getSupabase } from '@/lib/supabase';\n")
    
    with open(filename, "w") as f:
        f.write(content)
