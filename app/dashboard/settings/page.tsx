'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Loader2, Sparkles, Building, Scissors, UserCheck, Clock, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import DashboardNavbar from '@/components/DashboardNavbar';
import {
  getBusinessProfile,
  updateBusinessProfile,
  getBusinessServices,
  addBusinessService,
  deleteBusinessService,
  getBusinessStaff,
  addBusinessStaff,
  deleteBusinessStaff,
  getBusinessAvailability,
  updateBusinessAvailability
} from '@/app/actions/settings';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'services' | 'staff' | 'hours'>('profile');

  // Business Profile state
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Services state
  const [services, setServices] = useState<any[]>([]);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDuration, setServiceDuration] = useState('30');
  const [serviceDesc, setServiceDesc] = useState('');
  const [isAddingService, setIsAddingService] = useState(false);

  // Staff state
  const [staffList, setStaffList] = useState<any[]>([]);
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  // Availability state
  const [availabilities, setAvailabilities] = useState<Array<{ dayOfWeek: number; startTime: string; endTime: string; isOpen: boolean }>>([
    { dayOfWeek: 0, startTime: '09:00', endTime: '17:00', isOpen: false },
    { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isOpen: true },
    { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isOpen: true },
    { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isOpen: true },
    { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isOpen: true },
    { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isOpen: true },
    { dayOfWeek: 6, startTime: '09:00', endTime: '17:00', isOpen: false },
  ]);
  const [isSavingHours, setIsSavingHours] = useState(false);
  const [hoursMsg, setHoursMsg] = useState({ type: '', text: '' });

  const router = useRouter();

  const loadAllData = async () => {
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }
      
      setUser(session.user);
      const token = session.access_token;

      // Profile
      const profileRes = await getBusinessProfile(token);
      if (profileRes.success && profileRes.data) {
        setBusinessName(profileRes.data.name || '');
        setDescription(profileRes.data.description || '');
        setCategory(profileRes.data.category || '');
        setAddress(profileRes.data.address || '');
        setPhone(profileRes.data.phone || '');
        setIsVerified(profileRes.data.isVerified || false);
      }

      // Services
      const servicesRes = await getBusinessServices(token);
      if (servicesRes.success && servicesRes.data) {
        setServices(servicesRes.data);
      }

      // Staff
      const staffRes = await getBusinessStaff(token);
      if (staffRes.success && staffRes.data) {
        setStaffList(staffRes.data);
      }

      // Availability
      const hoursRes = await getBusinessAvailability(token);
      if (hoursRes.success && hoursRes.data && hoursRes.data.length > 0) {
        const merged = DAYS_OF_WEEK.map((_, idx) => {
          const found = hoursRes.data.find((h: any) => h.dayOfWeek === idx);
          return found
            ? { dayOfWeek: idx, startTime: found.startTime, endTime: found.endTime, isOpen: found.isOpen }
            : { dayOfWeek: idx, startTime: '09:00', endTime: '17:00', isOpen: idx >= 1 && idx <= 5 };
        });
        setAvailabilities(merged);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [router]);

  // Save Profile
  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const res = await updateBusinessProfile(session.access_token, {
        name: businessName,
        description,
        category,
        address,
        phone
      });
      
      if (res.success) {
        setProfileMsg({ type: 'success', text: 'Business profile updated successfully.' });
      } else {
        setProfileMsg({ type: 'error', text: res.error || 'Failed to update.' });
      }
    } catch (e) {
      setProfileMsg({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Add Service
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName || !servicePrice) return;
    setIsAddingService(true);
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();

      const res = await addBusinessService(session?.access_token, {
        name: serviceName,
        price: parseFloat(servicePrice),
        duration: parseInt(serviceDuration) || 30,
        description: serviceDesc
      });

      if (res.success) {
        setServiceName('');
        setServicePrice('');
        setServiceDesc('');
        await loadAllData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingService(false);
    }
  };

  // Delete Service
  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();

      await deleteBusinessService(session?.access_token, id);
      await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Add Staff
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName) return;
    setIsAddingStaff(true);
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();

      const res = await addBusinessStaff(session?.access_token, {
        name: staffName,
        role: staffRole
      });

      if (res.success) {
        setStaffName('');
        setStaffRole('');
        await loadAllData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingStaff(false);
    }
  };

  // Delete Staff
  const handleDeleteStaff = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();

      await deleteBusinessStaff(session?.access_token, id);
      await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Save Availability
  const handleSaveHours = async () => {
    setIsSavingHours(true);
    setHoursMsg({ type: '', text: '' });
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();

      const res = await updateBusinessAvailability(session?.access_token, availabilities);
      if (res.success) {
        setHoursMsg({ type: 'success', text: 'Business hours updated successfully.' });
      } else {
        setHoursMsg({ type: 'error', text: res.error || 'Failed to update hours.' });
      }
    } catch (err) {
      setHoursMsg({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSavingHours(false);
    }
  };

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
        <DashboardNavbar title="Business Settings" user={user} onLogout={handleLogout} />

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header & Verification Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-brand-dark mb-1">Business Management</h2>
                <p className="text-brand-muted text-sm">Manage your profile, offerings, team, and operating schedule.</p>
              </div>
              <div>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Verified Business
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Pending Admin Verification
                  </span>
                )}
              </div>
            </div>

            {/* Subtabs */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
              {[
                { id: 'profile', label: 'Business Profile', icon: Building },
                { id: 'services', label: 'Services', icon: Scissors },
                { id: 'staff', label: 'Staff Members', icon: UserCheck },
                { id: 'hours', label: 'Business Hours', icon: Clock },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-brand-primary text-white'
                      : 'text-brand-muted hover:bg-gray-100 hover:text-brand-dark'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: Business Profile */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-brand-dark mb-4">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-semibold text-brand-dark uppercase tracking-wider block mb-1.5">Business Name</label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                        placeholder="e.g. Apex Salon &amp; Spa"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-brand-dark uppercase tracking-wider block mb-1.5">Category</label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                        placeholder="e.g. Salon, Barber, Clinic, Spa"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-brand-dark uppercase tracking-wider block mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                        placeholder="+234 800 000 0000"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-brand-dark uppercase tracking-wider block mb-1.5">Address / Location</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                        placeholder="Street, City, State"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-brand-dark uppercase tracking-wider block mb-1.5">Description</label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                        placeholder="Describe your business, specialty services, and customer experience..."
                      />
                    </div>
                  </div>
                </div>

                {profileMsg.text && (
                  <div className={`p-3 rounded-xl text-sm font-medium ${profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {profileMsg.text}
                  </div>
                )}

                <button
                  onClick={handleSaveProfile}
                  disabled={isSavingProfile}
                  className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSavingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Profile Changes
                </button>
              </div>
            )}

            {/* TAB 2: Services */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                {/* Add Service Form */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
                  <h3 className="text-base font-bold text-brand-dark">Add New Service</h3>
                  <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-brand-dark uppercase tracking-wider block mb-1">Service Name</label>
                      <input
                        type="text"
                        required
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        placeholder="e.g. Executive Haircut"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-brand-dark uppercase tracking-wider block mb-1">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={servicePrice}
                        onChange={(e) => setServicePrice(e.target.value)}
                        placeholder="35.00"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-brand-dark uppercase tracking-wider block mb-1">Duration (Mins)</label>
                      <input
                        type="number"
                        required
                        value={serviceDuration}
                        onChange={(e) => setServiceDuration(e.target.value)}
                        placeholder="45"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-xs font-semibold text-brand-dark uppercase tracking-wider block mb-1">Description (Optional)</label>
                      <input
                        type="text"
                        value={serviceDesc}
                        onChange={(e) => setServiceDesc(e.target.value)}
                        placeholder="Short explanation of what is included in this service"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                    <div className="md:col-span-3 pt-2">
                      <button
                        type="submit"
                        disabled={isAddingService}
                        className="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {isAddingService ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add Service
                      </button>
                    </div>
                  </form>
                </div>

                {/* Services List */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-base font-bold text-brand-dark">Active Services ({services.length})</h3>
                  </div>
                  {services.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {services.map((svc) => (
                        <div key={svc.id} className="p-5 flex items-center justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-brand-dark text-sm">{svc.name}</h4>
                            <p className="text-xs text-brand-muted mt-0.5">{svc.description || 'No description'}</p>
                            <span className="text-xs text-brand-primary font-medium mt-1 inline-block">
                              {svc.duration} mins
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-brand-dark text-base">${svc.price.toFixed(2)}</span>
                            <button
                              onClick={() => handleDeleteService(svc.id)}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-brand-muted">
                      No services added yet. Fill out the form above to list your offerings.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: Staff Members */}
            {activeTab === 'staff' && (
              <div className="space-y-6">
                {/* Add Staff Form */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
                  <h3 className="text-base font-bold text-brand-dark">Add Staff Member</h3>
                  <form onSubmit={handleAddStaff} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-brand-dark uppercase tracking-wider block mb-1">Staff Name</label>
                      <input
                        type="text"
                        required
                        value={staffName}
                        onChange={(e) => setStaffName(e.target.value)}
                        placeholder="e.g. David Miller"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-brand-dark uppercase tracking-wider block mb-1">Specialty / Role</label>
                      <input
                        type="text"
                        value={staffRole}
                        onChange={(e) => setStaffRole(e.target.value)}
                        placeholder="e.g. Master Barber / Colorist"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                    <div className="md:col-span-2 pt-2">
                      <button
                        type="submit"
                        disabled={isAddingStaff}
                        className="bg-brand-primary hover:bg-brand-secondary text-white px-5 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {isAddingStaff ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add Staff Member
                      </button>
                    </div>
                  </form>
                </div>

                {/* Staff List */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-base font-bold text-brand-dark">Team Members ({staffList.length})</h3>
                  </div>
                  {staffList.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {staffList.map((st) => (
                        <div key={st.id} className="p-5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm">
                              {st.user?.name?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <h4 className="font-bold text-brand-dark text-sm">{st.user?.name || 'Staff Member'}</h4>
                              <p className="text-xs text-brand-muted">{st.role || 'Specialist'}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteStaff(st.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-brand-muted">
                      No staff members added yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: Business Hours */}
            {activeTab === 'hours' && (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-brand-dark mb-1">Weekly Operating Hours</h3>
                  <p className="text-xs text-brand-muted">Set when your business is open to accept online bookings.</p>
                </div>

                <div className="space-y-4">
                  {availabilities.map((item, index) => (
                    <div key={item.dayOfWeek} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-3 w-36">
                        <input
                          type="checkbox"
                          id={`day-${item.dayOfWeek}`}
                          checked={item.isOpen}
                          onChange={(e) => {
                            const updated = [...availabilities];
                            updated[index].isOpen = e.target.checked;
                            setAvailabilities(updated);
                          }}
                          className="w-4 h-4 text-brand-primary rounded focus:ring-brand-primary"
                        />
                        <label htmlFor={`day-${item.dayOfWeek}`} className="text-sm font-semibold text-brand-dark cursor-pointer">
                          {DAYS_OF_WEEK[item.dayOfWeek]}
                        </label>
                      </div>

                      {item.isOpen ? (
                        <div className="flex items-center gap-2 text-sm">
                          <input
                            type="time"
                            value={item.startTime}
                            onChange={(e) => {
                              const updated = [...availabilities];
                              updated[index].startTime = e.target.value;
                              setAvailabilities(updated);
                            }}
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-primary/20"
                          />
                          <span className="text-xs text-brand-muted">to</span>
                          <input
                            type="time"
                            value={item.endTime}
                            onChange={(e) => {
                              const updated = [...availabilities];
                              updated[index].endTime = e.target.value;
                              setAvailabilities(updated);
                            }}
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-primary/20"
                          />
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
                          Closed
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {hoursMsg.text && (
                  <div className={`p-3 rounded-xl text-sm font-medium ${hoursMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {hoursMsg.text}
                  </div>
                )}

                <button
                  onClick={handleSaveHours}
                  disabled={isSavingHours}
                  className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSavingHours && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Operating Hours
                </button>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
