'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X, 
  Bell, 
  Sparkles 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardNavbarProps {
  title: string;
  user?: {
    email?: string;
  };
  onLogout?: () => void;
}

export default function DashboardNavbar({ title, user, onLogout }: DashboardNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
    { name: 'Customers', href: '/dashboard/customers', icon: Users },
    { name: 'Admin Portal', href: '/super-admin', icon: ShieldCheck },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button - Shown only on mobile where sidebar is hidden */}
          <button 
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-brand-dark hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          <h1 className="text-lg sm:text-xl font-bold text-brand-dark">{title}</h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button className="text-brand-muted hover:text-brand-dark p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center font-bold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer - Shows when sidebar is hidden on mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-72 h-full shadow-2xl flex flex-col justify-between border-r border-gray-200">
            <div className="p-4 space-y-1">
              <div className="px-3 py-2 mb-2 text-xs font-semibold text-brand-muted uppercase tracking-wider">
                Navigation
              </div>
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
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
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              {user?.email && (
                <div className="flex items-center gap-3 px-3 py-2 mb-3 rounded-lg bg-white border border-gray-200">
                  <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-brand-dark truncate">Account</p>
                    <p className="text-xs text-brand-muted truncate">{user.email}</p>
                  </div>
                </div>
              )}
              {onLogout && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-brand-danger hover:bg-brand-danger/10 rounded-xl font-medium transition-colors text-sm"
                >
                  <LogOut className="w-5 h-5" />
                  Log out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
