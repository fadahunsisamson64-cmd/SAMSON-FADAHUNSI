import glob

for filename in ["app/dashboard/calendar/page.tsx", "app/dashboard/customers/page.tsx"]:
    with open(filename, "r") as f:
        content = f.read()
    
    content = content.replace("await getCalendarBookings(session.user.id)", "await getCalendarBookings(session.access_token)")
    content = content.replace("await getCustomers(session.user.id)", "await getCustomers(session.access_token)")
    
    with open(filename, "w") as f:
        f.write(content)
