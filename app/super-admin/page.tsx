'use client';

import { getSupabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAdminDashboardData } from '@/app/actions/admin';
import { Store, Users, DollarSign, Activity, TrendingUp, CalendarCheck, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // could redirect or handle error
        return;
      }
      const res = await getAdminDashboardData(session.access_token);
      if (!res.success) { window.location.href = '/dashboard'; return; }
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
    { label: 'Total Businesses', value: data?.stats?.totalBusinesses || 0, change: '+0%', icon: Store },
    { label: 'Active Users', value: data?.stats?.activeUsers || 0, change: '+0%', icon: Users },
    { label: 'Total Revenue', value: '$' + (data?.stats?.totalRevenue || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}), change: '+0%', icon: DollarSign },
    { label: 'Total Bookings', value: data?.stats?.totalBookings || 0, change: '+0%', icon: CalendarCheck },
  ];

  const recentActivity = data?.recentActivity || [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark mb-1">Platform Overview</h1>
          <p className="text-brand-muted">Monitor platform performance, businesses, and revenue.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-gray-200 text-brand-dark text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5 outline-none shadow-sm cursor-pointer">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-background flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-brand-primary" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-brand-success bg-brand-success/10 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
            <h3 className="text-sm font-medium text-brand-muted mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-brand-dark">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-brand-dark">Revenue Growth</h2>
            <button className="text-brand-primary hover:text-brand-accent text-sm font-medium transition-colors">View Report</button>
          </div>
          <div className="h-[300px] flex items-center justify-center pb-4 text-brand-muted text-sm border-2 border-dashed border-gray-100 rounded-xl">
            Revenue chart data will populate here when sufficient booking data is available.
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-brand-dark">Recent Activity</h2>
            <button className="text-brand-primary hover:text-brand-accent text-sm font-medium transition-colors">See All</button>
          </div>
          
          <div className="flex-1 space-y-6">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-brand-muted">No recent activity.</p>
            ) : (
              recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'pending' ? 'bg-brand-warning' :
                      activity.status === 'completed' ? 'bg-brand-success' :
                      activity.status === 'attention' ? 'bg-brand-danger' :
                      'bg-brand-primary'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-dark">{activity.action}</p>
                    <p className="text-sm text-brand-muted mb-1">{activity.subject}</p>
                    <p className="text-xs text-brand-muted/70 flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
