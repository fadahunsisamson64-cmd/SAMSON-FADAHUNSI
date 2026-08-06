'use client';
import { getSupabase } from '@/lib/supabase';


import { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, CheckCircle2, XCircle, Clock, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { getAdminBusinesses, toggleBusinessVerification } from '@/app/actions/admin';

export default function AdminBusinessesPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await getAdminBusinesses(session.access_token);
    if (!res.success) { window.location.href = '/dashboard'; return; }
    if (res.success && res.data) {
      setBusinesses(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleVerification = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();

      const res = await toggleBusinessVerification(session?.access_token, id, !currentStatus);
      if (res.success) {
        await loadData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.owner.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'All') return matchesSearch;
    if (activeTab === 'Verified' || activeTab === 'Active') return matchesSearch && b.isVerified;
    if (activeTab === 'Pending') return matchesSearch && !b.isVerified;
    return matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark mb-1">Businesses</h1>
          <p className="text-brand-muted">Manage and verify registered businesses on the platform.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search businesses..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary w-full sm:w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-brand-dark hover:bg-gray-50 transition-colors font-medium">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {['All', 'Active', 'Pending', 'Suspended'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-brand-primary text-brand-primary' 
                  : 'border-transparent text-brand-muted hover:text-brand-dark hover:border-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredBusinesses.length === 0 ? (
            <div className="p-12 text-center text-brand-muted">
              No businesses found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-background/50 text-brand-muted text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Business</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium">Revenue (YTD)</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBusinesses.map((business, i) => (
                  <motion.tr 
                    key={business.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                          {business.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-brand-dark">{business.name}</div>
                          <div className="text-xs text-brand-muted">{business.owner}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {business.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {business.isVerified ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">Verified</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">Pending</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-muted">
                      {business.joined}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-brand-dark">
                      {business.revenue}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleVerification(business.id, business.isVerified)}
                        disabled={updatingId === business.id}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          business.isVerified
                            ? 'border border-gray-200 text-gray-600 hover:bg-gray-100'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        }`}
                      >
                        {updatingId === business.id ? 'Updating...' : business.isVerified ? 'Revoke Verification' : 'Verify & Approve'}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-brand-muted">
            Showing <span className="font-medium text-brand-dark">{filteredBusinesses.length}</span> business(es)
          </div>
        </div>
      </div>
    </div>
  );
}
