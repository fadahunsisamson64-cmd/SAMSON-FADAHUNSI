import glob

for filename in glob.glob("app/super-admin/**/*.tsx", recursive=True) + ["app/super-admin/page.tsx"]:
    try:
        with open(filename, "r") as f:
            content = f.read()
            
        content = content.replace("await getAdminBusinesses()", "await getAdminBusinesses(session.access_token)")
        content = content.replace("await getAdminDashboardData()", "await getAdminDashboardData(session.access_token)")
        content = content.replace("await getAdminUsers()", "await getAdminUsers(session.access_token)")
        
        with open(filename, "w") as f:
            f.write(content)
    except Exception as e:
        pass
