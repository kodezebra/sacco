import PublicLayout from '../../layouts/PublicLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Wallet, Banknote, PieChart, Layers, ShieldCheck, Zap, ChevronRight, Utensils, Bird, Wheat } from 'lucide';

export default function ServicesPage() {
  const coreServices = [
    {
      title: "Commercial Bakery",
      desc: "Producing high-quality baked goods for the local market while providing training and employment for members.",
      icon: Utensils,
      color: "bg-orange-500/10 text-orange-600",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
      featured: true
    },
    {
      title: "Poultry Farming",
      desc: "Modern poultry production units focusing on egg and meat supply chains with high-yield returns for investors.",
      icon: Bird,
      color: "bg-amber-500/10 text-amber-600",
      image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=800",
      featured: true
    },
    {
      title: "Poultry Feed Production",
      desc: "Manufacturing high-grade, nutritional feeds specifically formulated for optimal poultry growth and high-yield egg production.",
      icon: Wheat,
      color: "bg-emerald-500/10 text-emerald-600",
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=800",
      featured: true
    }
  ];

  const financialServices = [
    {
      title: "Smart Savings",
      desc: "Earn competitive interest rates on your deposits with flexible withdrawal options.",
      icon: Wallet,
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      title: "Quick Loans",
      desc: "Access affordable credit for personal or business needs with easy repayment.",
      icon: Banknote,
      color: "bg-indigo-500/10 text-indigo-600"
    },
    {
      title: "Share Capital",
      desc: "Become a co-owner and earn annual dividends as the cooperative expands.",
      icon: PieChart,
      color: "bg-purple-500/10 text-purple-600"
    }
  ];

  return (
    <PublicLayout title="Our Services">
      <div class="bg-base-100 pb-32">
        {/* Header Section */}
        <section class="bg-slate-900 py-32 px-6">
          <div class="max-w-4xl mx-auto text-center space-y-6">
            <h1 class="text-5xl md:text-6xl font-black text-white tracking-tighter">Enterprises built for <br />our <span class="text-primary italic">community.</span></h1>
            <p class="text-xl text-slate-400 leading-relaxed">We invest in high-impact business units that create jobs, provide quality products, and generate wealth for our members.</p>
          </div>
        </section>

        {/* Core Enterprises Grid */}
        <div class="max-w-7xl mx-auto px-6 -mt-16 mb-24">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreServices.map((service, index) => (
              <div 
                key={index} 
                class="fintech-card overflow-hidden flex flex-col group cursor-default"
              >
                <div class="h-48 overflow-hidden relative">
                   <img src={service.image} alt={service.title} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div class="p-10 flex-grow flex flex-col justify-between">
                  <div>
                    <div class={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:-translate-y-2 group-hover:shadow-xl shadow-current/10 ${service.color}`}>
                      <Icon icon={service.icon} size={28} />
                    </div>
                    <h3 class="text-2xl font-black mb-4">{service.title}</h3>
                    <p class="text-slate-500 leading-relaxed text-sm">{service.desc}</p>
                  </div>
                  
                  <div class="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-primary group-hover:translate-x-2 transition-all duration-300">
                    Unit Performance
                    <Icon icon={ChevronRight} size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Services Bar */}
        <section class="max-w-7xl mx-auto px-6">
          <div class="text-center mb-16 space-y-4">
             <h2 class="text-4xl font-black text-slate-900">Supported by strong financials.</h2>
             <p class="text-slate-500">Our business units are powered by the collective savings and shares of our members.</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {financialServices.map((service, index) => (
              <div key={index} class="flex items-start gap-6 p-8 rounded-[2rem] bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-xl transition-all duration-500">
                <div class={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${service.color}`}>
                  <Icon icon={service.icon} size={24} />
                </div>
                <div>
                  <h4 class="text-lg font-black mb-2">{service.title}</h4>
                  <p class="text-sm text-slate-500 leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Quote */}
        <section class="max-w-5xl mx-auto px-6 mt-32">
           <div class="relative p-12 md:p-20 text-center">
              <div class="absolute inset-0 bg-primary/5 rounded-[3rem] -rotate-1"></div>
              <div class="relative space-y-8">
                 <Icon icon={Zap} size={48} class="mx-auto text-primary opacity-20" />
                 <h2 class="text-3xl md:text-4xl font-black leading-tight text-slate-800 italic">
                   "We are not just a SACCO; we are an engine for local production and economic empowerment."
                 </h2>
                 <p class="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">— Management, kzApp SACCO</p>
              </div>
           </div>
        </section>
      </div>
    </PublicLayout>
  );
}
