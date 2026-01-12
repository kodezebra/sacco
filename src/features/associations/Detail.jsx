import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import ApexChart from '../../components/ApexChart.jsx';
import { 
  ArrowLeft, Users, Banknote, History, 
  TrendingUp, TrendingDown, Receipt, BarChart3,
  ArrowUpRight
} from 'lucide';

export default function AssociationDetail({ association, transactions = [], staff = [], stats, trendData = [] }) {
  
  const profitRate = stats.thisMonthIncome > 0 
    ? Math.round((stats.thisMonthNet / stats.thisMonthIncome) * 100) 
    : 0;

  const chartOptions = {
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

  return (
    <DashboardLayout title={association.name}>
      <div class="max-w-full overflow-x-hidden">
        <div class="flex flex-col gap-8 pb-12">
          {/* Header Navigation */}
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <a href="/dashboard/associations" class="btn btn-ghost btn-sm p-0 hover:bg-transparent">
                <Icon icon={ArrowLeft} size={20} />
              </a>
              <div>
                <div class="flex items-center gap-3">
                  <h1 class="text-3xl font-bold tracking-tight text-slate-900">{association.name}</h1>
                  <span class="badge badge-outline badge-sm uppercase font-bold tracking-tighter opacity-50">{association.type}</span>
                </div>
                <p class="text-slate-500 text-sm">Business Unit Performance & Operations</p>
              </div>
            </div>
            <div class="flex gap-2">
               <button 
                  class="btn btn-sm btn-outline gap-2"
                  onClick="window.print()"
                >
                  <Icon icon={Receipt} size={16} />
                  Export Report
                </button>
            </div>
          </div>

          {/* Main Dashboard Row */}
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* FEATURED: Monthly Performance */}
            <div class="lg:col-span-2">
              <div class="card bg-base-100 border border-base-200 shadow-sm overflow-hidden h-full">
                <div class="card-body p-6 md:p-8">
                  <div class="flex justify-between items-start border-b border-slate-100 pb-6 mb-6">
                    <dl>
                      <dt class="text-sm font-medium text-slate-500 mb-1">Profit (This Month)</dt>
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
                        <Icon icon={profitRate >= 0 ? TrendingUp : TrendingDown} size={14} />
                        Margin {profitRate}%
                      </span>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-8 mb-8">
                    <dl>
                      <dt class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Income</dt>
                      <dd class="text-xl font-bold text-success">
                        <span class="mr-1">+</span>
                        {stats.thisMonthIncome.toLocaleString()}
                      </dd>
                    </dl>
                    <dl>
                      <dt class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Expense</dt>
                      <dd class="text-xl font-bold text-error">
                        <span class="mr-1">-</span>
                        {stats.thisMonthExpense.toLocaleString()}
                      </dd>
                    </dl>
                  </div>

                  {/* Integrated Chart Component */}
                  <div class="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                    <ApexChart 
                      id="financial-trend-chart" 
                      options={chartOptions} 
                      height={250} 
                    />
                  </div>
                  
                  <div class="flex justify-between items-center mt-6 pt-6 border-t border-slate-100">
                     <div class="flex gap-4">
                        <div class="flex items-center gap-2 text-xs font-medium text-slate-500">
                           <div class="w-2 h-2 rounded-full bg-success"></div> Income
                        </div>
                        <div class="flex items-center gap-2 text-xs font-medium text-slate-500">
                           <div class="w-2 h-2 rounded-full bg-error"></div> Expense
                        </div>
                     </div>
                     <a href="/dashboard/reports/cash-flow" class="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                        View Detailed Cash Flow
                        <Icon icon={ArrowUpRight} size={14} />
                     </a>
                  </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR STATS & STAFF */}
            <div class="flex flex-col gap-6">
              
              {/* Cumulative Card */}
              <div class="card bg-primary text-primary-content shadow-lg shadow-primary/20">
                <div class="card-body p-6">
                  <div class="flex justify-between items-start">
                    <p class="text-xs font-bold uppercase tracking-widest opacity-70">Cumulative Position</p>
                    <Icon icon={Banknote} size={20} class="opacity-50" />
                  </div>
                  <h2 class="text-3xl font-black mt-2">{stats.netPosition.toLocaleString()}</h2>
                  <p class="text-[10px] mt-1 opacity-60">Total project value since inception</p>
                </div>
              </div>

              {/* Staff List Card */}
              <div class="card bg-base-100 border border-base-200 shadow-sm">
                <div class="card-body p-0">
                  <div class="p-6 border-b border-base-200 flex justify-between items-center">
                    <h3 class="font-bold text-slate-900 flex items-center gap-2">
                      <Icon icon={Users} size={18} class="text-slate-400" />
                      Assigned Staff
                    </h3>
                    <div class="badge badge-neutral badge-sm font-bold">{staff.length}</div>
                  </div>
                  <div class="divide-y divide-slate-50">
                    {staff.length === 0 ? (
                      <div class="p-8 text-center text-slate-400 text-xs">No staff assigned.</div>
                    ) : staff.map(s => (
                      <div key={s.id} class="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center group">
                        <div>
                          <div class="text-sm font-bold text-slate-700">{s.fullName}</div>
                          <div class="text-[10px] opacity-50 uppercase tracking-widest font-medium">{s.role}</div>
                        </div>
                        <div class="text-xs font-mono font-bold text-slate-400 group-hover:text-primary transition-colors">
                          {s.salary?.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div class="p-4 bg-slate-50/50 border-t border-base-200">
                    <a href="/dashboard/staff" class="btn btn-xs btn-block btn-ghost text-slate-400">View Directory</a>
                  </div>
                </div>
              </div>

              {/* Transactions Count Card */}
              <div class="card bg-base-100 border border-base-200 shadow-sm">
                <div class="card-body p-6 flex flex-row items-center gap-4">
                   <div class="w-12 h-12 rounded-2xl bg-info/10 text-info flex items-center justify-center">
                      <Icon icon={History} size={24} />
                   </div>
                   <div>
                      <p class="text-xs font-bold text-slate-400 uppercase tracking-tighter">Ledger Health</p>
                      <p class="text-xl font-black text-slate-900">{stats.totalTransactions} Entries</p>
                   </div>
                </div>
              </div>

            </div>
          </div>

          {/* SECONDARY ROW: LEDGER */}
          <div class="grid grid-cols-1 gap-6">
            <div class="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
              <div class="card-body p-0">
                <div class="p-6 border-b border-base-200 flex justify-between items-center bg-slate-50/30">
                  <div class="flex items-center gap-3">
                    <h3 class="font-bold text-slate-900 flex items-center gap-2 text-lg">
                      <Icon icon={History} size={20} class="text-slate-400" />
                      Ledger History
                    </h3>
                  </div>
                  <div class="flex gap-2">
                    <button 
                      class="btn btn-sm btn-success text-white gap-2 shadow-sm shadow-success/20"
                      hx-get={`/dashboard/transactions/new?associationId=${association.id}&type=income`}
                      hx-target="#htmx-modal-content"
                      hx-swap="innerHTML"
                      onClick="document.getElementById('htmx-modal').showModal()"
                    >
                      <Icon icon={TrendingUp} size={16} />
                      <span class="hidden sm:inline">Add Income</span>
                    </button>
                    <button 
                      class="btn btn-sm btn-error text-white gap-2 shadow-sm shadow-error/20"
                      hx-get={`/dashboard/transactions/new?associationId=${association.id}&type=expense`}
                      hx-target="#htmx-modal-content"
                      hx-swap="innerHTML"
                      onClick="document.getElementById('htmx-modal').showModal()"
                    >
                      <Icon icon={TrendingDown} size={16} />
                      <span class="hidden sm:inline">Add Expense</span>
                    </button>
                  </div>
                </div>
                
                <div 
                  id="transaction-ledger-container"
                  hx-get={`/dashboard/associations/${association.id}`}
                  hx-select="#transaction-ledger-table"
                  hx-target="#transaction-ledger-table"
                  hx-swap="outerHTML"
                  hx-trigger="refreshTransactions from:body"
                >
                  <div class="overflow-x-auto w-full" id="transaction-ledger-table">
                    <table class="table w-full table-zebra">
                      <thead class="bg-slate-50/50">
                        <tr class="text-slate-400 uppercase text-[10px] tracking-widest">
                          <th class="py-4">Date</th>
                          <th>Category & Details</th>
                          <th class="text-right">Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.length === 0 ? (
                          <tr><td colspan="3" class="text-center py-16 text-slate-400 italic">No transactions recorded yet for this unit.</td></tr>
                        ) : transactions.map(t => (
                          <tr key={t.id} class="hover group">
                            <td class="text-xs font-mono text-slate-400">{t.date}</td>
                            <td>
                              <div class="flex flex-col">
                                <span class="font-bold text-slate-700 text-sm uppercase tracking-tight group-hover:text-primary transition-colors">{t.category}</span>
                                <span class="text-[11px] text-slate-400">{t.description}</span>
                              </div>
                            </td>
                            <td class={`text-right font-mono font-black ${t.type === 'income' ? 'text-success' : 'text-error'}`}>
                              {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}