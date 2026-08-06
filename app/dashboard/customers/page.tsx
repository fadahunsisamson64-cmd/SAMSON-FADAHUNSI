'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Loader2, Sparkles, Plus, Bell, Search, Filter, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import DashboardNavbar from '@/components/DashboardNavbar';
import { getCustomers } from '@/app/actions/customers';


export default function CustomersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
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

        const res = await getCustomers(session.user.id);
        if (res.success && res.data) {
          setCustomers(res.data);
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
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-brand-muted hover:bg-gray-50 hover:text-brand-dark rounded-lg font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/calendar" className="flex items-center gap-3 px-3 py-2 text-brand-muted hover:bg-gray-50 hover:text-brand-dark rounded-lg font-medium transition-colors">
            <Calendar className="w-5 h-5" />
            Calendar
          </Link>
          <Link href="/dashboard/customers" className="flex items-center gap-3 px-3 py-2 bg-brand-primary/10 text-brand-primary rounded-lg font-medium">
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
        <DashboardNavbar title="Customers" user={user} onLogout={handleLogout} />

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-brand-dark mb-1">Customer Directory</h2>
                <p className="text-brand-muted">Manage your client list and view their booking history.</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                  <input 
                    type="text" 
                    placeholder="Search customers..." 
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary w-full sm:w-64"
                  />
                </div>
                <button className="bg-brand-primary hover:bg-brand-secondary text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm">
                  <Plus className="w-5 h-5" />
                  Add Customer
                </button>
              </div>
            </div>

                        {customers.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-2">No customers yet</h3>
              <p className="text-brand-muted max-w-md mx-auto mb-6">
                When people book your services, they will appear here automatically. You can also add them manually.
              </p>
            </div>
            ) : (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                      <th className="p-4 pl-6">Customer</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Total Bookings</th>
                      <th className="p-4">Last Booking</th>
                      <th className="p-4 text-right pr-6">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 pl-6 font-medium text-brand-dark">{c.name || 'Unknown'}</td>
                        <td className="p-4 text-brand-muted">{c.email}</td>
                        <td className="p-4 text-brand-muted">{c.totalBookings}</td>
                        <td className="p-4 text-brand-muted">{c.lastBooking ? new Date(c.lastBooking).toLocaleDateString() : 'N/A'}</td>
                        <td className="p-4 text-right pr-6 font-medium text-brand-dark">${(c.totalSpent || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
