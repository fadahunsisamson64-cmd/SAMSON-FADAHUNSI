'use client';

export default function AdminSettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-dark mb-1">Platform Settings</h1>
        <p className="text-brand-muted">Manage global configuration for Lumina.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-lg font-bold text-brand-dark mb-6">General Configuration</h2>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-brand-dark block mb-2">Platform Name</label>
            <input type="text" defaultValue="Lumina" className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" />
          </div>
          
          <div>
            <label className="text-sm font-medium text-brand-dark block mb-2">Support Email</label>
            <input type="email" defaultValue="support@lumina.com" className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" />
          </div>
          
          <div className="pt-4">
            <button className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
