import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { 
  Users, Banknote, PieChart, TrendingUp, 
  ArrowUpRight, ArrowDownLeft, Plus, ArrowRightLeft 
} from 'lucide';

const formatCompact = (val) => {
  if (!val) return '0';
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
  return val.toLocaleString();
};

export default function DashboardHome({ stats, recentActivity = [] }) {
  return (
    <DashboardLayout title="Overview">
      <div class="flex flex-col gap-8">
        <div>
           <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
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

        {/* Recent Activity */}
        <div class="card bg-base-100 border border-base-200 shadow-sm">
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
                     <th>Date</th>
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
                       <td>{t.description}</td>
                       <td class="text-xs opacity-60 font-mono">{t.date}</td>
                       <td class={`text-right font-medium ${t.type === 'income' ? 'text-success' : 'text-error'}`}>
                         {t.type === 'expense' ? '-' : '+'}{(t.amount || 0).toLocaleString()}
                       </td>
                     </tr>
                   )) : (
                     <tr><td colspan="4" class="text-center py-8 text-slate-400">No recent activity</td></tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
