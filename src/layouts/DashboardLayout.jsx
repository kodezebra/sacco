import { 
  Users, Banknote, ArrowRightLeft, PieChart, Wallet,
  Settings, PanelLeft, LayoutDashboard, FileText, Layers, Briefcase, LogOut,
  Bell, ChevronDown, User, Menu
} from 'lucide';
import Icon from '../components/Icon.jsx';
import MainLayout from './MainLayout.jsx';

export default function DashboardLayout({ title, children, currentUser }) {
  const menuSections = [
    {
      label: "MENU",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Members", href: "/dashboard/members", icon: Users },
        { label: "Staff / HR", href: "/dashboard/staff", icon: Briefcase },
        { label: "Payroll", href: "/dashboard/payroll", icon: Wallet },
        { label: "Associations", href: "/dashboard/associations", icon: Layers },
      ]
    },
    {
      label: "FINANCE",
      items: [
        { label: "Transactions", href: "/dashboard/transactions", icon: ArrowRightLeft },
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
      <div id="main-dashboard-drawer" class="drawer md:drawer-open bg-whiten font-sans">
        <input id="dashboard-drawer" type="checkbox" class="drawer-toggle" />
        
        <div class="drawer-content flex flex-col min-h-screen transition-all duration-300 ease-in-out">
          {/* Header */}
          <header class="sticky top-0 z-30 flex w-full bg-white shadow-default border-b border-stroke h-16">
            <div class="flex flex-grow items-center justify-between px-4 md:px-6 2xl:px-11">
              <div class="flex items-center gap-2 sm:gap-4 md:hidden">
                {/* Hamburger Toggle */}
                <label for="dashboard-drawer" class="btn btn-square btn-ghost text-body hover:text-primary">
                  <Icon icon={Menu} size={24} />
                </label>
              </div>

              <div class="hidden sm:block"></div>

              <div class="flex items-center gap-3 sm:gap-7">
                <ul class="flex items-center gap-2 sm:gap-4">
                  {/* Notification Area */}
                  <li class="relative">
                    <button class="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray-2 hover:text-primary text-body transition-colors">
                      <span class="absolute -top-0.5 -right-0.5 z-1 h-2 w-2 rounded-full bg-red-500 inline-block"></span>
                      <Icon icon={Bell} size={18} />
                    </button>
                  </li>
                </ul>

                {/* User Area */}
                <div class="relative">
                  <div class="flex items-center gap-4">
                    <span class="hidden text-right lg:block">
                      <span class="block text-sm font-medium text-black">Administrator</span>
                      <span class="block text-xs font-medium text-body">Super User</span>
                    </span>
                    <div class="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border border-stroke flex items-center justify-center text-body">
                       <Icon icon={User} size={22} />
                    </div>
                    <a href="/auth/logout" class="btn btn-ghost btn-circle btn-sm text-bodydark2 hover:text-red-500" title="Log Out">
                       <Icon icon={LogOut} size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main class="w-full max-w-screen-2xl p-4 md:p-6 2xl:p-10 mx-auto">
             {/* Breadcrumb / Title Area */}
             <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 class="text-2xl font-bold text-black">
                   {title}
                </h2>
                <nav>
                   <ol class="flex items-center gap-2 text-sm font-medium text-body">
                      <li><a class="hover:text-primary" href="/dashboard">Dashboard</a></li>
                      <li class="text-primary font-semibold">/ {title}</li>
                   </ol>
                </nav>
             </div>

             {children}
          </main>

          {/* Toast/Alert container */}
          <div id="htmx-toast-container" class="toast toast-top toast-end z-50"></div>
          
           {/* Scripts */}
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
                    const alertClass = type === 'success' ? 'bg-success' : 'bg-error';
                    const toast = document.createElement('div');
                    toast.className = 'alert ' + alertClass + ' text-sm font-bold shadow-default rounded-sm text-white border-none py-3 px-6';
                    toast.innerHTML = '<span>' + message + '</span>';
                    toastContainer.appendChild(toast);
                    setTimeout(() => toast.remove(), 5000); 
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

            // Sidebar Active Link Highlight
            document.addEventListener('DOMContentLoaded', () => {
              const currentPath = window.location.pathname;
              const links = document.querySelectorAll('.sidebar-link');
              links.forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                  link.classList.add('bg-[#333A48]', 'text-white');
                  link.classList.remove('text-bodydark1');
                }
              });
            });
            `}
          </script>
        </div>

        {/* Sidebar */}
        <div class="drawer-side z-40">
          <label for="dashboard-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
          <div class="flex min-h-full flex-col justify-between bg-secondary w-64 duration-300 ease-linear">
             
             {/* Sidebar Header */}
             <div class="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 h-16 shrink-0 border-b border-boxdark">
               <a href="/dashboard" class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-lg">S</div>
                  <span class="text-xl font-bold text-white tracking-tight">SACCO<span class="text-primary">Admin</span></span>
               </a>
             </div>

             {/* Menu Groups */}
             <div class="flex flex-col overflow-y-auto duration-300 ease-linear flex-grow px-4 py-4 mt-2">
               <nav class="space-y-6">
                 {menuSections.map((section, idx) => (
                   <div key={idx}>
                     <h3 class="mb-4 ml-4 text-xs font-bold text-bodydark2 uppercase tracking-widest">
                       {section.label}
                     </h3>
                     <ul class="flex flex-col gap-1.5">
                       {section.items.map((item, i) => (
                         <li key={i}>
                           <a
                             href={item.href}
                             class="sidebar-link group relative flex items-center gap-2.5 rounded-sm py-2 px-4 text-sm font-medium text-bodydark1 duration-300 ease-in-out hover:bg-[#333A48] hover:text-white"
                           >
                             <Icon icon={item.icon} size={18} />
                             {item.label}
                           </a>
                         </li>
                       ))}
                     </ul>
                   </div>
                 ))}
               </nav>
             </div>
             
             {/* Sidebar Footer */}
             <div class="p-4 border-t border-boxdark">
                <div class="rounded-sm bg-boxdark p-4">
                   <h4 class="font-bold text-white mb-1 text-xs">Need Help?</h4>
                   <p class="text-[10px] text-bodydark2 mb-3">Check our docs or contact support.</p>
                   <a href="#" class="btn btn-primary btn-xs w-full text-white font-bold h-8 min-h-0 rounded-sm">Docs</a>
                </div>
             </div>

          </div>
        </div>
      </div>

      {/* Generic Modal */}
      <dialog id="htmx-modal" class="modal">
        <div id="htmx-modal-content" class="modal-box p-0 rounded-sm bg-white shadow-default max-w-2xl border-none">
          {/* Content */}
        </div>
        <form method="dialog" class="modal-backdrop bg-black/50 backdrop-blur-sm">
          <button>close</button>
        </form>
      </dialog>
    </MainLayout>
  );
}

