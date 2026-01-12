import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import ApexChart from '../../components/ApexChart.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import ActionCenter from '../../components/ActionCenter.jsx';
import Timeline from '../../components/Timeline.jsx';
import { 
  Users, Banknote, PieChart, TrendingUp, 
  ArrowUpRight, History, LayoutDashboard, Wallet, 
  Briefcase, ArrowUp, ArrowDown, ShieldCheck
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
    colors: ['#3B82F6', '#F59E0B'],
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
          
          {/* Welcome Header & Action Center */}
          <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div>
               <h1 class="text-3xl font-black tracking-tight text-slate-900 leading-tight">
                 {sacco?.name || 'Dashboard'}
               </h1>
               <div class="flex items-center gap-2 mt-1">
                  <div class="badge badge-primary badge-sm gap-1 font-bold h-6 pr-3">
                     <Icon icon={ShieldCheck} size={12} />
                     {currentUser?.role.replace('_', ' ').toUpperCase()}
                  </div>
                  <p class="text-slate-400 text-sm font-medium">System operational and secure.</p>
               </div>
            </div>
            <ActionCenter />
          </div>

          {/* KPI Stats Grid */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              label="Total Members" 
              value={stats?.totalMembers || 0} 
              subtitle="Verified accounts" 
              icon={Users} 
              colorClass="text-primary" 
            />
            <StatsCard 
              label="Loan Portfolio" 
              value={formatCompact(stats?.loanPortfolio)} 
              subtitle="Outstanding principal" 
              icon={Banknote} 
              colorClass="text-secondary" 
            />
            <StatsCard 
              label="Total Assets" 
              value={formatCompact(stats?.totalAssets)} 
              subtitle="Savings + Shares" 
              icon={Wallet} 
              colorClass="text-accent" 
            />
            <StatsCard 
              label="Cash Position" 
              value={formatCompact(stats?.cashOnHand)} 
              subtitle="Liquid capital" 
              icon={TrendingUp} 
              colorClass="text-info" 
            />
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
              <div class="card-body p-8 flex flex-col">
                <h3 class="font-bold text-slate-900 flex items-center gap-2 mb-6">
                  <Icon icon={PieChart} size={18} class="text-slate-400" />
                  Asset Liquidity
                </h3>
                <div class="flex-grow flex items-center justify-center">
                   <ApexChart id="liquidity-chart" options={liquidityOptions} height={280} />
                </div>
                <div class="mt-6 pt-6 border-t border-slate-50 space-y-3">
                   <div class="flex justify-between text-xs font-medium">
                      <span class="text-slate-400 font-bold uppercase tracking-tighter">Loans / Assets Ratio</span>
                      <span class="text-slate-900 font-black">{Math.round((stats.loanPortfolio / stats.totalAssets) * 100)}%</span>
                   </div>
                   <progress class="progress progress-warning w-full h-2 rounded-full" value={stats.loanPortfolio} max={stats.totalAssets}></progress>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Grid */}
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { label: "Members", sub: "Directory & KYC", icon: Users, color: "bg-primary", href: "/dashboard/members" },
               { label: "Payroll", sub: "Run monthly wages", icon: Briefcase, color: "bg-secondary", href: "/dashboard/payroll" },
               { label: "Reports", sub: "P&L Statements", icon: TrendingUp, color: "bg-accent", href: "/dashboard/reports" },
               { label: "Business Units", sub: "Profit Centers", icon: LayoutDashboard, color: "bg-info", href: "/dashboard/associations" }
             ].map((link, i) => (
               <a key={i} href={link.href} class="group p-5 bg-base-100 border border-base-200 rounded-2xl hover:border-primary transition-all shadow-sm">
                  <div class={`w-10 h-10 rounded-xl ${link.color}/10 ${link.color.replace('bg-', 'text-')} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                     <Icon icon={link.icon} size={20} />
                  </div>
                  <p class="text-xs font-bold text-slate-900">{link.label}</p>
                  <p class="text-[10px] text-slate-400 font-medium">{link.sub}</p>
               </a>
             ))}
          </div>

          {/* Bottom Row: Recent Activity */}
          <div class="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
            <div class="card-body p-0">
               <div class="p-6 border-b border-base-200 flex justify-between items-center bg-slate-50/30">
                  <h3 class="font-bold text-slate-900 flex items-center gap-2 text-lg">
                    <Icon icon={History} size={20} class="text-slate-400" />
                    Global Recent Activity
                  </h3>
                  <a href="/dashboard/transactions" class="btn btn-xs btn-ghost text-primary font-bold px-4">See All Ledger</a>
               </div>
               <Timeline items={recentActivity} />
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
