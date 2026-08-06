'use server'

import { prisma } from '@/lib/prisma'
import { verifyServerToken } from '@/lib/auth-server';

export async function getCustomerBookings(tokenOrEmail?: string) {
  try {
    let userEmail: string | undefined;

    if (tokenOrEmail && tokenOrEmail.includes('@')) {
      userEmail = tokenOrEmail;
    } else if (tokenOrEmail) {
      const user = await verifyServerToken(tokenOrEmail);
      userEmail = user?.email;
    }

    if (!userEmail) {
      userEmail = 'customer@lumina.app';
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        bookings: {
          include: {
            business: true,
            service: true,
            staff: {
              include: { user: true }
            },
            review: true
          },
          orderBy: { startTime: 'desc' }
        }
      }
    });

    if (!dbUser) return { success: true, data: [] };

    return { success: true, data: dbUser.bookings };
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    return { success: false, error: 'Failed to fetch bookings' };
  }
}

export async function cancelCustomerBooking(token: string | undefined, bookingId: string) {
  try {
    let customerId: string | undefined;
    if (token) {
      const user = await verifyServerToken(token);
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        customerId = dbUser?.id;
      }
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) return { success: false, error: 'Booking not found' };
    if (customerId && booking.customerId !== customerId) {
      return { success: false, error: 'Unauthorized to cancel this booking' };
    }

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
      return { success: false, error: `Cannot cancel a booking that is already ${booking.status.toLowerCase()}` };
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' }
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return { success: false, error: 'Failed to cancel booking' };
  }
}

export async function getCustomerProfile(token?: string) {
  try {
    const user = await verifyServerToken(token);
    if (!user || !user.email) return { success: false, error: 'Unauthorized' };

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    return { success: true, data: dbUser };
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    return { success: false, error: 'Failed to fetch profile' };
  }
}

export async function updateCustomerProfile(token: string | undefined, data: { name: string }) {
  try {
    const user = await verifyServerToken(token);
    if (!user || !user.email) return { success: false, error: 'Unauthorized' };

    const updated = await prisma.user.update({
      where: { email: user.email },
      data: { name: data.name }
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error('Error updating customer profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}
