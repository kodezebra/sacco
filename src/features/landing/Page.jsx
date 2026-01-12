import PublicLayout from '../../layouts/PublicLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { ArrowRight, Wallet, Banknote, ShieldCheck, Users, TrendingUp, ChevronRight } from 'lucide';

export default function LandingPage() {
  const stats = [
    { label: "Members", value: "2,500+" },
    { label: "Assets", value: "5.2B UGX" },
    { label: "Loans Issued", value: "3.8B UGX" },
    { label: "Dividends (2025)", value: "12.5%" }
  ];

  return (
    <PublicLayout title="Empowering Your Growth">
      {/* Hero Section */}
      <div class="relative bg-base-100 overflow-hidden">
        <div class="max-w-6xl mx-auto px-4 py-24 md:py-32 relative z-10">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-8 animate-bounce">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now accepting new members
            </div>
            <h1 class="text-6xl md:text-7xl font-black tracking-tighter leading-tight mb-8">
              Grow Your Wealth <br />
              <span class="text-primary italic">Together.</span>
            </h1>
            <p class="text-xl text-slate-500 leading-relaxed mb-10 max-w-lg">
              The modern SACCO platform built for transparency, growth, and community empowerment. 
              Secure your future with smart savings and affordable credit.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <a href="/auth/login" class="btn btn-primary btn-lg px-12 gap-2 shadow-lg shadow-primary/20">
                Get Started
                <Icon icon={ArrowRight} size={20} />
              </a>
              <a href="/services" class="btn btn-outline btn-lg px-12 gap-2">
                Our Services
              </a>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Section */}
      <div class="bg-primary py-12">
        <div class="max-w-6xl mx-auto px-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} class="text-center text-primary-content">
                <div class="text-3xl md:text-4xl font-black mb-1">{stat.value}</div>
                <div class="text-sm opacity-70 font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div class="py-24 px-4 bg-slate-50">
        <div class="max-w-6xl mx-auto">
          <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
            <div class="max-w-2xl">
              <h2 class="text-4xl font-bold mb-4">Why choose kzApp SACCO?</h2>
              <p class="text-slate-500 text-lg">We combine traditional cooperative values with modern technology to deliver a superior financial experience.</p>
            </div>
            <a href="/about" class="btn btn-ghost gap-2 group">
              Learn more about us
              <Icon icon={ChevronRight} size={18} class="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="card bg-base-100 shadow-sm border border-slate-200 p-8 hover:-translate-y-2 transition-transform">
              <div class="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center text-success mb-6">
                <Icon icon={ShieldCheck} size={28} />
              </div>
              <h3 class="text-xl font-bold mb-4">Secured Assets</h3>
              <p class="text-slate-500 leading-relaxed">Your investments are backed by tangible assets and insured by leading providers.</p>
            </div>

            <div class="card bg-base-100 shadow-sm border border-slate-200 p-8 hover:-translate-y-2 transition-transform">
              <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Icon icon={TrendingUp} size={28} />
              </div>
              <h3 class="text-xl font-bold mb-4">High Returns</h3>
              <p class="text-slate-500 leading-relaxed">Consistently delivering above-market dividends through strategic business unit investments.</p>
            </div>

            <div class="card bg-base-100 shadow-sm border border-slate-200 p-8 hover:-translate-y-2 transition-transform">
              <div class="w-14 h-14 bg-warning/10 rounded-2xl flex items-center justify-center text-warning mb-6">
                <Icon icon={Users} size={28} />
              </div>
              <h3 class="text-xl font-bold mb-4">Community Focused</h3>
              <p class="text-slate-500 leading-relaxed">By members, for members. We prioritize the financial well-being of our community above all.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div class="py-24 px-4 bg-base-100">
        <div class="max-w-4xl mx-auto bg-slate-900 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
           <div class="relative z-10">
             <h2 class="text-4xl font-bold mb-6">Take control of your financial future today.</h2>
             <p class="text-xl opacity-70 mb-10 max-w-2xl mx-auto leading-relaxed">
               Joining kzApp SACCO is fast and easy. Start your journey towards financial freedom with as little as 50,000 UGX.
             </p>
             <div class="flex flex-col sm:flex-row gap-4 justify-center">
               <a href="/auth/login" class="btn btn-primary btn-lg px-12">Apply Now</a>
               <a href="/contact" class="btn btn-outline btn-lg px-12 text-white hover:text-slate-900">Talk to Us</a>
             </div>
           </div>
           {/* Background accents */}
           <div class="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
           <div class="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        </div>
      </div>
    </PublicLayout>
  );
}
