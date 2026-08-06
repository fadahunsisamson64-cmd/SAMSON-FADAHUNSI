'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import { getCustomerProfile, updateCustomerProfile } from '@/app/actions/customer-portal';
import { User, Shield, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function CustomerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function load() {
      try {
        const supabase = getSupabase();
        if (!supabase) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        setEmail(session.user.email || '');
        const res = await getCustomerProfile(session.access_token);
        if (res.success && res.data) {
          setName(res.data.name || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();

      const res = await updateCustomerProfile(session?.access_token, { name });
      if (res.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully.' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to update profile.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Profile &amp; Security</h1>
        <p className="text-brand-muted text-sm mt-1">Manage your personal information and account settings.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {message.text}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-dark">Personal Information</h2>
            <p className="text-xs text-brand-muted">Your name is visible to business owners when you book appointments.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-dark uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-brand-muted cursor-not-allowed"
            />
            <p className="text-[11px] text-gray-400 mt-1">Email is managed via your authentication login.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-dark uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-brand-dark focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </form>
      </div>

      {/* Security Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-dark">Security</h2>
            <p className="text-xs text-brand-muted">Your account is secured with Supabase Auth session management.</p>
          </div>
        </div>

        <p className="text-xs text-brand-muted leading-relaxed">
          Authentication tokens and sessions are securely encrypted. To change your password or update security credentials, use the password reset link on the sign-in page.
        </p>
      </div>
    </div>
  );
}
