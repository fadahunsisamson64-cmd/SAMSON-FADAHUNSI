import glob

for filename in ["app/super-admin/page.tsx", "app/super-admin/businesses/page.tsx", "app/super-admin/users/page.tsx"]:
    with open(filename, "r") as f:
        content = f.read()

    # If it's not already importing getSupabase, add it
    if "getSupabase" not in content:
        content = content.replace("import { useEffect", "import { getSupabase } from '@/lib/supabase';\nimport { useEffect")

    # Inside load function, fetch session
    if "const res = await getAdmin" in content:
        replacement = """
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await getAdmin"""
        content = content.replace("const res = await getAdmin", replacement.strip() + "Admin")
        # Oops, wait, string replacement like that might double up "Admin".
        
