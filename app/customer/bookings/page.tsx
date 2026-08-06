'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import { getCustomerBookings, cancelCustomerBooking } from '@/app/actions/customer-portal';
import { Calendar, Clock, CheckCircle2, XCircle, Search, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CustomerBookingsPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await getCustomerBookings(session.access_token);
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelBooking = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(id);
    setMessage({ type: '', text: '' });
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await cancelCustomerBooking(session?.access_token, id);
      if (res.success) {
        setMessage({ type: 'success', text: 'Booking cancelled successfully.' });
        await loadData();
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to cancel booking.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'An error occurred while cancelling.' });
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'UPCOMING') return b.status === 'PENDING' || b.status === 'CONFIRMED';
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED';
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">My Bookings</h1>
          <p className="text-brand-muted text-sm mt-1">View and manage all your past and upcoming appointments.</p>
        </div>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-brand-secondary transition-colors self-start sm:self-auto"
        >
          <Search className="w-4 h-4" />
          Book New Service
        </Link>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {(['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'bg-brand-primary text-white'
                : 'text-brand-muted hover:bg-gray-100 hover:text-brand-dark'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {filteredBookings.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-brand-dark text-base">{booking.service?.name || 'Appointment'}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                      booking.status === 'CONFIRMED' || booking.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : booking.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-brand-muted">{booking.business?.name}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-primary" />
                      {new Date(booking.startTime).toLocaleDateString()} at {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {booking.staff?.user?.name && (
                      <span>Staff: {booking.staff.user.name}</span>
                    )}
                    <span>Duration: {booking.service?.duration || 30} mins</span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0">
                  <span className="text-base font-bold text-brand-dark">${booking.totalPrice?.toFixed(2)}</span>
                  {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                    >
                      {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-brand-dark mb-1">No bookings found in this category</h3>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">There are no {activeTab.toLowerCase()} appointments associated with your account.</p>
          </div>
        )}
      </div>
    </div>
  );
}
