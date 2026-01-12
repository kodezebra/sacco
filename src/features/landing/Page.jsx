import PublicLayout from '../../layouts/PublicLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { ArrowRight, Wallet, Banknote, ShieldCheck, Users, TrendingUp, ChevronRight, Zap, Globe, Lock } from 'lucide';

export default function LandingPage() {
  const stats = [
    { label: "Community Members", value: "250+", icon: Users },
    { label: "Youth Empowered", value: "200+", icon: Zap },
    { label: "Local Jobs Created", value: "50+", icon: TrendingUp },
    { label: "Active Enterprises", value: "3", icon: Banknote }
  ];

  return (
    <PublicLayout title="Empowering Your Growth">
      {/* Premium Hero Section */}
      <section class="relative pt-20 pb-32 overflow-hidden bg-base-100">
        <div class="max-w-7xl mx-auto px-6">
          <div class="grid lg:grid-cols-2 gap-20 items-center">
            <div class="space-y-10 relative z-10">
              <div class="inline-flex items-center gap-3 bg-primary/5 text-primary px-5 py-2.5 rounded-2xl text-sm font-bold border border-primary/10">
                <span class="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse"></span>
                Next-Gen Cooperative Banking
              </div>
              <h1 class="text-7xl xl:text-8xl font-black tracking-[calc(-0.04em)] leading-[0.9] text-slate-900">
                The future of <br />
                <span class="text-primary italic">Wealth.</span>
              </h1>
              <p class="text-xl text-slate-500 leading-relaxed max-w-lg">
                kzApp is the all-in-one cooperative platform that empowers members with 
                secure savings, affordable credit, and transparent growth. 
              </p>
              <div class="flex flex-col sm:flex-row gap-5">
                <a href="/auth/login" class="btn btn-primary btn-lg rounded-2xl px-12 h-16 text-lg shadow-2xl shadow-primary/30 group">
                  Start Your Journey
                  <Icon icon={ArrowRight} size={20} class="group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="/services" class="btn btn-ghost btn-lg rounded-2xl px-10 h-16 text-lg border border-slate-200">
                  Our Products
                </a>
              </div>
            </div>

            {/* Visual Side: Premium Industry Collage */}
            <div class="relative">
              <div class="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-60"></div>
              <div class="grid grid-cols-2 gap-4">
                 <div class="space-y-4">
                    <div class="h-64 rounded-3xl overflow-hidden shadow-2xl">
                       <img src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=600" class="w-full h-full object-cover" alt="Poultry Farming" />
                    </div>
                    <div class="h-48 rounded-3xl overflow-hidden shadow-2xl">
                       <img src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=600" class="w-full h-full object-cover" alt="Poultry" />
                    </div>
                 </div>
                 <div class="space-y-4 pt-12">
                    <div class="h-48 rounded-3xl overflow-hidden shadow-2xl">
                       <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600" class="w-full h-full object-cover" alt="Bakery" />
                    </div>
                    <div class="h-64 rounded-3xl overflow-hidden shadow-2xl">
                       <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600" class="w-full h-full object-cover" alt="Feeds" />
                    </div>
                 </div>
              </div>

              {/* Float Stats */}
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center gap-2">
                 <div class="text-primary font-black text-3xl">80%</div>
                 <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Youth Participation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar (Stats) */}
      <section class="bg-slate-900 py-16">
        <div class="max-w-7xl mx-auto px-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i} class="flex items-center gap-6">
                <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/5">
                  <Icon icon={stat.icon} size={24} />
                </div>
                <div>
                  <div class="text-3xl font-black text-white">{stat.value}</div>
                  <div class="text-[10px] font-bold uppercase tracking-widest text-white/40">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section class="py-32 px-6 bg-base-200/50">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div class="max-w-2xl space-y-4 text-center md:text-left mx-auto md:mx-0">
              <h2 class="text-5xl font-black tracking-tight text-slate-900 leading-none">Built for the <br />Modern Member</h2>
              <p class="text-lg text-slate-500 max-w-md">Our platform bridges the gap between traditional cooperative values and cutting-edge financial technology.</p>
            </div>
            <a href="/about" class="btn btn-ghost btn-lg rounded-2xl gap-3 border border-slate-200 bg-white shadow-sm group">
              About the Platform
              <Icon icon={ChevronRight} size={20} class="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <div class="fintech-card p-10 space-y-8 group">
              <div class="w-16 h-16 rounded-[1.25rem] bg-blue-500/10 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-110">
                <Icon icon={Lock} size={32} />
              </div>
              <div class="space-y-4">
                <h3 class="text-2xl font-black">Bank-Grade Security</h3>
                <p class="text-slate-500 leading-relaxed">Multi-layered encryption and two-factor authentication protect your funds and personal data 24/7.</p>
              </div>
            </div>

            <div class="fintech-card p-10 space-y-8 group">
              <div class="w-16 h-16 rounded-[1.25rem] bg-emerald-500/10 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-110">
                <Icon icon={Globe} size={32} />
              </div>
              <div class="space-y-4">
                <h3 class="text-2xl font-black">Global Access</h3>
                <p class="text-slate-500 leading-relaxed">Manage your savings, apply for loans, and track your dividends from anywhere in the world.</p>
              </div>
            </div>

            <div class="fintech-card p-10 space-y-8 group">
              <div class="w-16 h-16 rounded-[1.25rem] bg-amber-500/10 text-amber-600 flex items-center justify-center transition-transform group-hover:scale-110">
                <Icon icon={Zap} size={32} />
              </div>
              <div class="space-y-4">
                <h3 class="text-2xl font-black">Instant Liquidity</h3>
                <p class="text-slate-500 leading-relaxed">Our automated processing ensures that your withdrawal requests and loan disbursements are faster than ever.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section class="py-32 px-6">
        <div class="max-w-7xl mx-auto bg-primary rounded-[3rem] p-16 md:p-24 text-center text-primary-content relative overflow-hidden shadow-[0_40px_100px_rgba(37,99,235,0.3)]">
           <div class="relative z-10 max-w-3xl mx-auto space-y-10">
             <h2 class="text-6xl md:text-7xl font-black tracking-tighter leading-none">Ready to redefine your <br />financial future?</h2>
             <p class="text-xl opacity-80 leading-relaxed">
               Join over 2,500 members who trust kzApp SACCO with their wealth. 
               Opening an account takes less than 5 minutes.
             </p>
             <div class="flex flex-col sm:flex-row gap-6 justify-center pt-4">
               <a href="/auth/login" class="btn btn-secondary btn-lg rounded-2xl px-16 h-16 text-lg border-none">
                 Join the Cooperative
               </a>
               <a href="/contact" class="btn btn-ghost btn-lg rounded-2xl px-12 h-16 text-lg border border-white/20 hover:bg-white/10">
                 Speak with an Advisor
               </a>
             </div>
           </div>
           
           {/* Abstract Shapes */}
           <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
           <div class="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        </div>
      </section>
    </PublicLayout>
  );
}
