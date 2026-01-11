import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { ArrowLeft, Printer, FileSpreadsheet, Banknote } from 'lucide';

export default function LoanPortfolioReport({ data = [] }) {
  const totalPrincipal = data.reduce((sum, l) => sum + l.principal, 0);
  const totalBalance = data.reduce((sum, l) => sum + l.balance, 0);

  return (
    <DashboardLayout title="Active Loans Report">
      <div class="flex flex-col gap-8">
        
        {/* Report Header */}
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
          <div class="flex items-center gap-4">
            <a href="/dashboard/reports" class="btn btn-ghost btn-circle"><Icon icon={ArrowLeft} size={24} /></a>
            <div>
              <h1 class="text-3xl font-bold tracking-tight">Active Loan Portfolio</h1>
              <p class="text-slate-500">Full detailed breakdown of all outstanding loans.</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-outline btn-sm gap-2" onClick="window.print()">
              <Icon icon={Printer} size={16} /> Print
            </button>
            <button class="btn btn-primary btn-sm gap-2">
              <Icon icon={FileSpreadsheet} size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* Print-only Header */}
        <div class="hidden print:block text-center mb-8">
           <h1 class="text-2xl font-bold uppercase">Active Loan Portfolio Report</h1>
           <p class="text-sm">Generated on: {new Date().toLocaleString()}</p>
           <div class="divider"></div>
        </div>

        {/* Summary Stats */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div class="stats shadow border border-base-200 bg-base-100">
              <div class="stat">
                <div class="stat-title">Total Active Principal</div>
                <div class="stat-value text-primary">{totalPrincipal.toLocaleString()} UGX</div>
                <div class="stat-desc">Original borrowed amount</div>
              </div>
           </div>
           <div class="stats shadow border border-base-200 bg-base-100">
              <div class="stat">
                <div class="stat-title">Total Outstanding Balance</div>
                <div class="stat-value text-secondary">{totalBalance.toLocaleString()} UGX</div>
                <div class="stat-desc">Including remaining interest</div>
              </div>
           </div>
        </div>

        {/* Data Table */}
        <div class="card bg-base-100 border border-base-200 shadow-sm">
          <div class="overflow-x-auto">
            <table class="table table-sm table-zebra w-full">
              <thead class="bg-base-200">
                <tr>
                  <th>Member</th>
                  <th class="text-right">Principal</th>
                  <th class="text-right">Interest</th>
                  <th class="text-right">Total Due</th>
                  <th class="text-right">Total Paid</th>
                  <th class="text-right bg-base-300">Balance</th>
                  <th>Issued</th>
                </tr>
              </thead>
              <tbody>
                {data.map((loan) => (
                  <tr key={loan.id}>
                    <td>
                      <div class="font-bold">{loan.memberName}</div>
                      <div class="text-[10px] opacity-50">{loan.memberNumber}</div>
                    </td>
                    <td class="text-right">{loan.principal.toLocaleString()}</td>
                    <td class="text-right">{loan.interestRate}%</td>
                    <td class="text-right">{loan.totalDue.toLocaleString()}</td>
                    <td class="text-right text-success">{loan.totalPaid.toLocaleString()}</td>
                    <td class="text-right font-bold bg-base-200/50">{loan.balance.toLocaleString()}</td>
                    <td class="text-xs opacity-60">{loan.issuedDate}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot class="bg-base-200 font-bold">
                <tr>
                  <td>TOTALS</td>
                  <td class="text-right">{totalPrincipal.toLocaleString()}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td class="text-right">{totalBalance.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div class="hidden print:block mt-20 border-t pt-4 text-center text-xs opacity-50">
           End of Active Loan Portfolio Report • SACCO Management System
        </div>
      </div>
    </DashboardLayout>
  );
}
