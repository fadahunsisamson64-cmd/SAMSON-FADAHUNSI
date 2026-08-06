import os
with open('app/dashboard/page.tsx', 'r') as f:
    content = f.read()

content = content.replace('))}                  </tbody>', ')) : null}                  </tbody>')

with open('app/dashboard/page.tsx', 'w') as f:
    f.write(content)
