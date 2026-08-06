'use server'

import { prisma } from '@/lib/prisma'

export async function getCalendarBookings(userId: string) {
  try {
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
