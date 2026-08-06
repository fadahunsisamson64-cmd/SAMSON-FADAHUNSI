import re

with open("app/explore/page.tsx", "r") as f:
    content = f.read()

# Replace include reviews with include bookings: { include: { review: true } }
content = content.replace("reviews: true", "bookings: { include: { review: true } }")

# Also need to fix the mapping: business.reviews doesn't exist, we must get reviews from bookings
content = content.replace("business.reviews.length", "business.bookings.filter(b => b.review).length")
content = content.replace("business.reviews.reduce((a, b) => a + b.rating, 0)", "business.bookings.filter(b => b.review).reduce((a, b) => a + b.review!.rating, 0)")

with open("app/explore/page.tsx", "w") as f:
    f.write(content)
