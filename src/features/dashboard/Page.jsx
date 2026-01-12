import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import ApexChart from '../../components/ApexChart.jsx';
import { 
  Users, Banknote, PieChart, TrendingUp, 
  ArrowUpRight, ArrowDownLeft, Plus, ArrowRightLeft, History,
  LayoutDashboard, Wallet, Briefcase, TrendingDown,
  ArrowUp, ArrowDown
} from 'lucide';

const formatCompact = (val) => {
  if (!val) return '0';
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
  return val.toLocaleString();
};

export default function DashboardHome({ stats, recentActivity = [], sacco, trendData = [], currentUser }) {
  
  const profitRate = stats.thisMonthIncome > 0 
    ? Math.round((stats.thisMonthNet / stats.thisMonthIncome) * 100) 
    : 0;

  const trendChartOptions = {
    series: [
      { name: 'Income', data: trendData.map(d => d.income) },
      { name: 'Expense', data: trendData.map(d => d.expense) }
    ],
    chart: { 
      type: 'bar', 
      toolbar: { show: false },
      sparkline: { enabled: false },
      fontFamily: 'Inter, sans-serif'
    },
    grid: { show: false },
    colors: ['#10B981', '#F43F5E'], 
    plotOptions: { 
      bar: { 
        horizontal: false, 
        columnWidth: '45%', 
        borderRadius: 6,
      } 
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 3, colors: ['transparent'] },
    xaxis: { 
      categories: trendData.map(d => d.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#94a3b8', fontWeight: 600 } }
    },
    yaxis: { show: false },
    fill: { opacity: 1 },
    legend: { show: false },
    tooltip: { theme: 'light' }
  };

  const liquidityOptions = {
    series: [stats.totalAssets - stats.loanPortfolio, stats.loanPortfolio],
    chart: { type: 'donut', height: 250 },
    labels: ['Available Cash', 'Active Loans'],
    colors: ['#3B82F6', '#F59E0B'], // Blue and Amber
    dataLabels: { enabled: false },
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: { show: true, label: 'Total Capital', formatter: () => formatCompact(stats.totalAssets) }
          }
        }
      }
    }
  };

  return (
    <DashboardLayout title="System Overview">
      <div class="max-w-full overflow-x-hidden">
        <div class="flex flex-col gap-8 pb-12">
          
          {/* Welcome Header */}
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
               <h1 class="text-3xl font-black tracking-tight text-slate-900">{sacco?.name || 'Dashboard'}</h1>
               <p class="text-slate-500 text-sm font-medium italic">
                 Welcome back, <span class="text-primary not-italic font-bold capitalize">{currentUser?.role.replace('_', ' ')}</span>
               </p>
            </div>
            <div class="flex gap-2">
               <button 
                  class="btn btn-primary btn-sm gap-2 rounded-xl shadow-lg shadow-primary/20"
                  hx-get="/dashboard/transactions/new"
                  hx-target="#htmx-modal-content"
                  hx-swap="innerHTML"
                  onClick="document.getElementById('htmx-modal').showModal()"
                >
                  <Icon icon={Plus} size={16} />
                  New Entry
                </button>
            </div>
          </div>

          {/* KPI Stats Row */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="stats shadow border border-base-200">
              <div class="stat">
                <div class="stat-figure text-primary/30"><Icon icon={Users} size={24} /></div>
                <div class="stat-title text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Members</div>
                <div class="stat-value text-primary">{stats?.totalMembers || 0}</div>
                <div class="stat-desc font-medium">Verified accounts</div>
              </div>
            </div>
            <div class="stats shadow border border-base-200">
              <div class="stat">
                <div class="stat-figure text-secondary/30"><Icon icon={Banknote} size={24} /></div>
                <div class="stat-title text-[10px] font-bold uppercase tracking-widest text-slate-400">Loan Portfolio</div>
                <div class="stat-value text-secondary text-2xl" title={stats?.loanPortfolio?.toLocaleString()}>{formatCompact(stats?.loanPortfolio)}</div>
                <div class="stat-desc font-medium">Outstanding principal</div>
              </div>
            </div>
            <div class="stats shadow border border-base-200">
              <div class="stat">
                <div class="stat-figure text-accent/30"><Icon icon={Wallet} size={24} /></div>
                <div class="stat-title text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Assets</div>
                <div class="stat-value text-accent text-2xl" title={stats?.totalAssets?.toLocaleString()}>{formatCompact(stats?.totalAssets)}</div>
                <div class="stat-desc font-medium">Savings + Shares</div>
              </div>
            </div>
            <div class="stats shadow border border-base-200">
              <div class="stat">
                <div class="stat-figure text-info/30"><Icon icon={TrendingUp} size={24} /></div>
                <div class="stat-title text-[10px] font-bold uppercase tracking-widest text-slate-400">Cash Position</div>
                <div class="stat-value text-info text-2xl" title={stats?.cashOnHand?.toLocaleString()}>{formatCompact(stats?.cashOnHand)}</div>
                <div class="stat-desc font-medium">Cumulative liquid capital</div>
              </div>
            </div>
          </div>

          {/* FEATURED: Global Performance Chart */}
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
              <div class="card bg-base-100 border border-base-200 shadow-sm overflow-hidden h-full">
                <div class="card-body p-6 md:p-8">
                  <div class="flex justify-between items-start border-b border-slate-100 pb-6 mb-6">
                    <dl>
                      <dt class="text-sm font-medium text-slate-500 mb-1">Total SACCO Profit (This Month)</dt>
                      <dd class="text-4xl font-black text-slate-900 tracking-tight">
                        {stats.thisMonthNet.toLocaleString()}
                        <span class="text-lg font-medium text-slate-400 ml-2">UGX</span>
                      </dd>
                    </dl>
                    <div>
                      <span class={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                        profitRate >= 0 
                        ? 'bg-success/10 border-success/20 text-success' 
                        : 'bg-error/10 border-error/20 text-error'
                      }`}>
                        <Icon icon={profitRate >= 0 ? ArrowUp : ArrowDown} size={14} />
                        Margin {profitRate}%
                      </span>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-8 mb-8">
                    <dl>
                      <dt class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Global Income</dt>
                      <dd class="text-xl font-bold text-success">+{stats.thisMonthIncome.toLocaleString()}</dd>
                    </dl>
                    <dl>
                      <dt class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Global Expense</dt>
                      <dd class="text-xl font-bold text-error">-{stats.thisMonthExpense.toLocaleString()}</dd>
                    </dl>
                  </div>

                  <div class="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                    <ApexChart id="global-trend-chart" options={trendChartOptions} height={250} />
                  </div>
                </div>
              </div>
            </div>

            {/* Liquidity Chart Card */}
            <div class="card bg-base-100 border border-base-200 shadow-sm">
              <div class="card-body p-8">
                <h3 class="font-bold text-slate-900 flex items-center gap-2 mb-6">
                  <Icon icon={PieChart} size={18} class="text-slate-400" />
                  Asset Liquidity
                </h3>
                <div class="flex-grow flex items-center justify-center">
                   <ApexChart id="liquidity-chart" options={liquidityOptions} height={280} />
                </div>
                <div class="mt-6 space-y-3">
                   <div class="flex justify-between text-xs font-medium">
                      <span class="text-slate-400">Active Loans / Assets Ratio</span>
                      <span class="text-slate-900 font-bold">{Math.round((stats.loanPortfolio / stats.totalAssets) * 100)}%</span>
                   </div>
                   <progress class="progress progress-warning w-full h-2" value={stats.loanPortfolio} max={stats.totalAssets}></progress>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Row */}
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
             <a href="/dashboard/members" class="group p-4 bg-base-100 border border-base-200 rounded-2xl hover:border-primary transition-all shadow-sm">
                <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                   <Icon icon={Users} size={20} />
                </div>
                <p class="text-xs font-bold text-slate-900">Members</p>
                <p class="text-[10px] text-slate-400 font-medium">Directory & KYC</p>
             </a>
             <a href="/dashboard/payroll" class="group p-4 bg-base-100 border border-base-200 rounded-2xl hover:border-secondary transition-all shadow-sm">
                <div class="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                   <Icon icon={Briefcase} size={20} />
                </div>
                <p class="text-xs font-bold text-slate-900">Payroll</p>
                <p class="text-[10px] text-slate-400 font-medium">Run monthly wages</p>
             </a>
             <a href="/dashboard/reports" class="group p-4 bg-base-100 border border-base-200 rounded-2xl hover:border-accent transition-all shadow-sm">
                <div class="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                   <Icon icon={TrendingUp} size={20} />
                </div>
                <p class="text-xs font-bold text-slate-900">Reports</p>
                <p class="text-[10px] text-slate-400 font-medium">P&L & Statements</p>
             </a>
             <a href="/dashboard/associations" class="group p-4 bg-base-100 border border-base-200 rounded-2xl hover:border-info transition-all shadow-sm">
                <div class="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                   <Icon icon={LayoutDashboard} size={20} />
                </div>
                <p class="text-xs font-bold text-slate-900">Business Units</p>
                <p class="text-[10px] text-slate-400 font-medium">Profit Centers</p>
             </a>
          </div>

          {/* Bottom Row: Recent Activity */}
          <div class="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
            <div class="card-body p-0">
               <div class="p-6 border-b border-base-200 flex justify-between items-center bg-slate-50/30">
                  <h3 class="font-bold text-slate-900 flex items-center gap-2 text-lg">
                    <Icon icon={History} size={20} class="text-slate-400" />
                    Global Recent Activity
                  </h3>
                  <a href="/dashboard/transactions" class="btn btn-xs btn-ghost text-primary font-bold">See All Ledger</a>
               </div>
               
               <div class="overflow-x-auto w-full">
                 <table class="table w-full table-zebra">
                   <thead>
                     <tr class="text-slate-400 uppercase text-[10px] tracking-widest">
                       <th>Category</th>
                       <th>Details</th>
                       <th class="text-right">Impact</th>
                     </tr>
                   </thead>
                   <tbody>
                     {recentActivity.length > 0 ? recentActivity.map(t => (
                       <tr key={t.id} class="hover">
                         <td>
                           <span class={`badge badge-sm badge-outline uppercase font-black text-[9px] tracking-tighter ${t.type === 'income' ? 'badge-success text-success' : 'badge-error text-error'}`}>
                              {t.category}
                           </span>
                         </td>
                         <td>
                            <div class="flex flex-col">
                              <span class="text-sm font-bold text-slate-700">{t.description}</span>
                              <span class="text-[10px] opacity-40 font-mono uppercase">{t.date}</span>
                            </div>
                         </td>
                         <td class={`text-right font-mono font-black ${t.type === 'income' ? 'text-success' : 'text-error'}`}>
                           {t.type === 'expense' ? '-' : '+'}{(t.amount || 0).toLocaleString()}
                         </td>
                       </tr>
                     )) : (
                       <tr><td colspan="3" class="text-center py-12 text-slate-400 italic">No activity recorded yet.</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
