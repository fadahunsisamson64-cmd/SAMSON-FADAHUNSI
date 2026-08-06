import re

for filename in ["app/super-admin/page.tsx", "app/super-admin/businesses/page.tsx", "app/super-admin/users/page.tsx"]:
    with open(filename, "r") as f:
        content = f.read()

    # Add useRouter
    if "useRouter" not in content:
        content = content.replace("import { useEffect", "import { useRouter } from 'next/navigation';\nimport { useEffect")
    
    # In the load function
    content = re.sub(
        r"(const res = await getAdmin[^;]+;)([\s\n]+)if \(res\.success\)",
        r"\1\n      if (!res.success) { window.location.href = '/dashboard'; return; }\n      if (res.success)",
        content
    )
    # The users and businesses pages use: if (res.success && res.data)
    content = re.sub(
        r"(const res = await getAdmin[^;]+;)([\s\n]+)if \(res\.success && res\.data\)",
        r"\1\n      if (!res.success) { window.location.href = '/dashboard'; return; }\n      if (res.success && res.data)",
        content
    )

    with open(filename, "w") as f:
        f.write(content)
