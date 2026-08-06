'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getBusinessForBooking(slug: string) {
  try {
    const business = await prisma.business.findUnique({
      where: { slug },
      include: {
        services: true,
        staff: {
          include: { user: true }
        }
      }
    });

    if (!business) return { success: false, error: 'Business not found' };

    return { success: true, data: business };
  } catch (error) {
    console.error('Error fetching business:', error);
    return { success: false, error: 'Failed to fetch business' };
  }
}

export async function createBooking(data: {
  businessId: string;
  serviceId: string;
  staffId?: string;
  customerName: string;
  customerEmail: string;
  startTime: Date;
  endTime: Date;
  price: number;
}) {
  try {
    // Upsert customer based on email
    let user = await prisma.user.findUnique({ where: { email: data.customerEmail } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: data.customerEmail,
          name: data.customerName,
          role: 'CUSTOMER'
        }
      });
    }

    const booking = await prisma.booking.create({
      data: {
        customerId: user.id,
        businessId: data.businessId,
        serviceId: data.serviceId,
        staffId: data.staffId,
        startTime: data.startTime,
        endTime: data.endTime,
        totalPrice: data.price,
        status: 'PENDING',
        paymentStatus: 'PENDING'
      }
    });

    return { success: true, data: booking };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, error: 'Failed to create booking' };
  }
}
