'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { Calendar, User, LogOut, Loader2, Sparkles, LayoutDashboard, Search } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

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
          router.push('/login?redirect=/customer');
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

  const navigation = [
    { name: 'Dashboard', href: '/customer', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/customer/bookings', icon: Calendar },
    { name: 'Profile & Security', href: '/customer/profile', icon: User },
  ];

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
          <div className="px-3 py-2 text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">
            Customer Portal
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors text-sm",
                  isActive
                    ? "bg-brand-primary/10 text-brand-primary font-semibold"
                    : "text-brand-muted hover:bg-gray-50 hover:text-brand-dark"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
          
          <div className="pt-6">
            <Link
              href="/explore"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors text-sm text-brand-accent hover:bg-brand-accent/10"
            >
              <Search className="w-5 h-5" />
              Book New Appointment
            </Link>
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-3 rounded-lg bg-gray-50 border border-gray-200">
            <div className="w-8 h-8 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center font-bold text-sm shrink-0">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-brand-dark truncate">Customer Account</p>
              <p className="text-xs text-brand-muted truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-left text-brand-danger hover:bg-brand-danger/10 rounded-lg font-medium transition-colors text-sm"
          >
            <LogOut className="w-5 h-5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-brand-dark">Lumina</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-brand-dark">Customer Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/explore"
              className="text-sm font-medium text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              Explore Services
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
