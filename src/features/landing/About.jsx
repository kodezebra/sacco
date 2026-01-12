import PublicLayout from '../../layouts/PublicLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Target, Users, Shield, TrendingUp, Award, Clock } from 'lucide';

export default function AboutPage() {
  const values = [
    { title: "Transparency", desc: "We maintain open and honest communication with all our members.", icon: Shield },
    { title: "Member-Owned", desc: "Every member is a shareholder with a voice in our future.", icon: Users },
    { title: "Integrity", desc: "We adhere to the highest ethical standards in all our operations.", icon: Award },
    { title: "Innovation", desc: "We leverage technology to provide the best financial solutions.", icon: TrendingUp }
  ];

  return (
    <PublicLayout title="About Us">
      {/* Hero Section */}
      <div class="bg-base-200 py-20 px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-5xl font-bold mb-6">Our Journey & Mission</h1>
          <p class="text-xl text-slate-600 leading-relaxed">
            kzApp SACCO was founded with a single goal: to empower individuals and small businesses 
            through accessible, reliable, and innovative financial services.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div class="py-20 px-4 max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <div class="flex items-center gap-4 text-primary">
               <div class="p-3 bg-primary/10 rounded-xl">
                 <Icon icon={Target} size={32} />
               </div>
               <h2 class="text-3xl font-bold">Our Mission</h2>
            </div>
            <p class="text-lg text-slate-500 leading-relaxed">
              To provide members with high-quality financial products that foster 
              savings culture, provide credit for growth, and ensure long-term 
              wealth creation through strategic investments.
            </p>
            <ul class="space-y-3">
              <li class="flex items-center gap-2 text-slate-600">
                <Icon icon={Clock} size={16} class="text-success" />
                24/7 Digital Access
              </li>
              <li class="flex items-center gap-2 text-slate-600">
                <Icon icon={Clock} size={16} class="text-success" />
                Quick Loan Approvals
              </li>
            </ul>
          </div>
          <div class="grid grid-cols-2 gap-4">
             <div class="aspect-square bg-base-300 rounded-3xl animate-pulse"></div>
             <div class="aspect-square bg-primary rounded-3xl mt-8"></div>
             <div class="aspect-square bg-secondary rounded-3xl -mt-8"></div>
             <div class="aspect-square bg-base-200 rounded-3xl"></div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div class="bg-slate-50 py-20 px-4">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-16">The Values that Guide Us</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} class="card bg-base-100 shadow-sm border border-slate-200">
                <div class="card-body items-center text-center">
                  <div class="p-4 bg-base-200 rounded-full text-primary mb-4">
                    <Icon icon={v.icon} size={24} />
                  </div>
                  <h3 class="font-bold text-lg mb-2">{v.title}</h3>
                  <p class="text-slate-500 text-sm">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
