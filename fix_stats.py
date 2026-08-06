import os
with open('app/actions/dashboard.ts', 'r') as f:
    content = f.read()

new_content = content.replace('        upcomingAppointments:', '''        stats: {
          revenue: business.bookings.reduce((sum, b) => sum + (b.paymentStatus !== 'REFUNDED' ? b.totalPrice : 0), 0),
          appointments: business.bookings.length,
          activeClients: new Set(business.bookings.map(b => b.customerId)).size,
          completionRate: business.bookings.length ? (business.bookings.filter(b => b.status === 'COMPLETED').length / business.bookings.length * 100).toFixed(1) : '100'
        },
        upcomingAppointments:''')

with open('app/actions/dashboard.ts', 'w') as f:
    f.write(new_content)
