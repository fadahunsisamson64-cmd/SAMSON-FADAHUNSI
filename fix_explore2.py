import re

with open("app/explore/page.tsx", "r") as f:
    content = f.read()

# Add SearchInput import
content = content.replace("import Image from 'next/image';", "import Image from 'next/image';\nimport SearchInput from '@/components/SearchInput';\nimport { Suspense } from 'react';")

# Replace the input block with SearchInput
input_regex = r"<div className=\"relative max-w-2xl mx-auto\">.*?</div>\s*</div>\s*</div>"
# Wait, this might be tricky to regex.

with open("app/explore/page.tsx", "w") as f:
    f.write(content)
