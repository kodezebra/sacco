import { 
  Users, Banknote, ArrowRightLeft, PieChart, Wallet,
  Settings, PanelLeft, LayoutDashboard, FileText, Layers, Briefcase
} from 'lucide';
import Icon from '../components/Icon.jsx';
import MainLayout from './MainLayout.jsx';

export default function DashboardLayout({ title, children }) {
  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Members", href: "/dashboard/members", icon: Users },
    { label: "Business Units", href: "/dashboard/associations", icon: Layers },
    { label: "Staff / HR", href: "/dashboard/staff", icon: Briefcase },
    { label: "Payroll", href: "/dashboard/payroll", icon: Wallet },
    { label: "Loans", href: "/dashboard/loans", icon: Banknote },
    { label: "Shares", href: "/dashboard/shares", icon: PieChart },
    { label: "Savings", href: "/dashboard/savings", icon: Wallet },
    { label: "Transactions", href: "/dashboard/transactions", icon: ArrowRightLeft },
    { label: "Reports", href: "/dashboard/reports", icon: FileText },
  ];

  return (
    <MainLayout title={title}>
      <div class="drawer md:drawer-open">
        <input id="dashboard-drawer" type="checkbox" class="drawer-toggle" />
        
        <div class="drawer-content flex flex-col min-h-screen">
          {/* Navbar */}
          <nav class="navbar w-full bg-base-100 border-b border-base-200 sticky top-0 z-10 h-16">
            <div class="flex-none">
              <label for="dashboard-drawer" aria-label="open sidebar" class="btn btn-square btn-ghost">
                <Icon icon={PanelLeft} size={20} />
              </label>
            </div>
            <div class="flex-1 px-4 text-xl font-bold truncate">
              {title}
            </div>
          </nav>
          
          {/* Page Content */}
          <main class="p-4 md:p-8">
            {children}
          </main>
          
          {/* Toast/Alert container for HTMX */}
          <div id="htmx-toast-container" class="toast toast-top toast-end"></div>
        </div>

        <div class="drawer-side z-20">
          <label for="dashboard-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
          <div class="flex min-h-full flex-col items-start bg-base-100 border-r border-base-200 text-base-content w-64 transition-transform duration-200">
            
            {/* Sidebar Header */}
            <div class="w-full p-4 flex items-center gap-3 border-b border-base-200 h-16 shrink-0">
               <div class="text-primary font-bold text-2xl tracking-tighter flex items-center gap-2">
                 <span>kzApp</span>
               </div>
            </div>

            {/* Sidebar Menu */}
            <ul class="menu w-full grow gap-1 p-2 flex-nowrap overflow-y-auto">
              {menuItems.map((item, index) => {
                if (item.isDivider) return <div key={index} class="divider my-1 px-2"></div>;
                
                return (
                  <li key={index}>
                    <a 
                      href={item.href} 
                      class="flex gap-3 items-center" 
                    >
                      <Icon icon={item.icon} size={20} class="shrink-0" />
                      <span class="whitespace-nowrap">{item.label}</span>
                    </a>
                  </li>
                );
              })}
              
              <div class="mt-auto"></div>
              <div class="divider my-1 px-2"></div>
              <li>
                <a href="/dashboard/sacco" class="flex gap-3">
                  <Icon icon={Settings} size={20} class="shrink-0" />
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Generic Modal for HTMX content */}
      <dialog id="htmx-modal" class="modal">
        <div id="htmx-modal-content" class="modal-box">
          {/* Content will be loaded here by HTMX */}
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </MainLayout>
  );
}