import os
with open('app/dashboard/page.tsx', 'r') as f:
    content = f.read()

# Revenue
content = content.replace('<div className="text-3xl font-bold text-brand-dark mb-1">$12,450.00</div>', '<div className="text-3xl font-bold text-brand-dark mb-1">${(dashboardData?.stats?.revenue || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>')
content = content.replace('<div className="text-sm text-brand-success font-medium">+18% vs last month</div>', '')

# Appointments
content = content.replace('<div className="text-3xl font-bold text-brand-dark mb-1">142</div>', '<div className="text-3xl font-bold text-brand-dark mb-1">{dashboardData?.stats?.appointments || 0}</div>')
content = content.replace('<div className="text-sm text-brand-success font-medium">+12% vs last month</div>', '')

# Active Clients
content = content.replace('<div className="text-3xl font-bold text-brand-dark mb-1">89</div>', '<div className="text-3xl font-bold text-brand-dark mb-1">{dashboardData?.stats?.activeClients || 0}</div>')
content = content.replace('<div className="text-sm text-brand-success font-medium">+8% vs last month</div>', '')

# Completion Rate
content = content.replace('<div className="text-3xl font-bold text-brand-dark mb-1">98.5%</div>', '<div className="text-3xl font-bold text-brand-dark mb-1">{dashboardData?.stats?.completionRate || 0}%</div>')
content = content.replace('<div className="text-sm text-brand-success font-medium">+2.1% improvement</div>', '')

with open('app/dashboard/page.tsx', 'w') as f:
    f.write(content)
