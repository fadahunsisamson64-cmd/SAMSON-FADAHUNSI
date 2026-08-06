'use server'
import { verifyServerToken } from '@/lib/auth-server';

import { prisma } from '@/lib/prisma'

export async function syncUserAction(token?: string) {
  try {
    const supabaseUser = await verifyServerToken(token);
    if (!supabaseUser || !supabaseUser.email) return { success: false, error: 'Unauthorized' };
    
    const user = await prisma.user.upsert({
      where: { email: supabaseUser.email },
      update: {
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email.split('@')[0],
      },
      create: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email.split('@')[0],
        role: 'BUSINESS_OWNER',
      }
    });// Ensure business exists
    const existingBusiness = await prisma.business.findFirst({
      where: { ownerId: user.id }
    });

    if (!existingBusiness) {
      const businessName = supabaseUser.user_metadata?.full_name 
        ? `${supabaseUser.user_metadata.full_name}'s Business` 
        : 'My Business';
      const slug = businessName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
      
      await prisma.business.create({
        data: {
          name: businessName,
          slug,
          ownerId: user.id,
        }
      });
    }

    return { success: true, user }
  } catch (error) {
    console.error('Error syncing user:', error)
    return { success: false, error: 'Failed to sync user' }
  }
}
