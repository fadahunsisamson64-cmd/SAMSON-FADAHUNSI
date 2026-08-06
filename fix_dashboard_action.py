import re

with open("app/actions/dashboard.ts", "r") as f:
    content = f.read()

# We should fetch all bookings, or just use separate queries.
# Since it's server action, it's fine.

replacement = """
    const business = await prisma.business.findFirst({
      where: { ownerId: userId }
    });

    if (!business) {
      return { success: false, error: 'Business not found' };
    }

    const allBookings = await prisma.booking.findMany({
      where: { businessId: business.id },
      include: {
        customer: true,
        service: true,
        staff: {
          include: {
            user: true
          }
        }
      },
      orderBy: { startTime: 'asc' }
    });

    const upcomingBookings = allBookings.filter(b => b.startTime >= new Date()).slice(0, 5);

    return { 
      success: true, 
      data: {
        business,
        stats: {
          revenue: allBookings.reduce((sum, b) => sum + (b.paymentStatus !== 'REFUNDED' ? b.totalPrice : 0), 0),
          appointments: allBookings.length,
          activeClients: new Set(allBookings.map(b => b.customerId)).size,
          completionRate: allBookings.length ? (allBookings.filter(b => b.status === 'COMPLETED').length / allBookings.length * 100).toFixed(1) : '100'
        },
        upcomingAppointments: upcomingBookings.map(b => ({
          id: b.id,
          customerName: b.customer?.name || 'Unknown',
          serviceName: b.service?.name || 'Unknown Service',
          time: new Date(b.startTime).toLocaleString(),
          staffName: b.staff?.user?.name || 'Unassigned',
          status: b.status,
          price: `$${b.totalPrice.toFixed(2)}`
        }))
      } 
    };
"""

content = re.sub(
    r"const business = await prisma\.business\.findFirst\(\{.*?return\s*\{.*?\}\s*\};\s*\} catch \(error\)",
    replacement.strip() + "\n  } catch (error)",
    content,
    flags=re.DOTALL
)

with open("app/actions/dashboard.ts", "w") as f:
    f.write(content)
