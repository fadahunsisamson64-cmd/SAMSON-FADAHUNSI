import os

with open('app/admin/page.tsx', 'r') as f:
    content = f.read()

# Replace the hardcoded variables with state variables and useEffect
new_imports = """'use client';
import { useEffect, useState } from 'react';
import { getAdminDashboardData } from '@/app/actions/admin';
import { Store, Users, DollarSign, Activity, TrendingUp, CalendarCheck, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getAdminDashboardData();
      if (res.success) {
        setData(res.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Businesses', value: data?.stats?.totalBusinesses || 0, change: '+12%', icon: Store },
    { label: 'Active Users', value: data?.stats?.activeUsers || 0, change: '+18%', icon: Users },
    { label: 'Total Revenue', value: '$' + (data?.stats?.totalRevenue || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}), change: '+24%', icon: DollarSign },
    { label: 'Total Bookings', value: data?.stats?.totalBookings || 0, change: '+8%', icon: CalendarCheck },
  ];

  const recentActivity = data?.recentActivity || [];
"""

import re
content = re.sub(r"'use client';[\s\S]*?const recentActivity = \[.*?\];", new_imports, content, flags=re.DOTALL)

with open('app/admin/page.tsx', 'w') as f:
    f.write(content)

