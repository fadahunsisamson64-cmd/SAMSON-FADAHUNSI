with open("app/actions/booking.ts", "r") as f:
    content = f.read()

content = content.replace("['CANCELLED', 'NO_SHOW']", "['CANCELLED']")

with open("app/actions/booking.ts", "w") as f:
    f.write(content)
