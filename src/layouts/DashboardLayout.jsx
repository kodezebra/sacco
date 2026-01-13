import { 
  Users, Banknote, ArrowRightLeft, PieChart, Wallet,
  Settings, PanelLeft, LayoutDashboard, FileText, Layers, Briefcase, LogOut
} from 'lucide';
import Icon from '../components/Icon.jsx';
import MainLayout from './MainLayout.jsx';

export default function DashboardLayout({ title, children }) {
  const menuSections = [
    {
      label: "CORE",
      items: [
        { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      ]
    },
    {
      label: "PEOPLE",
      items: [
        { label: "Members", href: "/dashboard/members", icon: Users },
        { label: "Staff / HR", href: "/dashboard/staff", icon: Briefcase },
        { label: "Payroll", href: "/dashboard/payroll", icon: Wallet },
      ]
    },
    {
      label: "OPERATIONS",
      items: [
        { label: "Business Units", href: "/dashboard/associations", icon: Layers },
        { label: "Ledger", href: "/dashboard/transactions", icon: ArrowRightLeft },
      ]
    },
    {
      label: "FINANCIALS",
      items: [
        { label: "Savings", href: "/dashboard/savings", icon: Wallet },
        { label: "Shares", href: "/dashboard/shares", icon: PieChart },
        { label: "Loans", href: "/dashboard/loans", icon: Banknote },
      ]
    },
    {
      label: "SYSTEM",
      items: [
        { label: "Reports", href: "/dashboard/reports", icon: FileText },
        { label: "Settings", href: "/dashboard/sacco", icon: Settings },
      ]
    }
  ];

  return (
    <MainLayout title={title}>
      <div id="main-dashboard-drawer" class="drawer md:drawer-open">
        <input id="dashboard-drawer" type="checkbox" class="drawer-toggle" />
        
        <div class="drawer-content flex flex-col min-h-screen bg-slate-50/50">
          {/* Navbar */}
          <nav class="navbar w-full bg-base-100 border-b border-base-200 sticky top-0 z-10 h-16 px-4 md:px-8">
            <div class="flex-none">
              <button 
                class="btn btn-square btn-ghost"
                onclick="window.innerWidth >= 768 ? document.getElementById('main-dashboard-drawer').classList.toggle('md:drawer-open') : document.getElementById('dashboard-drawer').click()"
              >
                <Icon icon={PanelLeft} size={20} />
              </button>
            </div>
            <div class="flex-1 px-2 text-lg font-black tracking-tight text-slate-900 truncate">
              {title}
            </div>
            <div class="flex-none">
               <a href="/auth/logout" class="btn btn-ghost btn-sm gap-2 text-error hover:bg-error/10 rounded-lg font-bold">
                 <Icon icon={LogOut} size={16} />
                 <span class="hidden lg:inline">Log Out</span>
               </a>
            </div>
          </nav>
          
          {/* Page Content */}
          <main class="p-4 md:p-10">
            {children}
          </main>
          
          {/* Toast/Alert container for HTMX */}
          <div id="htmx-toast-container" class="toast toast-top toast-end"></div>

          {/* HTMX Event Listeners */}
          <script>
            {`
            document.addEventListener('htmx:afterSwap', function (evt) {
              const hxTrigger = evt.detail.xhr.getResponseHeader('HX-Trigger');
              if (hxTrigger) {
                const triggers = JSON.parse(hxTrigger);

                // Handle showMessage (toast)
                if (triggers.showMessage) {
                  const { message, type } = triggers.showMessage;
                  const toastContainer = document.getElementById('htmx-toast-container');
                  if (toastContainer) {
                    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
                    const icon = type === 'success' ? '✔' : '✖';
                    const toast = document.createElement('div');
                    toast.className = 'alert ' + alertClass + ' text-sm font-bold shadow-xl rounded-2xl';
                    toast.innerHTML = \`<span>\${icon} \${message}</span>\`;
                    toastContainer.appendChild(toast);
                    setTimeout(() => toast.remove(), 5000); // Remove after 5 seconds
                  }
                }

                // Handle refreshList
                if (triggers.refreshList || triggers.memberUpdated || triggers.refreshTransactions) {
                  window.location.reload(); 
                }

                // Handle closeModal
                if (triggers.closeModal) {
                  const modal = document.getElementById('htmx-modal');
                  if (modal) {
                    modal.close();
                  }
                }
              }
            });
            `}
          </script>
        </div>

        <div class="drawer-side z-20">
          <label for="dashboard-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
          <div class="flex min-h-full flex-col items-start bg-base-100 border-r border-base-200 text-base-content w-64 transition-transform duration-200">
            
            {/* Sidebar Header */}
            <div class="w-full p-6 flex items-center gap-3 border-b border-base-200 h-16 shrink-0 bg-slate-50/50">
               <div class="text-primary font-black text-2xl tracking-tighter flex items-center gap-2">
                 <div class="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm">kz</div>
                 <span>kzApp</span>
               </div>
            </div>

            {/* Sidebar Menu */}
            <div class="w-full grow overflow-y-auto custom-scrollbar p-4 space-y-5">
              {menuSections.map((section, idx) => (
                <div key={idx}>
                  <h3 class="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                    {section.label}
                  </h3>
                  <ul class="menu w-full p-0 gap-0.5">
                    {section.items.map((item, i) => (
                      <li key={i}>
                        <a 
                          href={item.href} 
                          class="flex gap-3 items-center py-2 rounded-xl hover:bg-primary/5 hover:text-primary transition-all font-bold text-sm text-slate-600"
                        >
                          <Icon icon={item.icon} size={18} class="shrink-0" />
                          <span class="whitespace-nowrap">{item.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Sidebar Footer */}
            <div class="w-full p-4 border-t border-base-200 bg-slate-50/30">
               <div class="p-4 bg-primary/10 rounded-xl flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs">?</div>
                  <div>
                     <p class="text-[10px] font-black text-primary uppercase tracking-wider">Need Help?</p>
                     <a href="/contact" class="text-[10px] font-medium text-slate-500 hover:underline">Contact Support</a>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generic Modal for HTMX content */}
      <dialog id="htmx-modal" class="modal overflow-hidden">
        <div id="htmx-modal-content" class="modal-box p-0 rounded-2xl max-w-2xl bg-base-100 overflow-hidden shadow-2xl">
          {/* Content will be loaded here by HTMX */}
        </div>
        <form method="dialog" class="modal-backdrop bg-slate-900/40 backdrop-blur-sm">
          <button>close</button>
        </form>
      </dialog>
    </MainLayout>
  );
}