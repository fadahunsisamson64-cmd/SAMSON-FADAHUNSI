'use server'
import { verifyAdmin } from '@/lib/auth-server';

import { prisma } from '@/lib/prisma'

export async function getAdminDashboardData(token?: string) {
  try {
    const admin = await verifyAdmin(token);
    if (!admin) return { success: false, error: 'Unauthorized' };
    const totalBusinesses = await prisma.business.count();
    const activeUsers = await prisma.user.count();
    
    // Revenue from all bookings
    const bookings = await prisma.booking.findMany({
      where: { paymentStatus: { in: ['PAID', 'DEPOSIT_PAID', 'PENDING'] } }
    });
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const totalBookings = await prisma.booking.count();

    const recentBusinesses = await prisma.business.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
      include: { owner: true }
    });

    return {
      success: true,
      data: {
        stats: {
          totalBusinesses,
          activeUsers,
          totalRevenue,
          totalBookings
        },
        recentActivity: recentBusinesses.map(b => ({
          id: b.id,
          action: 'New business registered',
          subject: b.name,
          time: b.createdAt.toLocaleDateString(),
          status: 'completed'
        }))
      }
    };
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return { success: false, error: 'Failed to fetch admin data' };
  }
}

export async function getAdminBusinesses(token?: string) {
  try {
    const admin = await verifyAdmin(token);
    if (!admin) return { success: false, error: 'Unauthorized' };
    const businesses = await prisma.business.findMany({
      include: {
        owner: true,
        bookings: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = businesses.map(b => {
      const revenue = b.bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      return {
        id: b.id,
        name: b.name,
        owner: b.owner?.name || b.owner?.email || 'Unknown',
        type: 'Business',
        status: 'Active',
        joined: b.createdAt.toLocaleDateString(),
        revenue: '$' + revenue.toFixed(2)
      };
    });

    return { success: true, data: formatted };
  } catch (error) {
    console.error('Error fetching admin businesses:', error);
    return { success: false, error: 'Failed to fetch businesses' };
  }
}

export async function getAdminUsers(token?: string) {
  try {
    const admin = await verifyAdmin(token);
    if (!admin) return { success: false, error: 'Unauthorized' };
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const formatted = users.map(u => ({
      id: u.id,
      name: u.name || 'Unnamed User',
      email: u.email,
      role: u.role === 'ADMIN' ? 'Administrator' : u.role === 'BUSINESS_OWNER' ? 'Business Owner' : 'Customer',
      lastActive: u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : 'N/A'
    }));

    return { success: true, data: formatted };
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return { success: false, error: 'Failed to fetch users' };
  }
}
