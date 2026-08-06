import re

for filename in ["app/super-admin/page.tsx", "app/super-admin/businesses/page.tsx", "app/super-admin/users/page.tsx"]:
    with open(filename, "r") as f:
        content = f.read()

    if "getSupabase" not in content:
        content = content.replace("import { useEffect", "import { getSupabase } from '@/lib/supabase';\nimport { useEffect")

    pattern = r"const res = await getAdmin([^;]+)\(session\.access_token\);"
    replacement = r"""const supabase = getSupabase();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // could redirect or handle error
        return;
      }
      const res = await getAdmin\1(session.access_token);"""
      
    content = re.sub(pattern, replacement, content)

    with open(filename, "w") as f:
        f.write(content)

