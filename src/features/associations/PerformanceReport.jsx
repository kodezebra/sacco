import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { ArrowLeft, Printer, TrendingUp, TrendingDown, Layers, Users, Calendar } from 'lucide';

export default function PerformanceReport({ association, stats, categories, staffCount, period = {} }) {
  const isProfitable = stats.netProfit >= 0;
  
  return (
    <DashboardLayout title={`Performance Report - ${association.name}`}>
      <div class="flex flex-col gap-8 max-w-5xl mx-auto">
        
        {/* Header - No Print */}
        <div class="no-print">
          <PageHeader 
            title={association.name}
            subtitle="Business Performance Analysis"
            backHref={`/dashboard/associations/${association.id}`}
            breadcrumbs={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Projects', href: '/dashboard/associations' },
              { label: association.name, href: `/dashboard/associations/${association.id}` },
              { label: 'Performance', href: `/dashboard/associations/${association.id}/performance`, active: true }
            ]}
            actions={(
              <button class="inline-flex items-center justify-center gap-2 rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 shadow-default transition-all" onClick="window.print()">
                <Icon icon={Printer} size={18} /> 
                <span>Print Report</span>
              </button>
            )}
          />
        </div>

        {/* Report Content - This is what gets printed */}
        <div class="bg-white p-8 md:p-12 rounded-sm border border-stroke shadow-default print:border-0 print:shadow-none min-h-[1000px]">
           
           {/* Print Header */}
           <div class="flex justify-between items-start mb-10 border-b border-stroke pb-8">
              <div>
                <h2 class="text-2xl font-black text-black uppercase tracking-tighter mb-1">Statement of Performance</h2>
                <div class="flex items-center gap-2 text-sm text-body font-bold">
                  <Icon icon={Layers} size={14} />
                  <span>{association.name} ({association.type})</span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-[10px] font-bold text-bodydark2 uppercase tracking-widest">Reporting Period</p>
                <p class="text-sm font-bold text-black">{period.start || 'Beginning'} — {period.end || 'Today'}</p>
                <p class="text-[10px] text-body mt-1 italic">Generated on {new Date().toLocaleDateString()}</p>
              </div>
           </div>

           {/* Executive Summary Stats */}
           <div class="grid grid-cols-1 md:grid-cols-3 gap-0 mb-10 border border-stroke rounded-sm divide-y md:divide-y-0 md:divide-x divide-stroke overflow-hidden">
              <div class="p-6 text-center">
                 <span class="text-[10px] font-bold text-bodydark2 uppercase tracking-widest mb-1 block">Gross Income</span>
                 <h3 class="text-2xl font-black text-success tracking-tight">UGX {stats.totalIncome.toLocaleString()}</h3>
                 <span class="text-[9px] text-body font-medium">{stats.txCount} transactions recorded</span>
              </div>
              <div class="p-6 text-center bg-gray-2/20">
                 <span class="text-[10px] font-bold text-bodydark2 uppercase tracking-widest mb-1 block">Operating Expenses</span>
                 <h3 class="text-2xl font-black text-error tracking-tight">UGX {stats.totalExpense.toLocaleString()}</h3>
                 <span class="text-[9px] text-body font-medium">Outflows & operational costs</span>
              </div>
              <div class={`p-6 text-center ${isProfitable ? 'bg-success/5' : 'bg-error/5'}`}>
                 <span class="text-[10px] font-bold text-bodydark2 uppercase tracking-widest mb-1 block">Net Performance</span>
                 <h3 class={`text-2xl font-black tracking-tight ${isProfitable ? 'text-success' : 'text-error'}`}>
                    {isProfitable ? '+' : ''}UGX {stats.netProfit.toLocaleString()}
                 </h3>
                 <span class={`text-[9px] font-bold uppercase ${isProfitable ? 'text-success' : 'text-error'}`}>
                    {isProfitable ? 'Operational Surplus' : 'Operational Deficit'}
                 </span>
              </div>
           </div>

           {/* Detailed Category Breakdown */}
           <div class="mb-12">
              <h4 class="text-xs font-bold text-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <span class="h-4 w-1 bg-primary"></span>
                Financial Breakdown by Category
              </h4>
              <div class="overflow-hidden border border-stroke rounded-sm">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-gray-2">
                      <th class="py-3 px-4 text-[10px] font-bold text-black uppercase tracking-wider">Classification</th>
                      <th class="py-3 px-4 text-[10px] font-bold text-black uppercase tracking-wider text-center">Type</th>
                      <th class="py-3 px-4 text-[10px] font-bold text-black uppercase tracking-wider text-right">Amount (UGX)</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-stroke">
                    {categories.map((cat, i) => (
                      <tr key={i} class="hover:bg-whiten transition-colors">
                        <td class="py-4 px-4">
                          <div class="font-bold text-sm text-black uppercase">{cat.name}</div>
                          <div class="text-[10px] text-body">{cat.count} individual entries</div>
                        </td>
                        <td class="py-4 px-4 text-center">
                          <span class={`text-[9px] font-bold uppercase px-2 py-1 rounded-full ${
                            cat.type === 'income' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                          }`}>
                            {cat.type}
                          </span>
                        </td>
                        <td class={`py-4 px-4 text-right font-mono font-bold text-sm ${
                          cat.type === 'income' ? 'text-success' : 'text-error'
                        }`}>
                          {cat.type === 'expense' ? '(' : ''}{cat.amount.toLocaleString()}{cat.type === 'expense' ? ')' : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr class="bg-gray-2/50 font-black">
                       <td colspan="2" class="py-4 px-4 text-xs uppercase tracking-widest text-black">Total Net Surplus / (Deficit)</td>
                       <td class={`py-4 px-4 text-right font-mono text-lg ${isProfitable ? 'text-success' : 'text-error'}`}>
                         UGX {stats.netProfit.toLocaleString()}
                       </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
           </div>

           {/* Human Resources / Operational Footprint */}
           <div class="mb-12">
              <h4 class="text-xs font-bold text-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <span class="h-4 w-1 bg-primary"></span>
                Operational Resources
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-6 rounded-sm border border-stroke bg-whiten/30">
                   <div class="flex items-center gap-4">
                      <div class="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                         <Icon icon={Users} size={24} />
                      </div>
                      <div>
                        <h5 class="font-bold text-black text-sm uppercase">Assigned Staff</h5>
                        <p class="text-lg font-black text-black">{staffCount} Personnel</p>
                      </div>
                   </div>
                </div>
                <div class="p-6 rounded-sm border border-stroke bg-whiten/30">
                   <div class="flex items-center gap-4">
                      <div class="h-12 w-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                         <Icon icon={Calendar} size={24} />
                      </div>
                      <div>
                        <h5 class="font-bold text-black text-sm uppercase">Operating Since</h5>
                        <p class="text-lg font-black text-black">{association.createdAt}</p>
                      </div>
                   </div>
                </div>
              </div>
           </div>

           {/* Footer / Sign-off */}
           <div class="mt-20 pt-10 border-t border-stroke grid grid-cols-2 gap-20">
              <div class="text-center">
                 <div class="h-px bg-stroke mb-4"></div>
                 <p class="text-[10px] font-bold text-bodydark2 uppercase tracking-widest">Prepared By (Unit Manager)</p>
              </div>
              <div class="text-center">
                 <div class="h-px bg-stroke mb-4"></div>
                 <p class="text-[10px] font-bold text-bodydark2 uppercase tracking-widest">Verified By (Auditor/Treasurer)</p>
              </div>
           </div>

           <div class="mt-12 text-center text-[9px] text-body opacity-50 italic">
              * This is an automated financial performance statement generated by the SACCO Management System. Confidential.
           </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
