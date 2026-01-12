import PublicLayout from '../../layouts/PublicLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Wallet, Banknote, PieChart, Layers, ShieldCheck, Zap } from 'lucide';

export default function ServicesPage() {
  const services = [
    {
      title: "Smart Savings",
      desc: "Earn competitive interest rates on your deposits with flexible withdrawal options.",
      icon: Wallet,
      color: "text-primary"
    },
    {
      title: "Quick Loans",
      desc: "Get access to affordable credit for your personal or business needs with easy repayment plans.",
      icon: Banknote,
      color: "text-success"
    },
    {
      title: "Share Capital",
      desc: "Become a co-owner of the SACCO and earn dividends on your shares every year.",
      icon: PieChart,
      color: "text-warning"
    },
    {
      title: "Business Units",
      desc: "We invest in high-yield projects like real estate and agriculture to grow your wealth.",
      icon: Layers,
      color: "text-info"
    },
    {
      title: "Secure Future",
      desc: "Your funds are protected by our rigorous financial policies and insurance partners.",
      icon: ShieldCheck,
      color: "text-secondary"
    },
    {
      title: "Digital Banking",
      desc: "Manage your account, apply for loans, and track your growth through our digital platform.",
      icon: Zap,
      color: "text-error"
    }
  ];

  return (
    <PublicLayout title="Our Services">
      <div class="bg-base-100 py-16 px-4">
        <div class="max-w-6xl mx-auto text-center mb-16">
          <h1 class="text-4xl font-bold mb-4">Empowering Your Financial Growth</h1>
          <p class="text-slate-500 max-w-2xl mx-auto">Discover the range of financial products and services designed to help you achieve your goals and build a secure future.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div key={index} class="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
              <div class="card-body p-8">
                <div class={`w-12 h-12 rounded-lg bg-base-200 flex items-center justify-center mb-6 ${service.color}`}>
                  <Icon icon={service.icon} size={24} />
                </div>
                <h3 class="card-title text-xl mb-3">{service.title}</h3>
                <p class="text-slate-500 leading-relaxed">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div class="mt-20 text-center bg-primary text-primary-content p-12 rounded-3xl max-w-4xl mx-auto shadow-xl">
           <h2 class="text-3xl font-bold mb-4">Ready to start saving?</h2>
           <p class="mb-8 opacity-80">Join thousands of members already growing their wealth with kzApp SACCO.</p>
           <a href="/auth/login" class="btn btn-secondary px-12 rounded-full font-bold">Join Now</a>
        </div>
      </div>
    </PublicLayout>
  );
}
