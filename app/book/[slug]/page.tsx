'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBusinessForBooking, createBooking } from '@/app/actions/booking';
import { 
  Loader2, Calendar, Clock, User, CheckCircle2, ArrowLeft, ArrowRight, 
  MapPin, Phone, ShieldCheck, Sparkles, AlertCircle, CreditCard, Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Flow Steps:
  // Step 1: Select Service
  // Step 2: Select Staff (if available)
  // Step 3: Select Date & Time
  // Step 4: Customer Details & Payment
  // Step 5: Review & Confirm
  // Step 6: Confirmation Success
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null); // null = "Any Available"
  
  const todayIso = new Date().toISOString().split('T')[0];
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayIso);
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  const [customerDetails, setCustomerDetails] = useState({ name: '', email: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState<'VENUE' | 'ONLINE'>('VENUE');
  
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!params) return;
      const slug = params.slug as string;
      if (!slug) return;
      
      const res = await getBusinessForBooking(slug);
      if (res.success && res.data) {
        setBusiness(res.data);
      } else {
        setError(res.error || 'Failed to load business details');
      }
      setLoading(false);
    }
    load();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-background flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary mb-4" />
        <p className="text-sm font-medium text-brand-muted">Loading booking details...</p>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-brand-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4 text-red-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-brand-dark mb-2">Business not found</h2>
        <p className="text-brand-muted mb-6 max-w-sm">The business you are trying to book with does not exist or has been updated.</p>
        <Link href="/explore" className="bg-brand-primary text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-brand-secondary transition-all">
          Explore Services
        </Link>
      </div>
    );
  }

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "11:30 AM",
    "01:00 PM", "02:00 PM", "03:30 PM", "04:30 PM", "05:30 PM"
  ];

  const handleNext = () => {
    setBookingError(null);
    setStep(s => s + 1);
  };
  
  const handleBack = () => {
    setBookingError(null);
    setStep(s => Math.max(1, s - 1));
  };

  const confirmBooking = async () => {
    if (!selectedService || !selectedDateStr || !selectedTime || !customerDetails.name || !customerDetails.email) return;
    setSubmitting(true);
    setBookingError(null);

    try {
      // Parse time slot
      const [time, period] = selectedTime.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      const [year, month, day] = selectedDateStr.split('-').map(Number);
      const startTime = new Date(year, month - 1, day, hours, minutes, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + (selectedService.duration || 30));

      const res = await createBooking({
        businessId: business.id,
        serviceId: selectedService.id,
        staffId: selectedStaff?.id || undefined,
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
        paymentMethod,
        startTime,
        endTime,
        price: selectedService.price
      });

      if (res.success) {
        setStep(6); // Success screen
      } else {
        setBookingError(res.error || 'Failed to complete booking. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setBookingError('An unexpected error occurred. Please check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const hasStaff = business.staff && business.staff.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-background to-gray-100/60 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Top Business Banner */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
              {business.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-bold text-brand-dark">{business.name}</h1>
                {business.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-brand-muted mt-1">{business.description || 'Book your appointment in seconds'}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-xs text-brand-muted">
                {business.address && (
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-brand-primary" /> {business.address}</span>
                )}
                {business.phone && (
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-brand-primary" /> {business.phone}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Flow Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-brand-dark/5 border border-gray-100 overflow-hidden relative">
          
          {/* Progress Bar */}
          {step < 6 && (
            <div className="h-1.5 w-full bg-gray-100">
              <div 
                className="h-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-500 ease-out"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            
            {bookingError && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span>{bookingError}</span>
              </div>
            )}

            <AnimatePresence mode="wait">

              {/* STEP 1: SELECT SERVICE */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-brand-dark">Select a Service</h2>
                    <p className="text-sm text-brand-muted mt-1">Choose the service you would like to book</p>
                  </div>

                  {!business.services || business.services.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
                      <p className="text-sm text-brand-muted">No services currently listed for this business.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {business.services.map((service: any) => {
                        const isSelected = selectedService?.id === service.id;
                        return (
                          <button
                            key={service.id}
                            onClick={() => {
                              setSelectedService(service);
                              handleNext();
                            }}
                            className={`w-full flex items-center justify-between p-5 rounded-2xl border text-left transition-all ${
                              isSelected 
                                ? 'border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/20 shadow-sm' 
                                : 'border-gray-200 hover:border-brand-primary/40 hover:bg-gray-50/80'
                            }`}
                          >
                            <div className="space-y-1">
                              <h3 className="font-semibold text-brand-dark text-base">{service.name}</h3>
                              {service.description && (
                                <p className="text-xs text-brand-muted line-clamp-1">{service.description}</p>
                              )}
                              <p className="text-xs font-medium text-brand-primary flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {service.duration} minutes
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-brand-dark">${service.price.toFixed(2)}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 2: SELECT STAFF (IF AVAILABLE) OR SKIP */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                  <div className="flex items-center gap-3 mb-6">
                    <button onClick={handleBack} className="p-2 -ml-2 rounded-xl text-brand-muted hover:bg-gray-100 transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="text-xl font-bold text-brand-dark">Select Specialist</h2>
                      <p className="text-sm text-brand-muted">Choose your preferred staff member or select any available</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setSelectedStaff(null);
                        handleNext();
                      }}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${
                        selectedStaff === null 
                          ? 'border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/20' 
                          : 'border-gray-200 hover:border-brand-primary/30'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-brand-dark">Any Available Specialist</h3>
                        <p className="text-xs text-brand-muted">We will assign the first available team member</p>
                      </div>
                    </button>

                    {hasStaff && business.staff.map((st: any) => {
                      const isSel = selectedStaff?.id === st.id;
                      return (
                        <button
                          key={st.id}
                          onClick={() => {
                            setSelectedStaff(st);
                            handleNext();
                          }}
                          className={`w-full p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${
                            isSel 
                              ? 'border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/20' 
                              : 'border-gray-200 hover:border-brand-primary/30'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full bg-brand-secondary/10 text-brand-secondary flex items-center justify-center font-bold text-lg">
                            {st.user?.name ? st.user.name.charAt(0) : 'S'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-brand-dark">{st.user?.name || 'Staff Specialist'}</h3>
                            <p className="text-xs text-brand-muted">{st.role || 'Service Specialist'}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={handleNext}
                      className="bg-brand-dark hover:bg-brand-primary text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: DATE & TIME */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                  <div className="flex items-center gap-3 mb-6">
                    <button onClick={handleBack} className="p-2 -ml-2 rounded-xl text-brand-muted hover:bg-gray-100 transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="text-xl font-bold text-brand-dark">Select Date & Time</h2>
                      <p className="text-sm text-brand-muted">Pick a date and convenient time slot</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-brand-dark mb-2 block">Appointment Date</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Calendar className="w-5 h-5 text-brand-muted" />
                        </div>
                        <input
                          type="date"
                          value={selectedDateStr}
                          min={todayIso}
                          onChange={(e) => {
                            if (e.target.value) setSelectedDateStr(e.target.value);
                          }}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-brand-dark font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-brand-dark mb-2 block">Available Time Slots</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
                        {timeSlots.map(time => {
                          const isSel = selectedTime === time;
                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                                isSel 
                                  ? 'border-brand-primary bg-brand-primary text-white shadow-md' 
                                  : 'border-gray-200 text-brand-dark hover:border-brand-primary/40 hover:bg-gray-50'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-brand-muted">
                      {selectedTime ? `Selected: ${selectedDateStr} at ${selectedTime}` : 'Select a time slot to continue'}
                    </span>
                    <button
                      onClick={handleNext}
                      disabled={!selectedTime}
                      className="bg-brand-dark hover:bg-brand-primary text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: CUSTOMER DETAILS & PAYMENT METHOD */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                  <div className="flex items-center gap-3 mb-6">
                    <button onClick={handleBack} className="p-2 -ml-2 rounded-xl text-brand-muted hover:bg-gray-100 transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="text-xl font-bold text-brand-dark">Your Information</h2>
                      <p className="text-sm text-brand-muted">Provide your contact details for confirmation</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm font-medium text-brand-dark block mb-1">Full Name *</label>
                      <input 
                        type="text"
                        value={customerDetails.name}
                        onChange={e => setCustomerDetails(d => ({ ...d, name: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm"
                        placeholder="e.g. John Doe"
                        required
                      />
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-brand-dark block mb-1">Email Address *</label>
                        <input 
                          type="email"
                          value={customerDetails.email}
                          onChange={e => setCustomerDetails(d => ({ ...d, email: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-brand-dark block mb-1">Phone Number (Optional)</label>
                        <input 
                          type="tel"
                          value={customerDetails.phone}
                          onChange={e => setCustomerDetails(d => ({ ...d, phone: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm"
                          placeholder="+234 800 000 0000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Option */}
                  <div className="pt-4 border-t border-gray-100">
                    <label className="text-sm font-bold text-brand-dark block mb-3">Payment Method</label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('VENUE')}
                        className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                          paymentMethod === 'VENUE' 
                            ? 'border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/20' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Store className="w-5 h-5 text-brand-primary shrink-0" />
                        <div>
                          <div className="font-semibold text-sm text-brand-dark">Pay at Venue</div>
                          <div className="text-xs text-brand-muted">Pay directly when you arrive</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('ONLINE')}
                        className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                          paymentMethod === 'ONLINE' 
                            ? 'border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/20' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 text-brand-accent shrink-0" />
                        <div>
                          <div className="font-semibold text-sm text-brand-dark">Pay Online</div>
                          <div className="text-xs text-brand-muted">Paystack / Card payment</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={handleNext}
                      disabled={!customerDetails.name || !customerDetails.email}
                      className="bg-brand-dark hover:bg-brand-primary text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Review Booking <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: REVIEW & CONFIRM */}
              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                  <div className="flex items-center gap-3 mb-6">
                    <button onClick={handleBack} className="p-2 -ml-2 rounded-xl text-brand-muted hover:bg-gray-100 transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="text-xl font-bold text-brand-dark">Review & Confirm</h2>
                      <p className="text-sm text-brand-muted">Please double check your appointment details</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200/80 mb-6 space-y-4">
                    <div className="flex justify-between items-start pb-4 border-b border-gray-200">
                      <div>
                        <h4 className="font-bold text-brand-dark text-lg">{selectedService?.name}</h4>
                        <p className="text-xs text-brand-muted mt-0.5">{selectedService?.duration} mins duration</p>
                      </div>
                      <span className="font-bold text-brand-dark text-xl">${selectedService?.price.toFixed(2)}</span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 text-sm text-brand-dark">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-brand-primary shrink-0" />
                        <span>Date: <strong className="font-semibold">{selectedDateStr}</strong></span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-brand-primary shrink-0" />
                        <span>Time: <strong className="font-semibold">{selectedTime}</strong></span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <User className="w-4 h-4 text-brand-primary shrink-0" />
                        <span>Specialist: <strong className="font-semibold">{selectedStaff?.user?.name || 'Any Available Specialist'}</strong></span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-brand-primary shrink-0" />
                        <span>Payment: <strong className="font-semibold">{paymentMethod === 'ONLINE' ? 'Pay Online' : 'Pay at Venue'}</strong></span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200/60 text-xs text-brand-muted">
                      Customer: <strong className="text-brand-dark font-medium">{customerDetails.name}</strong> ({customerDetails.email})
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={confirmBooking}
                      disabled={submitting}
                      className="bg-brand-primary hover:bg-brand-secondary text-white w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 hover:shadow-xl disabled:opacity-70"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Confirm Appointment
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 6: CONFIRMATION SUCCESS */}
              {step === 6 && (
                <motion.div key="step6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-brand-dark mb-2">Booking Confirmed!</h2>
                  <p className="text-brand-muted max-w-md mx-auto mb-6 text-sm">
                    Your appointment for <strong className="text-brand-dark">{selectedService?.name}</strong> at <strong className="text-brand-dark">{business.name}</strong> is confirmed for <strong className="text-brand-dark">{selectedDateStr} at {selectedTime}</strong>.
                  </p>

                  <div className="bg-gray-50 p-4 rounded-2xl max-w-md mx-auto border border-gray-200 mb-8 text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Specialist:</span>
                      <span className="font-semibold text-brand-dark">{selectedStaff?.user?.name || 'Assigned Staff'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Confirmation Sent To:</span>
                      <span className="font-semibold text-brand-dark">{customerDetails.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Total Amount:</span>
                      <span className="font-bold text-brand-primary text-sm">${selectedService?.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/customer"
                      className="w-full sm:w-auto px-6 py-3 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors text-sm shadow-md"
                    >
                      View My Bookings
                    </Link>
                    <button
                      onClick={() => {
                        setStep(1);
                        setSelectedService(null);
                        setSelectedTime('');
                      }}
                      className="w-full sm:w-auto px-6 py-3 border border-gray-200 text-brand-dark font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                    >
                      Book Another Service
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

          </div>
        </div>

      </div>
    </div>
  );
}
