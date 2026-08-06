'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Loader2, Sparkles, Plus, Bell, ShieldCheck, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    
    const checkUser = async () => {
      try {
        const supabase = getSupabase();
        if (!supabase) {
          setIsLoading(false);
          return;
        }
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }
        
        setUser(session.user);

        // Sync user in background (or wait)
        const { syncUserAction } = await import('@/app/actions/auth');
        const syncResult = await syncUserAction(session.access_token);

        // Fetch real data
        const { getDashboardData } = await import('@/app/actions/dashboard');
        const dbData = await getDashboardData(session.access_token);
        
        if (dbData.success && dbData.data) {
           setDashboardData(dbData.data);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!user) return null;

  

  return (
    <div className="min-h-screen bg-brand-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-dark">Lumina</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-brand-primary/10 text-brand-primary rounded-lg font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/calendar" className="flex items-center gap-3 px-3 py-2 text-brand-muted hover:bg-gray-50 hover:text-brand-dark rounded-lg font-medium transition-colors">
            <Calendar className="w-5 h-5" />
            Calendar
          </Link>
          <Link href="/dashboard/customers" className="flex items-center gap-3 px-3 py-2 text-brand-muted hover:bg-gray-50 hover:text-brand-dark rounded-lg font-medium transition-colors">
            <Users className="w-5 h-5" />
            Customers
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-brand-muted hover:bg-gray-50 hover:text-brand-dark rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-left text-brand-danger hover:bg-brand-danger/10 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <DashboardNavbar title="Dashboard" user={user} onLogout={handleLogout} />

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-brand-dark mb-1">Overview</h1>
                <p className="text-brand-muted">Here is what is happening with your appointments and revenue today.</p>
              </div>
              <button className="bg-brand-primary hover:bg-brand-secondary text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm self-start sm:self-auto">
                <Plus className="w-5 h-5" />
                New Appointment
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-brand-muted">Total Revenue</span>
                  <div className="p-2 bg-brand-primary/10 rounded-xl text-brand-primary">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-brand-dark mb-1">${(dashboardData?.stats?.revenue || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-brand-muted">Appointments</span>
                  <div className="p-2 bg-brand-accent/10 rounded-xl text-brand-accent">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-brand-dark mb-1">{dashboardData?.stats?.appointments || 0}</div>
                
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-brand-muted">Active Clients</span>
                  <div className="p-2 bg-purple-500/10 rounded-xl text-purple-600">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-brand-dark mb-1">{dashboardData?.stats?.activeClients || 0}</div>
                
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-brand-muted">Completion Rate</span>
                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-brand-dark mb-1">{dashboardData?.stats?.completionRate || 0}%</div>
                
              </div>
            </div>

            {/* Upcoming Appointments Table */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-brand-dark">Upcoming Appointments</h3>
                  <p className="text-xs text-brand-muted">Your scheduled sessions for today and this week</p>
                </div>
                <Link href="/dashboard/calendar" className="text-sm font-semibold text-brand-primary hover:text-brand-accent transition-colors">
                  View Full Calendar →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                      <th className="p-4 pl-6">Client</th>
                      <th className="p-4">Service</th>
                      <th className="p-4">Date &amp; Time</th>
                      <th className="p-4">Staff</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right pr-6">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {dashboardData?.upcomingAppointments?.length > 0 ? dashboardData.upcomingAppointments.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 pl-6 font-medium text-brand-dark">{item.customerName}</td>
                        <td className="p-4 text-brand-muted">{item.serviceName}</td>
                        <td className="p-4 text-brand-muted">{item.time}</td>
                        <td className="p-4 text-brand-muted">{item.staffName}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6 font-medium text-brand-dark">{item.price}</td>
                      </tr>
                    )) : null}
                  </tbody>
                </table>
              {!dashboardData?.upcomingAppointments?.length && <div className="p-8 text-center text-brand-muted">No upcoming appointments.</div>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
