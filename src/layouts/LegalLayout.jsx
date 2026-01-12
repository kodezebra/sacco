import PublicLayout from '../layouts/PublicLayout.jsx';
import Icon from '../components/Icon.jsx';
import { Shield, Scale, Lock, ChevronRight } from 'lucide';

export default function LegalLayout({ title, activeTab, children }) {
  const links = [
    { id: 'privacy', label: 'Privacy Policy', href: '/privacy', icon: Shield },
    { id: 'terms', label: 'Terms of Service', href: '/terms', icon: Scale },
    { id: 'security', label: 'Security Statement', href: '/security', icon: Lock },
  ];

  return (
    <PublicLayout title={title}>
      <div class="bg-base-200/50 min-h-screen py-12 px-4">
        <div class="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside class="lg:w-64 shrink-0">
            <div class="card bg-base-100 shadow-sm border border-base-200 overflow-hidden sticky top-24">
              <div class="p-4 border-b border-base-200 bg-base-50">
                <h3 class="font-bold text-sm uppercase tracking-widest opacity-50">Legal Center</h3>
              </div>
              <ul class="menu p-2 gap-1">
                {links.map(link => (
                  <li key={link.id}>
                    <a 
                      href={link.href} 
                      class={`flex items-center justify-between group ${activeTab === link.id ? 'active font-bold text-primary' : ''}`}
                    >
                      <div class="flex items-center gap-3">
                        <Icon icon={link.icon} size={18} />
                        {link.label}
                      </div>
                      <Icon icon={ChevronRight} size={14} class={`opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === link.id ? 'opacity-100' : ''}`} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Content Area */}
          <main class="flex-1">
            <div class="card bg-base-100 shadow-sm border border-base-200">
              <div class="card-body p-8 md:p-12 prose prose-slate max-w-none">
                {children}
              </div>
            </div>
            
            <div class="mt-8 text-center text-xs text-slate-400">
               Last updated: January 12, 2026. <br />
               These documents are for informational purposes. For legal advice, consult with a qualified professional.
            </div>
          </main>
        </div>
      </div>
    </PublicLayout>
  );
}
