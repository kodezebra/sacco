import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import ApexChart from '../../components/ApexChart.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import Badge from '../../components/Badge.jsx';
import TableAction from '../../components/TableAction.jsx';
import { 
  ArrowLeft, Users, Banknote, 
  TrendingUp, TrendingDown, Receipt
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
      toolbar: { show: false }
    },
    colors: ['#3C50E0', '#80CAEE'], 
    plotOptions: { 
      bar: { 
        horizontal: false, 
        columnWidth: '55%', 
        borderRadius: 2,
      } 
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: { 
      categories: trendData.map(d => d.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    fill: { opacity: 1 },
    grid: {
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
  };

  return (
    <DashboardLayout title={association.name}>
      <div class="flex flex-col gap-6">
        {/* Header Navigation */}
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <a href="/dashboard/associations" class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:bg-opacity-90 shadow-default">
                <Icon icon={ArrowLeft} size={20} />
            </a>
            <div>
              <div class="flex items-center gap-3">
                <h2 class="text-title-md font-bold text-black">{association.name}</h2>
                <Badge type="ghost">{association.type}</Badge>
              </div>
              <p class="text-body text-sm">Business Unit Performance & Operations</p>
            </div>
          </div>
          <div class="flex gap-2">
             <button 
                class="inline-flex items-center justify-center gap-2.5 rounded-sm border border-stroke bg-white py-2 px-6 text-center font-medium text-black hover:border-primary hover:text-primary lg:px-4 shadow-default"
                onClick="window.print()"
              >
                <Icon icon={Receipt} size={16} />
                Export
              </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <StatsCard 
            label="Total Income" 
            value={"UGX " + (stats.thisMonthIncome?.toLocaleString() ?? 0)} 
            icon={Banknote} 
            colorClass="text-primary" 
          />
          <StatsCard 
            label="Net Profit" 
            value={"UGX " + (stats.thisMonthNet?.toLocaleString() ?? 0)} 
            icon={TrendingUp} 
            colorClass="text-success"
            trend={profitRate}
          />
          <StatsCard 
            label="Unit Members" 
            value={association.membersCount ?? 0} 
            icon={Users} 
            colorClass="text-warning" 
          />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Chart Section */}
          <div class="lg:col-span-8 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default sm:px-7.5">
            <div class="mb-3 justify-between gap-4 sm:flex">
              <div>
                <h4 class="text-xl font-bold text-black">Financial Performance</h4>
              </div>
            </div>
            <div class="mb-2">
              <div id="chartUnit" class="-ml-5">
                <ApexChart id="association-chart" options={chartOptions} height={350} />
              </div>
            </div>
          </div>

          {/* Staff Section */}
          <div class="lg:col-span-4 rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default">
            <h4 class="mb-6 text-xl font-bold text-black">Staff Assigned</h4>
            <div class="flex flex-col gap-5">
              {staff.length === 0 ? (
                <p class="text-sm text-body italic">No staff assigned to this unit.</p>
              ) : staff.map((s) => (
                <div key={s.id} class="flex items-center gap-4">
                  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-whiten text-xl font-bold text-body">
                    {(s.fullName || '?').charAt(0)}
                  </div>
                  <div>
                    <h5 class="font-medium text-black text-sm">{s.fullName}</h5>
                    <p class="text-xs text-body">{s.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div class="rounded-sm border border-stroke bg-white shadow-default">
          <div class="py-6 px-4 md:px-6 xl:px-7.5 border-b border-stroke flex items-center justify-between">
            <h3 class="font-bold text-black">Transaction Ledger</h3>
            <div class="flex gap-3">
              <TableAction 
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
            <div class="max-w-full overflow-x-auto" id="transaction-ledger-table">
              <table class="w-full table-auto">
                <thead>
                  <tr class="bg-gray-2 text-left">
                    <th class="min-w-[120px] py-4 px-4 font-bold text-black text-sm uppercase">Date</th>
                    <th class="min-w-[200px] py-4 px-4 font-bold text-black text-sm uppercase">Details</th>
                    <th class="py-4 px-4 text-right font-bold text-black text-sm uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr><td colspan="3" class="text-center py-10 text-body italic">No transactions recorded yet.</td></tr>
                  ) : transactions.map(t => (
                    <tr key={t.id} class="border-b border-stroke hover:bg-whiten transition-colors">
                      <td class="py-5 px-4 text-sm text-black">{t.date}</td>
                      <td class="py-5 px-4">
                        <div class="flex flex-col">
                          <span class="font-medium text-black text-sm">{t.category}</span>
                          <span class="text-xs text-body mt-0.5">{t.description}</span>
                        </div>
                      </td>
                      <td class={`py-5 px-4 text-right font-bold text-sm ${t.type === 'income' ? 'text-success' : 'text-error'}`}>
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
    </DashboardLayout>
  );
}