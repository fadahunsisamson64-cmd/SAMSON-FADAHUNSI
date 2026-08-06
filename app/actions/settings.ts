'use server'

import { prisma } from '@/lib/prisma'
import { verifyServerToken } from '@/lib/auth-server';

export async function getBusinessProfile(token: string) {
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

export async function updateBusinessProfile(token: string, data: { name: string; description?: string }) {
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
        description: data.description 
      }
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error('Error updating business:', error);
    return { success: false, error: 'Failed to update business' };
  }
}
