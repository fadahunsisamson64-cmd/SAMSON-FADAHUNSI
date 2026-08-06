'use server'

import { prisma } from '@/lib/prisma'
import { verifyServerToken } from '@/lib/auth-server';

export async function getDashboardData(token?: string) {
  try {
    let business: any = null;
    
    if (token) {
      const user = await verifyServerToken(token);
      if (user?.id) {
        business = await prisma.business.findFirst({
          where: { ownerId: user.id }
        });
      }
    }

    if (!business) {
      business = await prisma.business.findFirst({
        include: { services: true }
      });
    }

    if (!business) {
      return { success: false, error: 'No business profile found' };
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
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { success: false, error: 'Failed to fetch dashboard data' };
  }
}
