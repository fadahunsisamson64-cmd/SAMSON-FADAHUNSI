'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import { getCustomerBookings, cancelCustomerBooking } from '@/app/actions/customer-portal';
import { Calendar, CheckCircle2, Clock, XCircle, Search, MapPin, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CustomerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  const upcoming = bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED');
  const completed = bookings.filter(b => b.status === 'COMPLETED');
  const cancelled = bookings.filter(b => b.status === 'CANCELLED');
  const nextBooking = upcoming.length > 0 ? upcoming[0] : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">My Dashboard</h1>
        <p className="text-brand-muted text-sm mt-1">Manage your appointments, track upcoming sessions, and review past visits.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          {message.text}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-brand-muted uppercase">Total Bookings</span>
            <Calendar className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="text-2xl font-bold text-brand-dark">{bookings.length}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-brand-muted uppercase">Upcoming</span>
            <Clock className="w-4 h-4 text-brand-accent" />
          </div>
          <div className="text-2xl font-bold text-brand-dark">{upcoming.length}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-brand-muted uppercase">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-brand-dark">{completed.length}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-brand-muted uppercase">Cancelled</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-brand-dark">{cancelled.length}</div>
        </div>
      </div>

      {/* Next Appointment Spotlight */}
      {nextBooking && (
        <div className="bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 p-6 rounded-3xl border border-brand-primary/20 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-brand-primary text-white text-xs font-semibold rounded-full">Next Appointment</span>
            <span className="text-xs text-brand-muted">
              {new Date(nextBooking.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-brand-dark">{nextBooking.service?.name || 'Service Appointment'}</h2>
              <p className="text-sm text-brand-muted mt-0.5">{nextBooking.business?.name}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-brand-muted">
                <span className="flex items-center gap-1 font-medium text-brand-dark">
                  <Clock className="w-4 h-4 text-brand-primary" />
                  {new Date(nextBooking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(nextBooking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {nextBooking.staff?.user?.name && (
                  <span>Staff: {nextBooking.staff.user.name}</span>
                )}
                <span>Price: ${nextBooking.totalPrice?.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={() => handleCancelBooking(nextBooking.id)}
                disabled={cancellingId === nextBooking.id}
                className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {cancellingId === nextBooking.id ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookings List Section */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-dark">Recent Appointments</h2>
          <Link href="/customer/bookings" className="text-sm font-semibold text-brand-primary hover:text-brand-accent transition-colors">
            View All →
          </Link>
        </div>

        {bookings.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-brand-dark text-sm">{booking.service?.name || 'Appointment'}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                      booking.status === 'CONFIRMED' || booking.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : booking.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-brand-muted mt-1">{booking.business?.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(booking.startTime).toLocaleDateString()} at {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="font-bold text-brand-dark text-sm">${booking.totalPrice?.toFixed(2)}</span>
                  {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-brand-dark mb-1">No appointments found</h3>
            <p className="text-xs text-brand-muted mb-6 max-w-sm mx-auto">You haven't booked any appointments yet. Search top-rated businesses and book your first service in seconds.</p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-brand-secondary transition-colors"
            >
              <Search className="w-4 h-4" />
              Explore Businesses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
