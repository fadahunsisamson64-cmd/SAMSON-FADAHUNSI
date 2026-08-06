import re

with open("app/book/[slug]/page.tsx", "r") as f:
    content = f.read()

# Add a bookingError state
if "const [bookingError, setBookingError]" not in content:
    content = content.replace("const [submitting, setSubmitting] = useState(false);", "const [submitting, setSubmitting] = useState(false);\n  const [bookingError, setBookingError] = useState<string | null>(null);")

# Replace alert with state
content = content.replace("alert(res.error || 'Failed to book');", "setBookingError(res.error || 'Failed to book');")

# Reset error on submission
content = content.replace("setSubmitting(true);", "setSubmitting(true);\n    setBookingError(null);")

# Show error in UI
error_ui = """
          {bookingError && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2">
              <span className="font-medium">{bookingError}</span>
            </div>
          )}
          <button
"""

content = content.replace("          <button", error_ui)

with open("app/book/[slug]/page.tsx", "w") as f:
    f.write(content)
