'use server'

import { prisma } from '@/lib/prisma'

import { verifyServerToken } from '@/lib/auth-server';

export async function getCalendarBookings(token: string) {
  try {
    const user = await verifyServerToken(token);
    if (!user) return { success: false, error: 'Unauthorized' };
    const userId = user.id;
    const business = await prisma.business.findFirst({
      where: { ownerId: userId },
    });

    if (!business) return { success: false, error: 'Business not found' };

    const bookings = await prisma.booking.findMany({
      where: {
        businessId: business.id,
      },
      include: {
        customer: true,
        service: true,
      }
    });

    return { success: true, data: bookings };
  } catch (error) {
    console.error('Error fetching calendar:', error);
    return { success: false, error: 'Failed to fetch calendar data' };
  }
}
