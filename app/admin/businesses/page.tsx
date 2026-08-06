'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getAdminBusinesses } from '@/app/actions/admin';

export default function AdminBusinessesPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const res = await getAdminBusinesses();
      if (res.success && res.data) {
        setBusinesses(res.data);
      }
      setLoading(false);
    }
    load();
  }, []);

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
    return matchesSearch && b.status === activeTab;
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
                        {business.status === 'Active' && <CheckCircle2 className="w-4 h-4 text-brand-success" />}
                        {business.status === 'Pending' && <Clock className="w-4 h-4 text-brand-warning" />}
                        {business.status === 'Suspended' && <XCircle className="w-4 h-4 text-brand-danger" />}
                        <span className={`text-sm font-medium ${
                          business.status === 'Active' ? 'text-brand-success' :
                          business.status === 'Pending' ? 'text-brand-warning' :
                          'text-brand-danger'
                        }`}>
                          {business.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-muted">
                      {business.joined}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-brand-dark">
                      {business.revenue}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-brand-muted hover:text-brand-dark hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
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
