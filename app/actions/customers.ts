'use server'

import { prisma } from '@/lib/prisma'

import { verifyServerToken } from '@/lib/auth-server';

export async function getCustomers(token?: string) {
  try {
    let business: any = null;
    if (token) {
      const user = await verifyServerToken(token);
      if (user?.id) {
        business = await prisma.business.findFirst({
          where: { ownerId: user.id },
          include: {
            bookings: {
              include: { customer: true }
            }
          }
        });
      }
    }

    if (!business) {
      business = await prisma.business.findFirst({
        include: {
          bookings: {
            include: { customer: true }
          }
        }
      });
    }

    if (!business) return { success: false, error: 'Business not found' };

    // Extract unique customers
    const uniqueCustomersMap = new Map();
    business.bookings.forEach((b: any) => {
      if (b.customer && !uniqueCustomersMap.has(b.customer.id)) {
        uniqueCustomersMap.set(b.customer.id, {
          id: b.customer.id,
          name: b.customer.name,
          email: b.customer.email,
          totalBookings: business.bookings.filter((bk: any) => bk.customerId === b.customer.id).length,
          lastBooking: business.bookings.filter((bk: any) => bk.customerId === b.customer.id).sort((x: any, y: any) => y.startTime.getTime() - x.startTime.getTime())[0]?.startTime,
          totalSpent: business.bookings.filter((bk: any) => bk.customerId === b.customer.id && bk.paymentStatus !== 'REFUNDED').reduce((sum: number, bk: any) => sum + bk.totalPrice, 0)
        });
      }
    });

    const customers = Array.from(uniqueCustomersMap.values());

    return { success: true, data: customers };
  } catch (error) {
    console.error('Error fetching customers:', error);
    return { success: false, error: 'Failed to fetch customers' };
  }
}
