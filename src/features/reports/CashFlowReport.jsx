import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { ArrowLeft, Printer, TrendingUp, TrendingDown, DollarSign, Download } from 'lucide';

export default function CashFlowReport({ transactions, stats, categories }) {
  return (
    <DashboardLayout title="Cash Flow Statement">
      <div class="flex flex-col gap-8 max-w-screen-2xl mx-auto">
        
        {/* Header - Web Only */}
        <div class="no-print">
            <PageHeader 
            title="Cash Flow Statement"
            subtitle="Summary of all system-wide inflows and outflows."
            backHref="/dashboard/reports"
            breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Reports', href: '/dashboard/reports' },
                { label: 'Cash Flow', href: '/dashboard/reports/cash-flow', active: true }
            ]}
            actions={(
                <button class="inline-flex items-center justify-center gap-2.5 rounded-sm border border-stroke bg-white py-2 px-6 text-center font-bold text-black hover:border-primary hover:text-primary transition-all uppercase tracking-widest text-xs" onClick="window.print()">
                    <Icon icon={Printer} size={16} /> Print
                </button>
            )}
            />
        </div>

        {/* Print Header */}
        <div class="hidden print:block text-center mb-8 border-b-2 border-black pb-6">
           <h1 class="text-3xl font-black uppercase tracking-tighter">Financial Statement: Cash Flow</h1>
           <p class="text-xs font-bold text-body mt-2 tracking-widest uppercase">Report Date: {new Date().toLocaleDateString()}</p>
        </div>

        {/* High Contrast Stats */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Income</span>
                <div class="h-8 w-8 rounded-full bg-success/10 text-success flex items-center justify-center">
                    <Icon icon={TrendingUp} size={16} />
                </div>
              </div>
              <h3 class="text-2xl font-black text-black font-mono">{(stats.totalIncome || 0).toLocaleString()} <span class="text-xs">UGX</span></h3>
              <p class="text-[10px] text-body mt-2 font-bold uppercase tracking-tighter">Deposits, Repayments, Shares</p>
           </div>

           <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Expenses</span>
                <div class="h-8 w-8 rounded-full bg-error/10 text-error flex items-center justify-center">
                    <Icon icon={TrendingDown} size={16} />
                </div>
              </div>
              <h3 class="text-2xl font-black text-black font-mono">{(stats.totalExpense || 0).toLocaleString()} <span class="text-xs">UGX</span></h3>
              <p class="text-[10px] text-body mt-2 font-bold uppercase tracking-tighter">Withdrawals, Disbursements</p>
           </div>

           <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Net Cash Position</span>
                <div class={`h-8 w-8 rounded-full ${stats.netCashFlow >= 0 ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'} flex items-center justify-center`}>
                    <Icon icon={DollarSign} size={16} />
                </div>
              </div>
              <h3 class={`text-2xl font-black font-mono ${stats.netCashFlow >= 0 ? 'text-primary' : 'text-warning'}`}>
                {(stats.netCashFlow || 0).toLocaleString()} <span class="text-xs">UGX</span>
              </h3>
              <p class="text-[10px] text-body mt-2 font-bold uppercase tracking-tighter">Net liquidity change</p>
           </div>
        </div>

        {/* Breakdown Table */}
        <div class="rounded-sm border border-stroke bg-white shadow-default overflow-hidden">
            <div class="bg-gray-2/50 py-4 px-6 border-b border-stroke">
                <h4 class="font-black text-black text-xs uppercase tracking-widest">Category-wise Breakdown</h4>
            </div>
            <div class="max-w-full overflow-x-auto">
                <table class="w-full table-auto">
                    <thead>
                        <tr class="bg-slate-50 text-left border-b border-stroke">
                            <th class="py-4 px-6 font-black text-black uppercase text-[10px] tracking-widest">Revenue/Cost Center</th>
                            <th class="py-4 px-6 text-center font-black text-black uppercase text-[10px] tracking-widest">Flow Type</th>
                            <th class="py-4 px-6 text-right font-black text-black uppercase text-[10px] tracking-widest">Aggregated Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat, idx) => (
                        <tr key={idx} class="border-b border-stroke hover:bg-whiten transition-colors group">
                            <td class="py-5 px-6">
                                <div class="font-black text-black text-sm">{cat.name}</div>
                                <div class="text-[10px] font-bold text-body uppercase tracking-tighter mt-0.5">{cat.count} individual entries</div>
                            </td>
                            <td class="py-5 px-6 text-center">
                                <Badge type={cat.type === 'income' ? 'success' : 'error'} size="xs">
                                    {cat.type.toUpperCase()}
                                </Badge>
                            </td>
                            <td class={`py-5 px-6 text-right font-mono font-black text-sm ${cat.type === 'income' ? 'text-success' : 'text-error'}`}>
                                {cat.type === 'expense' ? '-' : '+'}{cat.amount.toLocaleString()} <span class="text-[10px] text-body opacity-50">UGX</span>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Footer */}
        <div class="hidden print:block mt-20 text-center border-t border-stroke pt-6">
           <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Internal Audit Report • CONFIDENTIAL</p>
        </div>

      </div>
    </DashboardLayout>
  );
}