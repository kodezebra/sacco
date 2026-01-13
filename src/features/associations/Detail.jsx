import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import ApexChart from '../../components/ApexChart.jsx';
import Badge from '../../components/Badge.jsx';
import TableAction from '../../components/TableAction.jsx';
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
    },
    colors: ['#10B981', '#F43F5E'], 
    plotOptions: { 
      bar: { 
        horizontal: false, 
        columnWidth: '45%', 
        borderRadius: 4,
      } 
    },
    xaxis: { 
      categories: trendData.map(d => d.month),
    },
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
                  <Badge type="ghost">{association.type}</Badge>
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
                  Export
                </button>
            </div>
          </div>

                      {/* Stats Overview */}
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default">
                          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 text-primary">
                            <Icon icon={Banknote} size={24} />
                          </div>
                          <div class="mt-4 flex items-end justify-between">
                            <div>
                              <h4 class="text-title-md font-bold text-black">UGX {stats.thisMonthIncome?.toLocaleString() ?? 0}</h4>
                              <span class="text-sm font-medium text-slate-500">Total Income</span>
                            </div>
                          </div>
                        </div>
          
                        <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default">
                          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 text-success">
                            <Icon icon={TrendingUp} size={24} />
                          </div>
                          <div class="mt-4 flex items-end justify-between">
                            <div>
                              <h4 class="text-title-md font-bold text-black">UGX {stats.thisMonthNet?.toLocaleString() ?? 0}</h4>
                              <span class="text-sm font-medium text-slate-500">Net Profit</span>
                            </div>
                            <span class={`flex items-center gap-1 text-sm font-medium ${profitRate >= 0 ? 'text-success' : 'text-error'}`}>
                              {profitRate}% 
                              <Icon icon={profitRate >= 0 ? TrendingUp : TrendingDown} size={16} />
                            </span>
                          </div>
                        </div>
          
                        <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default">
                          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 text-warning">
                            <Icon icon={Users} size={24} />
                          </div>
                          <div class="mt-4 flex items-end justify-between">
                            <div>
                              <h4 class="text-title-md font-bold text-black">{association.membersCount ?? 0}</h4>
                              <span class="text-sm font-medium text-slate-500">Active Members</span>
                            </div>
                          </div>
                        </div>
                      </div>
          
                      <div class="grid grid-cols-12 gap-8">
                        <div class="col-span-12 xl:col-span-8 rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
                          <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
                            <div class="flex w-full flex-wrap gap-3 sm:gap-5">
                              <h4 class="text-xl font-bold text-black">Financial Overview</h4>
                            </div>
                          </div>
                          <div>
                            <div id="chartOne" class="-ml-5">
                              <ApexChart id="association-chart" options={chartOptions} height={350} />
                            </div>
                          </div>
                        </div>
          
                        <div class="col-span-12 xl:col-span-4 rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default">
                          <h4 class="mb-6 text-xl font-bold text-black">Staff Members</h4>
                          <div class="flex flex-col gap-6">
                            {staff.length === 0 ? <p class="text-sm text-slate-500">No staff assigned.</p> : staff.map((s) => (
                              <div key={s.id} class="flex items-center gap-5">
                                <div class="relative flex h-14 w-14 items-center justify-center rounded-full bg-meta-2 text-xl font-bold text-slate-500">
                                  {(s.fullName || '?').charAt(0)}
                                </div>
                                <div class="flex flex-1 items-center justify-between">
                                  <div>
                                    <h5 class="font-medium text-black">{s.fullName || 'Unknown Staff'}</h5>
                                    <p>
                                      <span class="text-sm text-slate-500">{s.role}</span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
          
                      <div class="rounded-sm border border-stroke bg-white shadow-default">
                        <div class="flex flex-col">
                          <div class="py-6 px-4 md:px-6 xl:px-7.5 border-b border-stroke flex items-center justify-between">
                            <h3 class="font-bold text-black">Transaction Ledger</h3>
                            <div class="flex gap-2">                  <TableAction 
                    label="Income"
                    icon={TrendingUp}
                    hx-get={`/dashboard/transactions/new?associationId=${association.id}&type=income`}
                    hx-target="#htmx-modal-content"
                    hx-swap="innerHTML"
                    onClick={() => document.getElementById('htmx-modal').showModal()}
                  />
                  <TableAction 
                    label="Expense"
                    icon={TrendingDown}
                    hx-get={`/dashboard/transactions/new?associationId=${association.id}&type=expense`}
                    hx-target="#htmx-modal-content"
                    hx-swap="innerHTML"
                    onClick={() => document.getElementById('htmx-modal').showModal()}
                  />
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
                  <table class="table w-full">
                    <thead class="bg-slate-50">
                      <tr>
                        <th class="py-4 px-4 text-sm font-bold text-black uppercase">Date</th>
                        <th class="py-4 px-4 text-sm font-bold text-black uppercase">Category & Details</th>
                        <th class="py-4 px-4 text-right text-sm font-bold text-black uppercase">Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr><td colspan="3" class="text-center py-16 text-slate-400 italic">No transactions recorded yet for this unit.</td></tr>
                      ) : transactions.map(t => (
                        <tr key={t.id} class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td class="py-4 px-4 text-xs font-mono text-black opacity-60">{t.date}</td>
                          <td class="py-4 px-4">
                            <div class="flex flex-col">
                              <span class="font-bold text-black text-sm">{t.category}</span>
                              <span class="text-xs text-black opacity-50 mt-0.5">{t.description}</span>
                            </div>
                          </td>
                          <td class={`py-4 px-4 text-right font-bold text-sm ${t.type === 'income' ? 'text-success' : 'text-error'}`}>
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
    </DashboardLayout>
  );
}