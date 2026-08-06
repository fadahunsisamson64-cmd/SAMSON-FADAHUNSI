'use server'

import { prisma } from '@/lib/prisma'

export async function getDashboardData(userId: string) {
  try {
    const business = await prisma.business.findFirst({
      where: { ownerId: userId },
      include: {
        bookings: {
          include: {
            customer: true,
            service: true,
            staff: {
              include: {
                user: true
              }
            }
          },
          orderBy: { startTime: 'asc' },
          take: 5
        }
      }
    });

    if (!business) {
      return { success: false, error: 'Business not found' };
    }

    return { 
      success: true, 
      data: {
        business,
        stats: {
          revenue: business.bookings.reduce((sum, b) => sum + (b.paymentStatus !== 'REFUNDED' ? b.totalPrice : 0), 0),
          appointments: business.bookings.length,
          activeClients: new Set(business.bookings.map(b => b.customerId)).size,
          completionRate: business.bookings.length ? (business.bookings.filter(b => b.status === 'COMPLETED').length / business.bookings.length * 100).toFixed(1) : '100'
        },
        upcomingAppointments: business.bookings.map(b => ({
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
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { success: false, error: 'Failed to fetch dashboard data' };
  }
}
