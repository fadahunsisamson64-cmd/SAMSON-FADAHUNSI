import re

with open("app/book/[slug]/page.tsx", "r") as f:
    content = f.read()

# I replaced `<button` with `{bookingError && (...)} <button`
error_ui_regex = r"(\s+)\{bookingError && \([\s\n]+<div className=\"mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2\">[\s\n]+<span className=\"font-medium\">\{bookingError\}</span>[\s\n]+</div>[\s\n]+\)\}[\s\n]+<button"

# Let's revert all back to <button
content = re.sub(error_ui_regex, r"\1<button", content)

# Now, we manually add the error UI only to the confirm button
# The confirm button has: onClick={confirmBooking}
# We can search for <button\n                      onClick={confirmBooking}

error_ui = """
                  {bookingError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2">
                      <span className="font-medium">{bookingError}</span>
                    </div>
                  )}
                  <button"""

content = content.replace("                  <button\n                      onClick={confirmBooking}", error_ui + "\n                      onClick={confirmBooking}")

with open("app/book/[slug]/page.tsx", "w") as f:
    f.write(content)
