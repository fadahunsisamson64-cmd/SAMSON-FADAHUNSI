'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Loader2, Sparkles, Bell, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import DashboardNavbar from '@/components/DashboardNavbar';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
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
          <Link href="/dashboard/customers" className="flex items-center gap-3 px-3 py-2 text-brand-muted hover:bg-gray-50 hover:text-brand-dark rounded-lg font-medium transition-colors">
            <Users className="w-5 h-5" />
            Customers
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 bg-brand-primary/10 text-brand-primary rounded-lg font-medium">
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
        <DashboardNavbar title="Settings" user={user} onLogout={handleLogout} />

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-brand-dark mb-1">Business Profile</h2>
              <p className="text-brand-muted">Update your business details and booking preferences.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-brand-dark mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-brand-dark block mb-2">Business Name</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="e.g. Glow Spa" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-brand-dark block mb-2">Email Address</label>
                    <input type="email" defaultValue={user.email} disabled className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none bg-gray-50 text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
