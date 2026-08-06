'use server'

import { prisma } from '@/lib/prisma'
import { verifyServerToken } from '@/lib/auth-server';

export async function getBusinessProfile(token?: string) {
  try {
    const user = await verifyServerToken(token);
    if (!user) return { success: false, error: 'Unauthorized' };

    const business = await prisma.business.findFirst({
      where: { ownerId: user.id }
    });

    if (!business) return { success: false, error: 'Business not found' };

    return { success: true, data: business };
  } catch (error) {
    console.error('Error fetching business:', error);
    return { success: false, error: 'Failed to fetch business' };
  }
}

export async function updateBusinessProfile(token: string | undefined, data: { name: string; description?: string; category?: string; address?: string; phone?: string }) {
  try {
    const user = await verifyServerToken(token);
    if (!user) return { success: false, error: 'Unauthorized' };

    const business = await prisma.business.findFirst({
      where: { ownerId: user.id }
    });

    if (!business) return { success: false, error: 'Business not found' };

    const updated = await prisma.business.update({
      where: { id: business.id },
      data: { 
        name: data.name,
        description: data.description,
        category: data.category,
        address: data.address,
        phone: data.phone
      }
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error('Error updating business:', error);
    return { success: false, error: 'Failed to update business' };
  }
}

export async function getBusinessServices(token?: string) {
  try {
    const user = await verifyServerToken(token);
    if (!user) return { success: false, error: 'Unauthorized' };

    const business = await prisma.business.findFirst({
      where: { ownerId: user.id },
      include: { services: true }
    });

    if (!business) return { success: false, error: 'Business not found' };

    return { success: true, data: business.services };
  } catch (error) {
    console.error('Error fetching services:', error);
    return { success: false, error: 'Failed to fetch services' };
  }
}

export async function addBusinessService(token: string | undefined, service: { name: string; price: number; duration: number; description?: string }) {
  try {
    const user = await verifyServerToken(token);
    if (!user) return { success: false, error: 'Unauthorized' };

    const business = await prisma.business.findFirst({
      where: { ownerId: user.id }
    });

    if (!business) return { success: false, error: 'Business not found' };

    const created = await prisma.service.create({
      data: {
        businessId: business.id,
        name: service.name,
        price: service.price,
        duration: service.duration,
        description: service.description
      }
    });

    return { success: true, data: created };
  } catch (error) {
    console.error('Error adding service:', error);
    return { success: false, error: 'Failed to add service' };
  }
}

export async function deleteBusinessService(token: string | undefined, serviceId: string) {
  try {
    const user = await verifyServerToken(token);
    if (!user) return { success: false, error: 'Unauthorized' };

    await prisma.service.delete({
      where: { id: serviceId }
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting service:', error);
    return { success: false, error: 'Failed to delete service' };
  }
}

export async function getBusinessStaff(token?: string) {
  try {
    const user = await verifyServerToken(token);
    if (!user) return { success: false, error: 'Unauthorized' };

    const business = await prisma.business.findFirst({
      where: { ownerId: user.id },
      include: {
        staff: {
          include: { user: true }
        }
      }
    });

    if (!business) return { success: false, error: 'Business not found' };

    return { success: true, data: business.staff };
  } catch (error) {
    console.error('Error fetching staff:', error);
    return { success: false, error: 'Failed to fetch staff' };
  }
}

export async function addBusinessStaff(token: string | undefined, staff: { name: string; role?: string }) {
  try {
    const user = await verifyServerToken(token);
    if (!user) return { success: false, error: 'Unauthorized' };

    const business = await prisma.business.findFirst({
      where: { ownerId: user.id }
    });

    if (!business) return { success: false, error: 'Business not found' };

    // Create shadow user record for staff
    const staffUser = await prisma.user.create({
      data: {
        name: staff.name,
        email: `staff_${Date.now()}@${business.slug}.lumina`,
        role: 'STAFF'
      }
    });

    const createdStaff = await prisma.staff.create({
      data: {
        businessId: business.id,
        userId: staffUser.id,
        role: staff.role || 'Service Specialist'
      },
      include: { user: true }
    });

    return { success: true, data: createdStaff };
  } catch (error) {
    console.error('Error adding staff:', error);
    return { success: false, error: 'Failed to add staff member' };
  }
}

export async function deleteBusinessStaff(token: string | undefined, staffId: string) {
  try {
    const user = await verifyServerToken(token);
    if (!user) return { success: false, error: 'Unauthorized' };

    await prisma.staff.delete({
      where: { id: staffId }
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting staff:', error);
    return { success: false, error: 'Failed to delete staff member' };
  }
}

export async function getBusinessAvailability(token?: string) {
  try {
    const user = await verifyServerToken(token);
    if (!user) return { success: false, error: 'Unauthorized' };

    const business = await prisma.business.findFirst({
      where: { ownerId: user.id },
      include: { availabilities: { orderBy: { dayOfWeek: 'asc' } } }
    });

    if (!business) return { success: false, error: 'Business not found' };

    return { success: true, data: business.availabilities };
  } catch (error) {
    console.error('Error fetching availability:', error);
    return { success: false, error: 'Failed to fetch availability' };
  }
}

export async function updateBusinessAvailability(
  token: string | undefined,
  availabilities: Array<{ dayOfWeek: number; startTime: string; endTime: string; isOpen: boolean }>
) {
  try {
    const user = await verifyServerToken(token);
    if (!user) return { success: false, error: 'Unauthorized' };

    const business = await prisma.business.findFirst({
      where: { ownerId: user.id }
    });

    if (!business) return { success: false, error: 'Business not found' };

    for (const item of availabilities) {
      await prisma.availability.upsert({
        where: {
          businessId_dayOfWeek: {
            businessId: business.id,
            dayOfWeek: item.dayOfWeek
          }
        },
        create: {
          businessId: business.id,
          dayOfWeek: item.dayOfWeek,
          startTime: item.startTime,
          endTime: item.endTime,
          isOpen: item.isOpen
        },
        update: {
          startTime: item.startTime,
          endTime: item.endTime,
          isOpen: item.isOpen
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating availability:', error);
    return { success: false, error: 'Failed to update availability' };
  }
}
