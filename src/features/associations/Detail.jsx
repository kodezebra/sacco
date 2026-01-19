import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import ApexChart from '../../components/ApexChart.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import Badge from '../../components/Badge.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { 
  ArrowLeft, Users, Banknote, 
  TrendingUp, TrendingDown, Receipt, ShieldCheck, Plus, Download, Trash2,
  ChevronDown
} from 'lucide';

export default function AssociationDetail({ association, transactions = [], staff = [], stats, trendData = [] }) {
  
  const profitRate = stats.thisMonthIncome > 0 
    ? Math.round((stats.thisMonthNet / stats.thisMonthIncome) * 100) 
    : 0;
  
  const expenseRatio = stats.thisMonthIncome > 0
    ? Math.round((stats.thisMonthExpense / stats.thisMonthIncome) * 100)
    : 0;

  const chartOptions = {
    series: [
      { name: 'Income', data: trendData.map(d => d.income) },
      { name: 'Expense', data: trendData.map(d => d.expense) }
    ],
    chart: { 
      type: 'area',
      height: 200,
      toolbar: { show: false },
      sparkline: { enabled: false },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#10B981', '#FB5454'], 
    stroke: { curve: 'smooth', width: 2 },
    fill: { 
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [20, 100] }
    },
    dataLabels: { enabled: false },
    xaxis: { 
      categories: trendData.map(d => d.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: { strokeDashArray: 4, yaxis: { lines: { show: true } } },
  };

  return (
    <DashboardLayout title={association.name}>
      <div class="flex flex-col gap-6">
        <PageHeader 
          title={association.name}
          subtitle={`Type: ${association.type} • Active Business Unit`}
          backHref="/dashboard/associations"
          breadcrumbs={[
            { label: 'Units', href: '/dashboard/associations' },
            { label: 'Analysis', href: `/dashboard/associations/${association.id}`, active: true }
          ]}
          actions={(
            <a 
              href={`/dashboard/associations/export-form?id=${association.id}`}
              class="inline-flex items-center justify-center gap-2.5 rounded-sm border border-stroke bg-white py-2 px-6 text-center font-bold text-black hover:border-primary hover:text-primary lg:px-4 shadow-default transition-all uppercase tracking-widest text-xs"
            >
              <Icon icon={Download} size={18} /> Export Data
            </a>
          )}
        />

        {/* 1. Stats Overview - Top Layer */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatsCard 
            label="Monthly Income" 
            value={stats.thisMonthIncome.toLocaleString()} 
            icon={Banknote} 
            colorClass="text-success" 
          />
          <StatsCard 
            label="Net Profit" 
            value={stats.thisMonthNet.toLocaleString()} 
            icon={TrendingUp} 
            colorClass={stats.thisMonthNet >= 0 ? "text-success" : "text-error"}
            trend={profitRate}
          />
          <StatsCard 
            label="Expense Ratio" 
            value={expenseRatio + "%"} 
            icon={TrendingDown} 
            colorClass="text-warning"
            subtitle="of total income"
          />
          <StatsCard 
            label="Staff Assigned" 
            value={staff.length} 
            icon={Users} 
            colorClass="text-primary" 
          />
        </div>

        {/* 2. Operational Layer (7/5 Split) */}
        <div class="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
            {/* Left: Transaction Ledger */}
            <div class="col-span-12 lg:col-span-7">
                <div class="rounded-sm border border-stroke bg-white shadow-default h-full">
                  <div class="py-4 px-6 border-b border-stroke flex items-center justify-between bg-gray-2/30">
                    <h3 class="font-bold text-black uppercase tracking-wider text-xs">Recent Activity</h3>
                    <div class="flex gap-2">
                      <a 
                        href={`/dashboard/transactions/journal?associationId=${association.id}`}
                        class="inline-flex items-center justify-center gap-1 rounded-sm bg-primary/10 py-1.5 px-3 text-[10px] font-black text-primary hover:bg-primary hover:text-white transition-all border border-primary/20 uppercase tracking-widest"
                      >
                        <Icon icon={Plus} size={12} /> Journal
                      </a>
                    </div>
                  </div>
                  
                  <div class="max-w-full overflow-x-auto">
                      <table class="w-full table-auto">
                        <thead>
                          <tr class="bg-gray-2 text-left">
                            <th class="py-3 px-4 font-bold text-black text-[10px] uppercase">Date</th>
                            <th class="py-3 px-4 font-bold text-black text-[10px] uppercase">Category</th>
                            <th class="py-3 px-4 text-right font-bold text-black text-[10px] uppercase">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.length === 0 ? (
                            <tr><td colspan="3" class="text-center py-10 text-body italic text-sm">No transactions yet.</td></tr>
                          ) : transactions.map(t => (
                            <tr key={t.id} class="border-b border-stroke hover:bg-whiten transition-colors group">
                              <td class="py-4 px-4 text-[10px] text-body font-mono">{t.date}</td>
                              <td class="py-4 px-4">
                                <div class="flex flex-col">
                                  <span class={`font-bold text-[10px] uppercase px-2 py-0.5 rounded-full w-fit ${
                                    t.category.toLowerCase().includes('sale') ? 'bg-success/10 text-success' :
                                    t.category.toLowerCase().includes('salary') ? 'bg-primary/10 text-primary' :
                                    t.category.toLowerCase().includes('fuel') || t.category.toLowerCase().includes('maint') ? 'bg-warning/10 text-warning' :
                                    'bg-slate-100 text-slate-600'
                                  }`}>{t.category}</span>
                                  <span class="text-[10px] text-body mt-1 opacity-70 group-hover:opacity-100 transition-opacity line-clamp-1">{t.description}</span>
                                </div>
                              </td>
                              <td class={`py-4 px-4 text-right font-black text-sm ${t.type === 'income' ? 'text-success' : 'text-error'}`}>
                                {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                  </div>
                </div>
            </div>

            {/* Right: Performance Chart */}
            <div class="col-span-12 lg:col-span-5 flex flex-col gap-6">
                <div class="rounded-sm border border-stroke bg-white px-5 pt-5 pb-5 shadow-default sm:px-7.5">
                    <div class="mb-4 flex items-center justify-between">
                        <h4 class="text-xs font-bold text-black uppercase tracking-widest">Financial Trend</h4>
                        <div class="flex items-center gap-2">
                            <span class="flex items-center gap-1 text-[10px] font-bold text-success">
                                <span class="block h-1.5 w-1.5 rounded-full bg-success"></span>
                                Income
                            </span>
                            <span class="flex items-center gap-1 text-[10px] font-bold text-error">
                                <span class="block h-1.5 w-1.5 rounded-full bg-error"></span>
                                Expense
                            </span>
                        </div>
                    </div>
                    <div id="chartUnit" class="-ml-5">
                        <ApexChart id="association-chart" options={chartOptions} height={200} />
                    </div>
                </div>

                <div class="rounded-sm border border-stroke bg-white p-5 shadow-default">
                    <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 items-center justify-center rounded-sm bg-success/10 text-success">
                            <Icon icon={ShieldCheck} size={20} />
                        </div>
                        <div>
                            <h5 class="font-bold text-black text-xs uppercase tracking-wider">Operational Status</h5>
                            <p class="text-[10px] font-bold text-bodydark2 uppercase tracking-widest">Unit is Currently Active</p>
                        </div>
                    </div>
                </div>

                {/* Staff Section */}
                <div class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default">
                    <h4 class="mb-6 text-xs font-black text-black uppercase tracking-widest border-b border-stroke pb-2">Assigned Staff</h4>
                    <div class="flex flex-col gap-4">
                      {staff.length === 0 ? (
                        <p class="text-xs text-body italic">No staff assigned.</p>
                      ) : staff.map((s) => (
                        <div key={s.id} class="flex items-center justify-between group">
                          <div class="flex items-center gap-3">
                            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-whiten text-[10px] font-black text-body uppercase border border-stroke">
                                {(s.fullName || '?').charAt(0)}
                            </div>
                            <div class="truncate">
                                <h5 class="font-bold text-black text-xs truncate">{s.fullName}</h5>
                                <p class="text-[9px] font-bold text-body uppercase tracking-tighter opacity-60">{s.role}</p>
                            </div>
                          </div>
                          <a href={`/dashboard/staff/${s.id}/edit`} class="opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                             <Icon icon={ArrowLeft} size={14} class="rotate-180" />
                          </a>
                        </div>
                      ))}
                    </div>
                </div>
            </div>
        </div>

        {/* 4. Bottom Layer: Settings & Profile */}
        <AssociationProfileForm id="assoc-profile-form" association={association} />
      </div>
    </DashboardLayout>
  );
}

export function AssociationProfileForm({ id, association }) {
  return (
    <form 
      id={id}
      hx-put={`/dashboard/associations/${association.id}`}
      hx-target={`#${id}`}
      hx-swap="outerHTML"
      class="rounded-sm border border-stroke bg-white shadow-default"
    >
        <div class="border-b border-stroke py-4 px-6 bg-gray-2/50">
           <h3 class="font-black text-black uppercase tracking-widest text-xs">Unit Settings & Profile</h3>
        </div>
        <div class="p-6.5 flex flex-col gap-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4.5">
            <div>
                <label class="mb-2.5 block text-black font-bold uppercase tracking-widest text-[10px]">Project/Association Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={association.name} 
                  class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-bold outline-none transition focus:border-primary active:border-primary text-black" 
                  required 
                />
            </div>

            <div>
                <label class="mb-2.5 block text-black font-bold uppercase tracking-widest text-[10px]">Unit Status</label>
                <div class="relative z-20 bg-transparent">
                  <select 
                    name="status" 
                    defaultValue={association.status}
                    class="relative z-20 w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-bold outline-none transition focus:border-primary active:border-primary text-black"
                  >
                    <option value="active">Active & Operational</option>
                    <option value="inactive">Inactive / Suspended</option>
                  </select>
                  <span class="absolute top-1/2 right-4 z-30 -translate-y-1/2 text-body">
                    <Icon icon={ChevronDown} size={20} />
                  </span>
                </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4.5">
            <div>
                <label class="mb-2.5 block text-black font-bold uppercase tracking-widest text-[10px]">Category</label>
                <div class="relative z-20 bg-transparent">
                  <select 
                    name="type" 
                    defaultValue={association.type}
                    class="relative z-20 w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-bold outline-none transition focus:border-primary active:border-primary text-black"
                  >
                    <option value="project">Business/Investment Unit</option>
                    <option value="department">Administrative Department</option>
                  </select>
                  <span class="absolute top-1/2 right-4 z-30 -translate-y-1/2 text-body">
                    <Icon icon={Receipt} size={20} />
                  </span>
                </div>
            </div>
              
            <div class="flex items-end pb-1">
                <p class="text-[10px] text-body font-bold italic uppercase tracking-tighter">Created on {association.createdAt}. Changes to category will affect future report grouping.</p>
            </div>
          </div>

          <div class="flex justify-between items-center border-t border-stroke pt-6">
            <button 
              type="button" 
              class="inline-flex items-center gap-2 rounded-sm border border-error bg-white py-2.5 px-6 text-xs font-black text-error hover:bg-error hover:text-white transition-all active:scale-95 uppercase tracking-widest shadow-sm"
              hx-delete={`/dashboard/associations/${association.id}`}
              hx-confirm={`Are you sure you want to delete "${association.name}"? This will permanently remove all transaction history associated with this unit.`}
              hx-target="body"
              hx-push-url="true"
            >
                <Icon icon={Trash2} size={16} />
                Delete Business Unit
            </button>

            <button type="submit" class="flex justify-center rounded bg-primary py-2.5 px-10 font-bold text-white hover:bg-opacity-90 shadow-default active:scale-95 transition-all uppercase tracking-widest">
                Save Changes
            </button>
          </div>
      </div>
    </form>
  );
}