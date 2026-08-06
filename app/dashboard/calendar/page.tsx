'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Loader2, Sparkles, Plus, Bell, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import DashboardNavbar from '@/components/DashboardNavbar';
import { getCalendarBookings } from '@/app/actions/calendar';


export default function CalendarPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
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

        const res = await getCalendarBookings(session.user.id);
        if (res.success && res.data) {
          setBookings(res.data);
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

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
          <Link href="/dashboard/calendar" className="flex items-center gap-3 px-3 py-2 bg-brand-primary/10 text-brand-primary rounded-lg font-medium">
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
        <DashboardNavbar title="Calendar" user={user} onLogout={handleLogout} />

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-brand-dark">October 2023</h2>
              <div className="flex gap-1">
                <button className="p-2 border border-gray-200 rounded-lg text-brand-muted hover:bg-gray-50">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 border border-gray-200 rounded-lg text-brand-muted hover:bg-gray-50">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-gray-100 p-1 rounded-lg flex text-sm">
                <button className="px-3 sm:px-4 py-1.5 rounded bg-white text-brand-dark font-medium shadow-sm">Month</button>
                <button className="px-3 sm:px-4 py-1.5 rounded text-brand-muted hover:text-brand-dark font-medium">Week</button>
                <button className="px-3 sm:px-4 py-1.5 rounded text-brand-muted hover:text-brand-dark font-medium">Day</button>
              </div>
              <button className="bg-brand-primary hover:bg-brand-secondary text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm text-sm sm:text-base">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Add Booking
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden overflow-x-auto">
            <div className="min-w-[640px] flex-1 flex flex-col">
              <div className="grid grid-cols-7 border-b border-gray-200">
              {days.map((day) => (
                <div key={day} className="p-4 text-center text-sm font-medium text-brand-muted">
                  {day}
                </div>
              ))}
            </div>
            <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-px bg-gray-200">
              {Array.from({ length: 35 }).map((_, i) => {
                const dayNumber = i - 1;
                const isCurrentMonth = dayNumber > 0 && dayNumber <= 31;
                const todayBookings = bookings.filter(b => {
                  const d = new Date(b.startTime);
                  return d.getDate() === dayNumber && d.getMonth() === new Date().getMonth(); // Simplified for current month
                });

                return (
                  <div key={i} className={cn("bg-white p-2 min-h-[100px]", !isCurrentMonth && "bg-gray-50/50")}>
                    {isCurrentMonth && (
                      <span className={cn("inline-flex w-7 h-7 items-center justify-center rounded-full text-sm font-medium mb-1", dayNumber === new Date().getDate() ? "bg-brand-primary text-white" : "text-brand-dark")}>
                        {dayNumber}
                      </span>
                    )}
                    
                    {isCurrentMonth && todayBookings.map((booking: any) => (
                      <div key={booking.id} className="px-2 py-1 bg-brand-accent/10 text-brand-accent rounded text-xs font-medium truncate mb-1" title={`${booking.service?.name} with ${booking.customer?.name}`}>
                        {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {booking.service?.name}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
