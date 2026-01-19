import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import { ArrowLeft, Printer, TrendingUp, TrendingDown, Layers, Users, Calendar, Download } from 'lucide';

export default function ProjectReport({ association, stats, categories, staffCount, period = {} }) {
  const isProfitable = stats.netProfit >= 0;
  
  return (
    <DashboardLayout title={`Performance: ${association.name}`}>
      <div class="flex flex-col gap-8 max-w-screen-2xl mx-auto">
        
        {/* Header - Web Only */}
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
          <div class="flex items-center gap-4">
            <a href="/dashboard/reports" class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:bg-opacity-90 shadow-default transition-all">
                <Icon icon={ArrowLeft} size={20} />
            </a>
            <div>
              <h2 class="text-2xl font-black text-black uppercase tracking-tight">Business Unit Analysis</h2>
              <p class="text-sm text-body font-medium">Performance metrics for {association.name}.</p>
            </div>
          </div>
          <div class="flex gap-3">
            <a href={`/dashboard/associations/export-form?id=${association.id}`} class="inline-flex items-center justify-center gap-2.5 rounded-sm border border-stroke bg-white py-2 px-6 text-center font-bold text-black hover:border-primary hover:text-primary transition-all uppercase tracking-widest text-xs">
                <Icon icon={Download} size={16} /> Export Data
            </a>
            <button class="inline-flex items-center justify-center gap-2.5 rounded-sm border border-stroke bg-white py-2 px-6 text-center font-bold text-black hover:border-primary hover:text-primary transition-all uppercase tracking-widest text-xs" onClick="window.print()">
                <Icon icon={Printer} size={16} /> Print Report
            </button>
          </div>
        </div>

        {/* Print Header */}
        <div class="hidden print:block text-center mb-8 border-b-2 border-black pb-6">
           <h1 class="text-3xl font-black uppercase tracking-tighter">Business Unit Performance Report</h1>
           <p class="text-xs font-bold text-body mt-2 tracking-widest uppercase">{association.name} ({association.type})</p>
           <p class="text-[10px] font-bold text-body mt-1 uppercase tracking-[0.2em]">Generated: {new Date().toLocaleString()}</p>
        </div>

        {/* Executive Summary Stats */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Gross Income</span>
                <div class="h-8 w-8 rounded-full bg-success/10 text-success flex items-center justify-center">
                    <Icon icon={TrendingUp} size={16} />
                </div>
              </div>
              <h3 class="text-2xl font-black text-black font-mono">{stats.totalIncome.toLocaleString()} <span class="text-xs font-bold opacity-50">UGX</span></h3>
              <p class="text-[10px] text-body mt-2 font-bold uppercase tracking-tighter">{stats.txCount} Ledger Entries</p>
           </div>

           <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operating Expenses</span>
                <div class="h-8 w-8 rounded-full bg-error/10 text-error flex items-center justify-center">
                    <Icon icon={TrendingDown} size={16} />
                </div>
              </div>
              <h3 class="text-2xl font-black text-black font-mono">{stats.totalExpense.toLocaleString()} <span class="text-xs font-bold opacity-50">UGX</span></h3>
              <p class="text-[10px] text-body mt-2 font-bold uppercase tracking-tighter">Operational Outflows</p>
           </div>

           <div class={`rounded-sm border border-stroke bg-white p-6 shadow-default ${isProfitable ? 'border-l-4 border-l-success' : 'border-l-4 border-l-error'}`}>
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Net Performance</span>
                <div class={`h-8 w-8 rounded-full ${isProfitable ? 'bg-success/10 text-success' : 'bg-error/10 text-error'} flex items-center justify-center`}>
                    <Icon icon={isProfitable ? TrendingUp : TrendingDown} size={16} />
                </div>
              </div>
              <h3 class={`text-2xl font-black font-mono ${isProfitable ? 'text-success' : 'text-error'}`}>
                {isProfitable ? '+' : ''}{stats.netProfit.toLocaleString()} <span class="text-xs font-bold opacity-50">UGX</span>
              </h3>
              <p class={`text-[10px] mt-2 font-bold uppercase tracking-tighter ${isProfitable ? 'text-success' : 'text-error'}`}>
                {isProfitable ? 'Unit Surplus' : 'Unit Deficit'}
              </p>
           </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Category Breakdown */}
            <div class="lg:col-span-8 flex flex-col gap-6">
                <div class="rounded-sm border border-stroke bg-white shadow-default overflow-hidden">
                    <div class="bg-gray-2/50 py-4 px-6 border-b border-stroke flex justify-between items-center">
                        <h4 class="font-black text-black text-xs uppercase tracking-widest">Revenue & Cost Centers</h4>
                    </div>
                    <div class="max-w-full overflow-x-auto">
                        <table class="w-full table-auto">
                            <thead>
                                <tr class="bg-slate-50 text-left border-b border-stroke">
                                    <th class="py-4 px-6 font-black text-black uppercase text-[10px] tracking-widest">Classification</th>
                                    <th class="py-4 px-6 text-center font-black text-black uppercase text-[10px] tracking-widest">Flow</th>
                                    <th class="py-4 px-6 text-right font-black text-black uppercase text-[10px] tracking-widest">Amount (UGX)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat, i) => (
                                <tr key={i} class="border-b border-stroke last:border-none hover:bg-whiten transition-colors group">
                                    <td class="py-5 px-6">
                                        <div class="font-black text-black text-sm uppercase tracking-tight">{cat.name}</div>
                                        <div class="text-[10px] font-bold text-body uppercase tracking-tighter mt-0.5">{cat.count} individual entries</div>
                                    </td>
                                    <td class="py-5 px-6 text-center">
                                        <Badge type={cat.type === 'income' ? 'success' : 'error'} size="xs">
                                            {cat.type.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td class={`py-5 px-6 text-right font-mono font-black text-sm ${cat.type === 'income' ? 'text-success' : 'text-error'}`}>
                                        {cat.type === 'expense' ? '(' : ''}{cat.amount.toLocaleString()}{cat.type === 'expense' ? ')' : ''}
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Operational Metrics */}
            <div class="lg:col-span-4 flex flex-col gap-6">
                <div class="rounded-sm border border-stroke bg-white shadow-default">
                    <div class="bg-gray-2/50 py-4 px-6 border-b border-stroke">
                        <h4 class="font-black text-black text-xs uppercase tracking-widest">Operational Footprint</h4>
                    </div>
                    <div class="p-6 space-y-6">
                        <div class="flex items-center gap-4">
                            <div class="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                                <Icon icon={Users} size={24} />
                            </div>
                            <div>
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Staff</p>
                                <p class="text-xl font-black text-black">{staffCount} <span class="text-xs font-bold opacity-50">Personnel</span></p>
                            </div>
                        </div>

                        <div class="flex items-center gap-4">
                            <div class="h-12 w-12 rounded-full bg-slate-100 text-body flex items-center justify-center border border-stroke">
                                <Icon icon={Calendar} size={24} />
                            </div>
                            <div>
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registration Date</p>
                                <p class="text-xl font-black text-black">{association.createdAt}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-2/50 p-6 rounded-sm border border-stroke border-dashed text-center no-print">
                    <p class="text-xs text-body font-medium italic">
                        "Financial sustainability across all units is key to the long-term success of the SACCO."
                    </p>
                </div>
            </div>
        </div>

        {/* Footer (Print Only) */}
        <div class="hidden print:block mt-auto pt-20 border-t border-stroke">
            <div class="grid grid-cols-2 gap-20">
                <div class="text-center">
                    <div class="h-px bg-black mb-4"></div>
                    <p class="text-[10px] font-black text-black uppercase tracking-widest">Business Unit Manager</p>
                </div>
                <div class="text-center">
                    <div class="h-px bg-black mb-4"></div>
                    <p class="text-[10px] font-black text-black uppercase tracking-widest">Auditor / SACCO Accountant</p>
                </div>
            </div>
            <p class="text-[8px] text-center text-slate-400 mt-12 uppercase tracking-widest">Internal Control Document • CONFIDENTIAL</p>
        </div>

      </div>
    </DashboardLayout>
  );
}