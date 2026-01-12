import LegalLayout from '../../layouts/LegalLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { ShieldCheck, Lock, EyeOff, Server } from 'lucide';

export default function SecurityStatementPage() {
  const pillars = [
    { title: "Encryption", desc: "All data transmitted between your device and our servers is encrypted using industry-standard TLS (SSL).", icon: Lock },
    { title: "Privacy", desc: "Strict access controls ensure that only authorized personnel can access sensitive member information.", icon: EyeOff },
    { title: "Reliability", desc: "Our infrastructure is hosted on secure, redundant cloud servers to ensure 99.9% uptime.", icon: Server }
  ];

  return (
    <LegalLayout title="Security Statement" activeTab="security">
      <h1 class="text-3xl font-black tracking-tight mb-8">Security Statement</h1>
      
      <p class="lead text-lg text-slate-600 mb-8">
        We understand that security is your top priority. kzApp SACCO employs multi-layered security protocols to safeguard your assets and personal information.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {pillars.map((p, i) => (
          <div key={i} class="p-6 bg-base-200/50 rounded-2xl border border-base-200">
            <div class="text-primary mb-4">
              <Icon icon={p.icon} size={28} />
            </div>
            <h3 class="font-bold mb-2">{p.title}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      <section class="mb-10">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
          <Icon icon={ShieldCheck} size={20} class="text-success" />
          How We Protect You
        </h2>
        <ul class="list-disc pl-6 space-y-3">
          <li><strong>Two-Factor Authentication (2FA):</strong> We require multiple forms of verification for sensitive actions like loan approvals or large withdrawals.</li>
          <li><strong>Real-time Monitoring:</strong> Our systems continuously monitor for suspicious activity or unauthorized access attempts.</li>
          <li><strong>Regular Audits:</strong> We conduct frequent security audits and vulnerability assessments to identify and patch potential risks.</li>
          <li><strong>Data Backups:</strong> Automated daily backups ensure that your records are safe even in the event of a system failure.</li>
        </ul>
      </section>

      <section class="bg-primary/5 p-8 rounded-3xl border border-primary/10">
        <h2 class="text-xl font-bold mb-4">Your Role in Security</h2>
        <p class="mb-0">
          Security is a shared responsibility. We advise all members to never share their passwords, 
          regularly update their credentials, and notify us immediately if they suspect their account 
          has been compromised.
        </p>
      </section>
    </LegalLayout>
  );
}
