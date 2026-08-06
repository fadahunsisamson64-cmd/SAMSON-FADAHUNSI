import re

with open('app/admin/page.tsx', 'r') as f:
    content = f.read()

# Replace the bar chart with a placeholder for real data
chart_code = r'<div className="h-\[300px\] flex items-end justify-between gap-2 pb-4">.*?</div>'
replacement = """<div className="h-[300px] flex items-center justify-center pb-4 text-brand-muted text-sm border-2 border-dashed border-gray-100 rounded-xl">
            Revenue chart data will populate here when sufficient booking data is available.
          </div>"""

content = re.sub(chart_code, replacement, content, flags=re.DOTALL)

with open('app/admin/page.tsx', 'w') as f:
    f.write(content)
