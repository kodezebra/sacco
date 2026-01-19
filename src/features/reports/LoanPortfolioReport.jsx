import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { ArrowLeft, Printer, FileSpreadsheet, Banknote, Users, History, TrendingUp } from 'lucide';

export default function LoanPortfolioReport({ data = [] }) {
  const totalPrincipal = data.reduce((sum, l) => sum + l.principal, 0);
  const totalBalance = data.reduce((sum, l) => sum + l.balance, 0);

  return (
    <DashboardLayout title="Active Loans Report">
      <div class="flex flex-col gap-8 max-w-screen-2xl mx-auto">
        
        {/* Report Header - Web Only */}
        <div class="no-print">
          <PageHeader 
            title="Loan Portfolio Analytics"
            subtitle="Risk exposure and outstanding credit performance."
            backHref="/dashboard/reports"
            breadcrumbs={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Reports', href: '/dashboard/reports' },
              { label: 'Loan Portfolio', href: '/dashboard/reports/loans-active', active: true }
            ]}
            actions={(
              <button class="inline-flex items-center justify-center gap-2.5 rounded-sm border border-stroke bg-white py-2 px-6 text-center font-bold text-black hover:border-primary hover:text-primary transition-all uppercase tracking-widest text-xs" onClick="window.print()">
                  <Icon icon={Printer} size={16} /> Print
              </button>
            )}
          />
        </div>

        {/* Print-only Header */}
        <div class="hidden print:block text-center mb-8 border-b-2 border-black pb-6">
           <h1 class="text-3xl font-black uppercase tracking-tighter">Report: Active Loan Portfolio</h1>
           <p class="text-[10px] font-bold text-body mt-2 tracking-widest uppercase tracking-widest">Date Generated: {new Date().toLocaleString()}</p>
        </div>

        {/* Summary Stats */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Principal</span>
                <div class="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Icon icon={Banknote} size={16} />
                </div>
              </div>
              <h3 class="text-2xl font-black text-black font-mono">{totalPrincipal.toLocaleString()} <span class="text-xs">UGX</span></h3>
              <p class="text-[10px] text-body mt-2 font-bold uppercase tracking-tighter">Aggregate original debt</p>
           </div>

           <div class="rounded-sm border border-stroke bg-white p-6 shadow-default border-l-4 border-l-secondary">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Outstanding Exposure</span>
                <div class="h-8 w-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                    <Icon icon={TrendingUp} size={16} />
                </div>
              </div>
              <h3 class="text-2xl font-black text-secondary font-mono">{totalBalance.toLocaleString()} <span class="text-xs">UGX</span></h3>
              <p class="text-[10px] text-body mt-2 font-bold uppercase tracking-tighter">Remaining principle + interest</p>
           </div>
        </div>

        {/* Data Table */}
        <div class="rounded-sm border border-stroke bg-white shadow-default overflow-hidden">
            <div class="bg-gray-2/50 py-4 px-6 border-b border-stroke flex justify-between items-center">
                <h4 class="font-black text-black text-xs uppercase tracking-widest">Active Credit Facilities</h4>
                <Badge type="ghost" size="xs">{data.length} RECIPIENTS</Badge>
            </div>
            <div class="max-w-full overflow-x-auto">
                <table class="w-full table-auto">
                    <thead>
                        <tr class="bg-slate-50 text-left border-b border-stroke">
                            <th class="py-4 px-6 font-black text-black uppercase text-[10px] tracking-widest">Member Portfolio</th>
                            <th class="py-4 px-6 text-right font-black text-black uppercase text-[10px] tracking-widest">Principal</th>
                            <th class="py-4 px-6 text-right font-black text-black uppercase text-[10px] tracking-widest">Due (Total)</th>
                            <th class="py-4 px-6 text-right font-black text-black uppercase text-[10px] tracking-widest">Settled</th>
                            <th class="py-4 px-6 text-right font-black text-black uppercase text-[10px] tracking-widest bg-gray-2/50">Current Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((loan) => (
                        <tr key={loan.id} class="border-b border-stroke hover:bg-whiten transition-colors group">
                            <td class="py-5 px-6">
                                <div class="font-black text-black text-sm">{loan.memberName}</div>
                                <div class="text-[10px] font-bold text-body uppercase tracking-tighter mt-0.5">{loan.memberNumber} • {loan.issuedDate}</div>
                            </td>
                            <td class="py-5 px-6 text-right font-mono font-black text-xs text-body opacity-70">
                                {loan.principal.toLocaleString()}
                            </td>
                            <td class="py-5 px-6 text-right font-mono font-black text-xs text-black">
                                {loan.totalDue.toLocaleString()}
                            </td>
                            <td class="py-5 px-6 text-right font-mono font-black text-xs text-success">
                                {loan.totalPaid.toLocaleString()}
                            </td>
                            <td class="py-5 px-6 text-right font-mono font-black text-sm text-black bg-gray-2/30">
                                {loan.balance.toLocaleString()}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    <tfoot class="bg-gray-2/50 font-black">
                        <tr>
                            <td class="py-6 px-6 text-[10px] uppercase tracking-[0.2em] text-black">Aggregate Totals</td>
                            <td class="py-6 px-6 text-right text-sm font-mono">{totalPrincipal.toLocaleString()}</td>
                            <td></td>
                            <td></td>
                            <td class="py-6 px-6 text-right text-sm font-mono text-primary">{totalBalance.toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

        <div class="hidden print:block mt-20 border-t border-stroke pt-6 text-center">
           <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">End of Portfolio Audit • CONFIDENTIAL</p>
        </div>
      </div>
    </DashboardLayout>
  );
}