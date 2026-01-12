import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { 
  Users, Banknote, PieChart, TrendingUp, 
  ArrowUpRight, ArrowDownLeft, Plus, ArrowRightLeft, HelpCircle, Mail, Phone
} from 'lucide';

const formatCompact = (val) => {
  if (!val) return '0';
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
  return val.toLocaleString();
};

export default function DashboardHome({ stats, recentActivity = [], sacco }) {
  return (
    <DashboardLayout title="Overview">
      <div class="flex flex-col gap-8">
        <div>
           <h1 class="text-3xl font-bold tracking-tight">{sacco?.name || 'Dashboard'}</h1>
           <p class="text-slate-500">Welcome back, Administrator.</p>
        </div>

        {/* Stats Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="stats shadow border border-base-200">
            <div class="stat">
              <div class="stat-figure text-primary">
                <Icon icon={Users} size={32} />
              </div>
              <div class="stat-title">Total Members</div>
              <div class="stat-value text-primary">{stats?.totalMembers || 0}</div>
              <div class="stat-desc">Active accounts</div>
            </div>
          </div>
          
          <div class="stats shadow border border-base-200">
            <div class="stat">
              <div class="stat-figure text-secondary">
                <Icon icon={Banknote} size={32} />
              </div>
              <div class="stat-title font-semibold">Loans (UGX)</div>
              <div class="stat-value text-secondary text-2xl" title={stats?.loanPortfolio?.toLocaleString()}>{formatCompact(stats?.loanPortfolio)}</div>
              <div class="stat-desc">Active principal</div>
            </div>
          </div>
          
          <div class="stats shadow border border-base-200">
             <div class="stat">
              <div class="stat-figure text-accent">
                <Icon icon={PieChart} size={32} />
              </div>
              <div class="stat-title font-semibold">Assets (UGX)</div>
              <div class="stat-value text-accent text-2xl" title={stats?.totalAssets?.toLocaleString()}>{formatCompact(stats?.totalAssets)}</div>
              <div class="stat-desc">Shares + Savings</div>
            </div>
          </div>

          <div class="stats shadow border border-base-200">
             <div class="stat">
              <div class="stat-figure text-info">
                <Icon icon={TrendingUp} size={32} />
              </div>
              <div class="stat-title font-semibold">Cash (UGX)</div>
              <div class="stat-value text-info text-2xl" title={stats?.cashOnHand?.toLocaleString()}>{formatCompact(stats?.cashOnHand)}</div>
              <div class="stat-desc">Liquid capital</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            class="btn btn-lg h-auto py-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white transition-all flex flex-col gap-2"
            hx-get="/dashboard/members/new"
            hx-target="#htmx-modal-content"
            hx-swap="innerHTML"
            onClick="document.getElementById('htmx-modal').showModal()"
          >
            <Icon icon={Plus} size={24} />
            <div class="text-sm font-bold uppercase tracking-wider">New Member</div>
          </button>

          <a href="/dashboard/members" class="btn btn-lg h-auto py-6 bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary hover:text-white transition-all flex flex-col gap-2">
            <Icon icon={Users} size={24} />
            <div class="text-sm font-bold uppercase tracking-wider">Manage Members</div>
          </a>

          <a href="/dashboard/loans" class="btn btn-lg h-auto py-6 bg-accent/10 text-accent border-accent/20 hover:bg-accent hover:text-white transition-all flex flex-col gap-2">
            <Icon icon={Banknote} size={24} />
            <div class="text-sm font-bold uppercase tracking-wider">View Loans</div>
          </a>

          <a href="/dashboard/transactions" class="btn btn-lg h-auto py-6 bg-info/10 text-info border-info/20 hover:bg-info hover:text-white transition-all flex flex-col gap-2">
            <Icon icon={ArrowRightLeft} size={24} />
            <div class="text-sm font-bold uppercase tracking-wider">Accounting</div>
          </a>
        </div>

        {/* Bottom Section: Activity & Support */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div class="lg:col-span-2 card bg-base-100 border border-base-200 shadow-sm">
            <div class="card-body p-0">
               <div class="p-4 border-b border-base-200 flex justify-between items-center">
                  <h3 class="card-title text-lg">Recent Activity</h3>
                  <a href="/dashboard/transactions" class="btn btn-xs btn-ghost">View All</a>
               </div>
               
               <div class="overflow-x-auto">
                 <table class="table">
                   <thead>
                     <tr>
                       <th>Type</th>
                       <th>Description</th>
                       <th class="text-right">Amount (UGX)</th>
                     </tr>
                   </thead>
                   <tbody>
                     {recentActivity.length > 0 ? recentActivity.map(t => (
                       <tr key={t.id} class="hover">
                         <td>
                           <span class={`badge badge-sm badge-soft uppercase font-bold tracking-wider ${t.type === 'income' ? 'badge-success' : 'badge-error'}`}>
                              {t.type === 'income' ? <Icon icon={ArrowDownLeft} size={12} class="mr-1" /> : <Icon icon={ArrowUpRight} size={12} class="mr-1" />}
                              {t.category}
                           </span>
                         </td>
                         <td>
                            <div class="flex flex-col">
                              <span class="text-sm font-medium">{t.description}</span>
                              <span class="text-[10px] opacity-40 font-mono uppercase">{t.date}</span>
                            </div>
                         </td>
                         <td class={`text-right font-medium ${t.type === 'income' ? 'text-success' : 'text-error'}`}>
                           {t.type === 'expense' ? '-' : '+'}{(t.amount || 0).toLocaleString()}
                         </td>
                       </tr>
                     )) : (
                       <tr><td colspan="3" class="text-center py-8 text-slate-400">No recent activity</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>

          {/* Help & Support */}
          <div class="card bg-base-100 border border-base-200 shadow-sm">
             <div class="card-body">
                <div class="flex items-center gap-2 mb-4">
                   <div class="p-2 bg-primary/10 rounded-lg text-primary">
                      <Icon icon={HelpCircle} size={20} />
                   </div>
                   <h3 class="card-title text-lg">System Support</h3>
                </div>
                
                <p class="text-slate-500 text-sm mb-6 leading-relaxed">
                   For technical issues, system updates, or feature requests, please contact the IT department or system administrator.
                </p>

                <div class="space-y-4">
                   <div class="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl">
                      <div class="w-10 h-10 rounded-full bg-base-100 flex items-center justify-center text-primary shadow-sm border border-base-200">
                         <Icon icon={Mail} size={18} />
                      </div>
                      <div>
                         <p class="text-[10px] uppercase font-bold tracking-widest opacity-40">SACCO Email</p>
                         <p class="text-sm font-medium">{sacco?.email || 'N/A'}</p>
                      </div>
                   </div>

                   <div class="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl">
                      <div class="w-10 h-10 rounded-full bg-base-100 flex items-center justify-center text-success shadow-sm border border-base-200">
                         <Icon icon={Phone} size={18} />
                      </div>
                      <div>
                         <p class="text-[10px] uppercase font-bold tracking-widest opacity-40">Hotline</p>
                         <p class="text-sm font-medium">{sacco?.phone || 'N/A'}</p>
                      </div>
                   </div>
                </div>

                <div class="mt-8 pt-6 border-t border-base-200">
                   <div class="flex items-center justify-between text-[10px] uppercase font-bold tracking-tighter opacity-30">
                      <span>System Version</span>
                      <span>v1.2.0-stable</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
