'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBusinessForBooking, createBooking } from '@/app/actions/booking';
import { Loader2, Calendar, Clock, User, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking state
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerDetails, setCustomerDetails] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!params) return;
      const slug = params.slug as string;
      if (!slug) return;
      const res = await getBusinessForBooking(slug);
      if (res.success) {
        setBusiness(res.data);
      } else {
        setError(res.error || 'Failed to load business');
      }
      setLoading(false);
    }
    load();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-brand-background flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-brand-dark mb-2">Business not found</h2>
        <p className="text-brand-muted mb-6">The booking page you are looking for does not exist.</p>
        <Link href="/" className="bg-brand-primary text-white px-6 py-3 rounded-xl font-medium">Return Home</Link>
      </div>
    );
  }

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const timeSlots = ["09:00 AM", "10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:00 PM"];

  const confirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !customerDetails.name || !customerDetails.email) return;
    setSubmitting(true);
    
    // Simple mock time parsing for demo
    const [time, period] = selectedTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const startTime = new Date(selectedDate);
    startTime.setHours(hours, minutes, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + selectedService.duration);

    const res = await createBooking({
      businessId: business.id,
      serviceId: selectedService.id,
      staffId: selectedStaff?.id,
      customerName: customerDetails.name,
      customerEmail: customerDetails.email,
      startTime,
      endTime,
      price: selectedService.price
    });

    if (res.success) {
      setStep(5); // Success step
    } else {
      alert(res.error || 'Failed to book');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-brand-background py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-brand-primary">
            {business.name.charAt(0)}
          </div>
          <h1 className="text-2xl font-bold text-brand-dark">{business.name}</h1>
          <p className="text-brand-muted mt-1">{business.description || 'Book your appointment online'}</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-brand-dark/5 border border-gray-100 overflow-hidden min-h-[400px] flex flex-col relative">
          {/* Progress bar */}
          <div className="h-1 w-full bg-gray-50 absolute top-0 left-0">
            <div 
              className="h-full bg-brand-primary transition-all duration-500 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          <div className="p-6 sm:p-8 flex-1">
            <AnimatePresence mode="wait">
              
              {/* Step 1: Select Service */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-bold text-brand-dark mb-6">Select a Service</h2>
                  {business.services.length === 0 ? (
                    <p className="text-brand-muted">No services available.</p>
                  ) : (
                    <div className="space-y-3">
                      {business.services.map((service: any) => (
                        <button
                          key={service.id}
                          onClick={() => { setSelectedService(service); handleNext(); }}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${selectedService?.id === service.id ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary' : 'border-gray-200 hover:border-brand-primary/30 hover:bg-gray-50'}`}
                        >
                          <div>
                            <h3 className="font-semibold text-brand-dark text-base">{service.name}</h3>
                            <p className="text-sm text-brand-muted mt-1">{service.duration} minutes</p>
                          </div>
                          <div className="font-semibold text-brand-dark text-lg">
                            ${service.price.toFixed(2)}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-3 mb-6">
                    <button onClick={handleBack} className="p-2 -ml-2 rounded-lg text-brand-muted hover:bg-gray-50 transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold text-brand-dark">Select Date & Time</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-sm font-semibold text-brand-dark mb-3 block">Available Dates</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Calendar className="w-5 h-5 text-brand-muted" />
                        </div>
                        <input
                          type="date"
                          value={selectedDate.toISOString().split('T')[0]}
                          onChange={(e) => setSelectedDate(new Date(e.target.value))}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-brand-dark"
                        />
                      </div>
                      <p className="text-xs text-brand-muted mt-2">Select a date for your appointment.</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-brand-dark mb-3 block">Available Times</label>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map(time => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${selectedTime === time ? 'border-brand-primary bg-brand-primary text-white shadow-md' : 'border-gray-200 text-brand-dark hover:border-brand-primary/30'}`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
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

              {/* Step 3: Your Details */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-3 mb-6">
                    <button onClick={handleBack} className="p-2 -ml-2 rounded-lg text-brand-muted hover:bg-gray-50 transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold text-brand-dark">Your Details</h2>
                  </div>
                  
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="text-sm font-medium text-brand-dark block mb-2">Full Name</label>
                      <input 
                        type="text"
                        value={customerDetails.name}
                        onChange={e => setCustomerDetails(d => ({ ...d, name: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                        placeholder="e.g. Jane Doe"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-brand-dark block mb-2">Email Address</label>
                      <input 
                        type="email"
                        value={customerDetails.email}
                        onChange={e => setCustomerDetails(d => ({ ...d, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={handleNext}
                      disabled={!customerDetails.name || !customerDetails.email}
                      className="bg-brand-dark hover:bg-brand-primary text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review & Confirm */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-3 mb-6">
                    <button onClick={handleBack} className="p-2 -ml-2 rounded-lg text-brand-muted hover:bg-gray-50 transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold text-brand-dark">Review & Confirm</h2>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 space-y-4">
                    <div className="flex justify-between items-start pb-4 border-b border-gray-200/60">
                      <div>
                        <h4 className="font-semibold text-brand-dark text-lg">{selectedService?.name}</h4>
                        <p className="text-sm text-brand-muted">{selectedService?.duration} minutes</p>
                      </div>
                      <span className="font-bold text-brand-dark text-lg">${selectedService?.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-brand-dark font-medium">
                      <Calendar className="w-5 h-5 text-brand-muted" />
                      <span>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-brand-dark font-medium">
                      <Clock className="w-5 h-5 text-brand-muted" />
                      <span>{selectedTime}</span>
                    </div>
                    <div className="flex items-center gap-3 text-brand-dark font-medium pt-2">
                      <User className="w-5 h-5 text-brand-muted" />
                      <span>{customerDetails.name} ({customerDetails.email})</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={confirmBooking}
                      disabled={submitting}
                      className="bg-brand-primary hover:bg-brand-secondary text-white w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                      Confirm Booking
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Success */}
              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                  <div className="w-20 h-20 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-brand-success" />
                  </div>
                  <h2 className="text-2xl font-bold text-brand-dark mb-2">Booking Confirmed!</h2>
                  <p className="text-brand-muted max-w-md mx-auto mb-8">
                    Your appointment for <strong>{selectedService?.name}</strong> has been successfully booked for {selectedTime}. We&apos;ve sent a confirmation email to {customerDetails.email}.
                  </p>
                  
                  <button onClick={() => window.location.reload()} className="text-brand-primary font-medium hover:text-brand-accent transition-colors">
                    Book another appointment
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
