import re

with open("app/book/[slug]/page.tsx", "r") as f:
    content = f.read()

# Add bookingError display
replacement = """
                  {bookingError && (
                    <div className="mb-6 p-4 bg-brand-danger/10 text-brand-danger rounded-xl font-medium text-sm text-center">
                      {bookingError}
                    </div>
                  )}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-gray-100">
                    <button
"""

content = content.replace("                  <div className=\"flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-gray-100\">\n                    <button", replacement)

with open("app/book/[slug]/page.tsx", "w") as f:
    f.write(content)
