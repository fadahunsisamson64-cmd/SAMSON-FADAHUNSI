'use client';

import { motion } from 'motion/react';
import { 
  ArrowRight, CheckCircle2, Calendar, CreditCard, Users, Star, 
  Bell, Scissors, Camera, Dumbbell, Briefcase, Play, Menu, X, 
  Sparkles, LineChart, Shield, Globe, Clock, ChevronDown, Check
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20, stiffness: 100 } },
};

const STAGGER_CHILDREN_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-background overflow-hidden selection:bg-brand-accent/30">
      
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-accent/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-brand-primary/5 blur-[150px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] rounded-full bg-brand-secondary/5 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto glass-panel rounded-full px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg shadow-brand-accent/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-dark">Lumina</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-brand-muted">
            <Link href="/explore" className="text-brand-primary font-semibold hover:text-brand-accent transition-colors">Explore Services</Link>
            <Link href="/customer" className="hover:text-brand-primary transition-colors">My Bookings</Link>
            <Link href="#features" className="hover:text-brand-primary transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-brand-primary transition-colors">Pricing</Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-brand-dark hover:text-brand-primary transition-colors">
              Business Sign In
            </Link>
            <Link href="/register" className="bg-brand-dark text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand-primary transition-all shadow-lg hover:shadow-xl hover:shadow-brand-dark/20 hover:-translate-y-0.5 flex items-center gap-2">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            type="button"
            className="lg:hidden p-2 text-brand-dark" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden mt-3 max-w-7xl mx-auto glass-panel rounded-3xl p-6 shadow-2xl border border-white/40 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-4 text-base font-medium text-brand-dark">
              <Link 
                href="/explore" 
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 hover:bg-white/60 text-brand-primary font-semibold rounded-xl transition-colors"
              >
                Explore Services
              </Link>
              <Link 
                href="/customer" 
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 hover:bg-white/60 rounded-xl transition-colors"
              >
                My Bookings
              </Link>
              <Link 
                href="#features" 
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 hover:bg-white/60 rounded-xl transition-colors"
              >
                Features
              </Link>
              <Link 
                href="#solutions" 
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 hover:bg-white/60 rounded-xl transition-colors"
              >
                Solutions
              </Link>
              <Link 
                href="#pricing" 
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 hover:bg-white/60 rounded-xl transition-colors"
              >
                Pricing
              </Link>
              <Link 
                href="#testimonials" 
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 hover:bg-white/60 rounded-xl transition-colors"
              >
                Testimonials
              </Link>
              <div className="border-t border-gray-200/60 pt-4 flex flex-col sm:flex-row gap-3">
                <Link 
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl font-medium text-brand-dark bg-white/80 border border-gray-200 hover:bg-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl font-medium text-white bg-brand-dark hover:bg-brand-primary transition-colors shadow-md"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="relative z-10">
        
        {/* Hero Section */}
        <section className="pt-40 pb-20 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial="hidden"
              animate="show"
              variants={STAGGER_CHILDREN_VARIANTS}
              className="max-w-2xl"
            >
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/5 border border-brand-primary/10 mb-8">
                <span className="flex h-2 w-2 rounded-full bg-brand-accent animate-pulse"></span>
                <span className="text-sm font-medium text-brand-primary">Lumina Booking 2.0 is live</span>
              </motion.div>
              
              <motion.h1 
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-brand-dark leading-[1.05] mb-8"
              >
                Online booking <br/> made <span className="text-gradient">beautiful.</span>
              </motion.h1>
              
              <motion.p 
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="text-lg sm:text-xl text-brand-muted leading-relaxed mb-10 max-w-lg"
              >
                The easiest way for salons, clinics, photographers, consultants and local businesses to manage appointments online.
              </motion.p>
              
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col sm:flex-row items-center gap-4">
                <button className="w-full sm:w-auto bg-brand-primary text-white px-8 py-4 rounded-full font-medium hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/20 hover:-translate-y-1 flex items-center justify-center gap-2 text-lg">
                  Start for free
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="w-full sm:w-auto px-8 py-4 rounded-full font-medium text-brand-dark bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-lg shadow-sm">
                  <Play className="w-5 h-5" />
                  Book Demo
                </button>
              </motion.div>
              
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="mt-10 flex items-center gap-4 text-sm text-brand-muted">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden relative">
                       <Image src={`https://picsum.photos/seed/${i * 10}/100/100`} alt="User" fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-brand-warning text-brand-warning" />)}
                  </div>
                  <span>Join 1,500+ businesses</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Right - 3D Dashboard Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, rotateX: 10, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              className="relative perspective-1000 hidden lg:block"
            >
              <div className="relative w-full aspect-[4/3] rounded-3xl p-4 glass-panel bg-white/40 shadow-2xl overflow-hidden transform-gpu hover:rotate-y-[-5deg] hover:rotate-x-[5deg] transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/60 to-white/10 z-0 rounded-3xl pointer-events-none"></div>
                
                {/* Simulated Dashboard UI */}
                <div className="relative z-10 w-full h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  {/* Topbar */}
                  <div className="h-14 border-b border-gray-100 px-6 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-4 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center"><Bell className="w-4 h-4 text-brand-primary" /></div>
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                         <Image src="https://picsum.photos/seed/user/100/100" alt="Avatar" fill className="object-cover" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6 flex gap-6">
                    {/* Sidebar */}
                    <div className="w-48 hidden sm:flex flex-col gap-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`h-8 rounded-md ${i === 1 ? 'bg-brand-primary/10 w-full' : 'bg-gray-100 w-3/4'}`}></div>
                      ))}
                    </div>
                    
                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col gap-6">
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-24 rounded-xl border border-gray-100 p-4 flex flex-col justify-between">
                            <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                            <div className="w-16 h-6 bg-gray-200 rounded-full mt-auto"></div>
                          </div>
                        ))}
                      </div>
                      <div className="flex-1 border border-gray-100 rounded-xl overflow-hidden relative">
                         <div className="absolute top-4 left-4 w-32 h-6 bg-gray-100 rounded-full"></div>
                         
                         {/* Calendar visualization lines */}
                         <div className="absolute top-16 left-4 right-4 bottom-4 flex gap-4">
                           {[1,2,3,4,5].map(i => (
                             <div key={i} className="flex-1 border-l border-gray-50 flex flex-col gap-2 relative">
                               {i === 2 && <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-10 left-1 right-1 h-20 bg-brand-accent/20 border border-brand-accent/30 rounded-md"></motion.div>}
                               {i === 3 && <div className="absolute top-32 left-1 right-1 h-16 bg-brand-primary/20 border border-brand-primary/30 rounded-md"></div>}
                             </div>
                           ))}
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Widgets */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-6 top-20 glass-panel p-4 rounded-2xl shadow-xl w-48 flex items-center gap-4 z-20"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-success/10 flex items-center justify-center text-brand-success">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-brand-dark">New Booking</div>
                    <div className="text-xs text-brand-muted">Just now</div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0] }} 
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -left-6 bottom-20 glass-panel p-4 rounded-2xl shadow-xl w-56 flex flex-col gap-3 z-20"
                >
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-medium text-brand-muted">Revenue</span>
                     <LineChart className="w-4 h-4 text-brand-primary" />
                  </div>
                  <div className="text-2xl font-bold text-brand-dark">$4,250.00</div>
                  <div className="text-xs text-brand-success flex items-center gap-1">+12% this week</div>
                </motion.div>

              </div>
            </motion.div>
          </div>
        </section>

        {/* Social Proof / Stats */}
        <section className="py-10 border-y border-gray-200/50 bg-white/30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-center sm:justify-between items-center gap-8 lg:gap-16">
               <div className="text-center">
                  <div className="text-4xl font-bold text-brand-dark mb-1">50,000+</div>
                  <div className="text-sm text-brand-muted font-medium">Bookings Processed</div>
               </div>
               <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
               <div className="text-center">
                  <div className="text-4xl font-bold text-brand-dark mb-1">1,500+</div>
                  <div className="text-sm text-brand-muted font-medium">Active Businesses</div>
               </div>
               <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
               <div className="text-center">
                  <div className="text-4xl font-bold text-brand-dark mb-1">98%</div>
                  <div className="text-sm text-brand-muted font-medium">Customer Satisfaction</div>
               </div>
               <div className="hidden md:block w-px h-12 bg-gray-200"></div>
               <div className="text-center">
                  <div className="text-4xl font-bold text-brand-dark mb-1">$10M+</div>
                  <div className="text-sm text-brand-muted font-medium">Payments Handled</div>
               </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <motion.section 
          initial="hidden" 
          whileInView="show" 
          viewport={{ once: true, margin: "-100px" }}
          variants={STAGGER_CHILDREN_VARIANTS}
          id="features" 
          className="py-32 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-brand-dark tracking-tight mb-6">Everything you need to <br/> run your business smoothly.</h2>
              <p className="text-lg text-brand-muted">A complete suite of tools designed to help you accept bookings, manage staff, and grow your revenue effortlessly.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS}><FeatureCard 
                icon={<Calendar className="w-6 h-6 text-brand-primary" />}
                title="Smart Calendar"
                description="Manage your schedule with our drag-and-drop calendar. Block personal time and set custom availability rules."
              /></motion.div>
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS}><FeatureCard 
                icon={<CreditCard className="w-6 h-6 text-brand-accent" />}
                title="Deposits & Payments"
                description="Securely accept full or partial payments upfront. Reduce no-shows and guarantee your revenue."
              /></motion.div>
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS}><FeatureCard 
                icon={<Bell className="w-6 h-6 text-brand-warning" />}
                title="Automated Reminders"
                description="Send SMS and email reminders to your clients automatically. Keep your schedule full and organized."
              /></motion.div>
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS}><FeatureCard 
                icon={<Users className="w-6 h-6 text-brand-success" />}
                title="Staff Management"
                description="Add unlimited staff members. Give them their own schedules, specific services, and login access."
              /></motion.div>
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS}><FeatureCard 
                icon={<LineChart className="w-6 h-6 text-purple-500" />}
                title="Advanced Analytics"
                description="Track revenue, most popular services, and staff performance with beautiful, easy-to-read charts."
              /></motion.div>
              <motion.div variants={FADE_UP_ANIMATION_VARIANTS}><FeatureCard 
                icon={<Globe className="w-6 h-6 text-brand-secondary" />}
                title="Beautiful Booking Page"
                description="Get a premium, customizable booking page that matches your brand and looks stunning on any device."
              /></motion.div>
            </div>
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section 
          initial="hidden" 
          whileInView="show" 
          viewport={{ once: true, margin: "-100px" }}
          variants={STAGGER_CHILDREN_VARIANTS}
          className="py-32 bg-white px-6"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="text-center mb-20">
              <h2 className="text-4xl font-bold text-brand-dark mb-4">How it works</h2>
              <p className="text-lg text-brand-muted max-w-2xl mx-auto">Go from sign up to your first booking in less than 5 minutes.</p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8 relative">
               <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-100 -z-10"></div>
               
               {[
                 { step: '1', title: 'Create business', desc: 'Sign up and set up your premium profile in minutes.' },
                 { step: '2', title: 'Set availability', desc: 'Define your working hours and available services.' },
                 { step: '3', title: 'Accept bookings', desc: 'Share your link and let clients book 24/7.' },
                 { step: '4', title: 'Get paid', desc: 'Receive payments directly to your bank account.' },
               ].map((item, i) => (
                 <motion.div variants={FADE_UP_ANIMATION_VARIANTS} key={i} className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-brand-background border-2 border-white shadow-xl flex items-center justify-center text-2xl font-bold text-brand-primary mb-6 relative z-10">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-2">{item.title}</h3>
                    <p className="text-brand-muted">{item.desc}</p>
                 </motion.div>
               ))}
            </div>
          </div>
        </motion.section>

        {/* Business Types Section */}
        <motion.section 
          initial="hidden" 
          whileInView="show" 
          viewport={{ once: true, margin: "-100px" }}
          variants={STAGGER_CHILDREN_VARIANTS}
          id="solutions" 
          className="py-32 px-6 bg-brand-dark text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-accent/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
             <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for local<br/>businesses that care<br/>about design.</h2>
                  <p className="text-lg text-white/70 mb-10 max-w-md">
                    Whether you run a high-end salon, a boutique clinic, or an independent consultancy, Lumina elevates your customer experience from the very first click.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: <Scissors className="w-5 h-5"/>, label: 'Salons & Barbers' },
                      { icon: <Shield className="w-5 h-5"/>, label: 'Clinics & Spas' },
                      { icon: <Briefcase className="w-5 h-5"/>, label: 'Consultants' },
                      { icon: <Camera className="w-5 h-5"/>, label: 'Photographers' },
                      { icon: <Dumbbell className="w-5 h-5"/>, label: 'Gyms & Trainers' },
                      { icon: <Sparkles className="w-5 h-5"/>, label: 'And much more' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                        <div className="text-brand-accent">{item.icon}</div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="relative aspect-[4/5] lg:aspect-auto lg:h-[700px] rounded-3xl overflow-hidden glass-panel-dark border-white/20 p-2">
                   <Image src="https://picsum.photos/seed/salon/800/1000" alt="Business Profile Preview" fill className="object-cover rounded-2xl opacity-60" referrerPolicy="no-referrer" />
                   
                   {/* Overlay UI elements simulating booking page on mobile */}
                   <div className="absolute inset-x-8 bottom-8 top-1/3 bg-white rounded-t-3xl shadow-2xl p-6 flex flex-col transform transition-transform hover:-translate-y-2">
                      <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                      <h3 className="text-2xl font-bold text-brand-dark mb-1">Premium Haircut</h3>
                      <p className="text-brand-muted text-sm mb-6">45 mins • $65.00</p>
                      
                      <div className="space-y-3 mb-6 flex-1">
                        <div className="text-sm font-semibold text-brand-dark mb-2">Select Staff</div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                           {[1,2,3].map(i => (
                             <div key={i} className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl border ${i===1 ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-100'}`}>
                               <div className="w-12 h-12 rounded-full overflow-hidden relative">
                                  <Image src={`https://picsum.photos/seed/staff${i}/100/100`} alt="Staff" fill className="object-cover" referrerPolicy="no-referrer" />
                               </div>
                               <span className="text-xs font-medium text-brand-dark">Sarah</span>
                             </div>
                           ))}
                        </div>
                      </div>

                      <button className="w-full bg-brand-dark text-white py-4 rounded-xl font-medium mt-auto">
                        Continue to Time
                      </button>
                   </div>
                </motion.div>
             </div>
          </div>
        </motion.section>

        {/* Pricing */}
        <motion.section 
          initial="hidden" 
          whileInView="show" 
          viewport={{ once: true, margin: "-100px" }}
          variants={STAGGER_CHILDREN_VARIANTS}
          id="pricing" 
          className="py-32 px-6"
        >
          <div className="max-w-7xl mx-auto">
             <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="text-center max-w-2xl mx-auto mb-20">
                <h2 className="text-4xl font-bold text-brand-dark mb-4">Simple, transparent pricing</h2>
                <p className="text-lg text-brand-muted">Start for free. Upgrade when you need more power.</p>
             </motion.div>

             <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
                  <PricingCard 
                    title="Starter"
                    price="$0"
                    description="Perfect for individuals just getting started."
                    features={[
                      "1 Staff Member",
                      "Unlimited Bookings",
                      "Basic Booking Page",
                      "Email Reminders"
                    ]}
                  />
                </motion.div>
                <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
                  <PricingCard 
                    title="Professional"
                    price="$29"
                    description="For growing businesses that need more power."
                    isPopular
                    features={[
                      "Up to 5 Staff Members",
                      "Accept Payments & Deposits",
                      "Custom Booking Page",
                      "SMS & Email Reminders",
                      "Advanced Analytics"
                    ]}
                  />
                </motion.div>
                <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
                  <PricingCard 
                    title="Enterprise"
                    price="$99"
                    description="For large teams with complex requirements."
                    features={[
                      "Unlimited Staff Members",
                      "Multiple Locations",
                      "Priority Support",
                      "API Access",
                      "Custom Integrations"
                    ]}
                  />
                </motion.div>
             </div>
          </div>
        </motion.section>

        {/* Testimonials */}
        <section id="testimonials" className="py-32 px-6 bg-brand-primary/5">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-brand-dark mb-16">Loved by thousands</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Jessica Smith", role: "Salon Owner", text: "Lumina completely changed how I run my salon. The interface is stunning and my clients love how easy it is to book." },
                { name: "David Chen", role: "Independent Consultant", text: "The cleanest booking software I've ever used. Taking payments upfront reduced my no-shows to literally zero." },
                { name: "Amanda Ross", role: "Yoga Studio Manager", text: "We switched from a clunky legacy system. Our staff loves it, and the analytics dashboard is simply beautiful." }
              ].map((t, i) => (
                <div key={i} className="glass-panel p-8 rounded-3xl bg-white/60">
                  <div className="flex gap-1 mb-6">
                    {[1,2,3,4,5].map(star => <Star key={star} className="w-5 h-5 fill-brand-warning text-brand-warning" />)}
                  </div>
                  <p className="text-lg text-brand-dark mb-8 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden relative border border-gray-100">
                       <Image src={`https://picsum.photos/seed/testimonial${i}/100/100`} alt={t.name} fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <div className="font-bold text-brand-dark">{t.name}</div>
                      <div className="text-sm text-brand-muted">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-32 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-brand-dark mb-4">Frequently asked questions</h2>
              <p className="text-lg text-brand-muted">Everything you need to know about the product and billing.</p>
            </div>
            
            <div className="space-y-4">
              {[
                { q: "Can I accept payments upfront?", a: "Yes, you can require full or partial deposit payments when a client books an appointment, reducing no-shows and guaranteeing revenue." },
                { q: "Does it sync with my Google Calendar?", a: "Absolutely. Lumina provides robust two-way syncing with Google Calendar, Apple Calendar, and Outlook to ensure you never get double-booked." },
                { q: "Can I manage multiple staff members?", a: "Yes! Our Professional and Enterprise plans allow you to add multiple staff members, each with their own unique working hours, services, and breaks." },
                { q: "Is there a contract or commitment?", a: "No. All our plans are month-to-month and you can cancel at any time with a single click." }
              ].map((faq, i) => (
                <details key={i} className="group glass-panel bg-white p-6 rounded-2xl [&_summary::-webkit-details-marker]:hidden cursor-pointer border border-gray-200">
                  <summary className="flex items-center justify-between font-bold text-lg text-brand-dark">
                    {faq.q}
                    <span className="transition group-open:rotate-180">
                      <ChevronDown className="w-5 h-5 text-brand-muted" />
                    </span>
                  </summary>
                  <p className="text-brand-muted mt-4 leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="max-w-5xl mx-auto glass-panel bg-white/40 border border-white p-12 md:p-20 rounded-[3rem] text-center relative z-10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-[3rem] pointer-events-none"></div>
            <h2 className="text-4xl md:text-6xl font-bold text-brand-dark mb-6 tracking-tight">Ready to modernize<br/>your business?</h2>
            <p className="text-xl text-brand-muted mb-10 max-w-2xl mx-auto">Join thousands of businesses providing a premium booking experience to their clients.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto bg-brand-primary text-white px-8 py-4 rounded-full font-medium hover:bg-brand-secondary transition-all shadow-xl hover:-translate-y-1 text-lg">
                Start accepting bookings today
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl bg-brand-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-brand-dark">Lumina</span>
              </div>
              <p className="text-brand-muted max-w-xs mb-6">
                The premium booking platform for modern local service businesses.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-brand-dark mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-brand-muted">
                <li><Link href="/" className="hover:text-brand-primary">Features</Link></li>
                <li><Link href="/" className="hover:text-brand-primary">Pricing</Link></li>
                <li><Link href="/" className="hover:text-brand-primary">Integrations</Link></li>
                <li><Link href="/" className="hover:text-brand-primary">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-brand-dark mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-brand-muted">
                <li><Link href="/" className="hover:text-brand-primary">Help Center</Link></li>
                <li><Link href="/" className="hover:text-brand-primary">Blog</Link></li>
                <li><Link href="/" className="hover:text-brand-primary">Community</Link></li>
                <li><Link href="/" className="hover:text-brand-primary">Guides</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-brand-dark mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-brand-muted">
                <li><Link href="/" className="hover:text-brand-primary">About</Link></li>
                <li><Link href="/" className="hover:text-brand-primary">Careers</Link></li>
                <li><Link href="/" className="hover:text-brand-primary">Legal</Link></li>
                <li><Link href="/" className="hover:text-brand-primary">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-brand-muted">
            <div>© {new Date().getFullYear()} Lumina. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <Link href="/" className="hover:text-brand-primary">Twitter</Link>
              <Link href="/" className="hover:text-brand-primary">LinkedIn</Link>
              <Link href="/" className="hover:text-brand-primary">Instagram</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-panel bg-white/50 p-8 rounded-3xl hover:bg-white/80 transition-colors border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 group">
      <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-brand-dark mb-3">{title}</h3>
      <p className="text-brand-muted leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({ title, price, description, features, isPopular }: { title: string, price: string, description: string, features: string[], isPopular?: boolean }) {
  return (
    <div className={`p-8 rounded-[2rem] relative flex flex-col h-full transition-transform hover:-translate-y-2 ${isPopular ? 'bg-brand-dark text-white shadow-2xl shadow-brand-dark/20' : 'glass-panel bg-white border border-gray-200'}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-accent text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
          MOST POPULAR
        </div>
      )}
      
      <div className="mb-8">
        <h3 className={`text-xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-brand-dark'}`}>{title}</h3>
        <p className={`text-sm mb-6 ${isPopular ? 'text-gray-300' : 'text-brand-muted'}`}>{description}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight">{price}</span>
          <span className={`text-sm font-medium ${isPopular ? 'text-gray-400' : 'text-brand-muted'}`}>/mo</span>
        </div>
      </div>
      
      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3">
            <Check className={`w-5 h-5 ${isPopular ? 'text-brand-accent' : 'text-brand-primary'}`} />
            <span className={isPopular ? 'text-gray-200' : 'text-brand-dark'}>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button className={`w-full py-4 rounded-xl font-medium transition-colors ${isPopular ? 'bg-brand-accent hover:bg-blue-400 text-white' : 'bg-gray-100 hover:bg-gray-200 text-brand-dark'}`}>
        Get started
      </button>
    </div>
  );
}
