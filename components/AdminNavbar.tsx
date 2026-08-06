'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X, 
  ArrowLeft 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminNavbarProps {
  user?: {
    email?: string;
  };
  onLogout?: () => void;
}

export default function AdminNavbar({ user, onLogout }: AdminNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Businesses', href: '/admin/businesses', icon: Store },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Admin Dashboard';
    if (pathname === '/admin/businesses') return 'Businesses';
    if (pathname === '/admin/users') return 'Users';
    if (pathname === '/admin/settings') return 'Settings';
    return 'Admin Portal';
  };

  return (
    <>
      <header className="h-16 bg-[#081635] md:bg-white border-b border-white/10 md:border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 text-white md:text-brand-dark">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button - shown on mobile where sidebar is hidden */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle Admin Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
          </div>

          <h1 className="text-lg sm:text-xl font-bold">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">User Dashboard</span>
            <span className="sm:hidden">App</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer for Admin */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#081635] text-white w-72 h-full shadow-2xl flex flex-col justify-between border-r border-white/10">
            <div className="p-4 space-y-1">
              <div className="px-3 py-2 mb-2 text-xs font-semibold text-white/60 uppercase tracking-wider">
                Admin Menu
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
                        ? "bg-white/15 text-white font-semibold"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20">
              {user?.email && (
                <div className="flex items-center gap-3 px-3 py-2 mb-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">Administrator</p>
                    <p className="text-xs text-white/60 truncate">{user.email}</p>
                  </div>
                </div>
              )}
              {onLogout && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-red-400 hover:bg-red-400/10 rounded-xl font-medium transition-colors text-sm"
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
