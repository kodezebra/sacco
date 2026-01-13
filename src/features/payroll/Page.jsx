import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Plus, Wallet, History, User } from 'lucide';

export default function PayrollPage({ history = [] }) {
  const totalPaid = history.reduce((sum, h) => sum + h.amount, 0);

  return (
    <DashboardLayout title="Payroll">
       <div class="flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Payroll Management</h1>
            <p class="text-slate-500">Automated salary processing and history.</p>
          </div>
          <a 
            href="/dashboard/payroll/run"
            class="btn btn-primary gap-2"
          >
            <Icon icon={Wallet} size={20} />
            Run Payroll
          </a>
        </div>

        {/* Stats */}
        <div class="stats shadow border border-base-200">
          <div class="stat">
            <div class="stat-figure text-secondary">
              <Icon icon={History} size={32} />
            </div>
            <div class="stat-title">Recent Disbursements</div>
            <div class="stat-value text-secondary">{totalPaid.toLocaleString()}</div>
            <div class="stat-desc">UGX (Last {history.length} records)</div>
          </div>
        </div>

        {/* History Table */}
        <div class="rounded-sm border border-slate-200 bg-white px-5 pt-6 pb-2.5 shadow-sm sm:px-7.5 xl:pb-1">
          <div class="mb-4">
             <h3 class="font-bold flex items-center gap-2 text-black text-lg">
               <Icon icon={History} size={20} /> Payment History
             </h3>
          </div>
          <div class="overflow-x-auto">
             <table class="table w-full">
               <thead class="bg-slate-50">
                 <tr>
                   <th class="py-4 px-4 text-sm font-bold text-black uppercase">Date</th>
                   <th class="py-4 px-4 text-sm font-bold text-black uppercase">Employee</th>
                   <th class="py-4 px-4 text-sm font-bold text-black uppercase">Description</th>
                   <th class="py-4 px-4 text-right text-sm font-bold text-black uppercase">Amount (UGX)</th>
                 </tr>
               </thead>
               <tbody>
                 {history.length === 0 ? (
                   <tr><td colspan="4" class="text-center py-12 text-slate-400">No payroll history found. Run a payroll to start.</td></tr>
                 ) : history.map(p => (
                   <tr key={p.id} class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                     <td class="py-4 px-4 text-xs font-mono text-black opacity-60">{p.date}</td>
                     <td class="py-4 px-4">
                       <div class="flex items-center gap-2">
                         <Icon icon={User} size={14} class="text-black opacity-50" />
                         <div>
                           <div class="font-bold text-sm text-black">{p.staffName}</div>
                           <div class="text-xs text-black opacity-50">{p.role}</div>
                         </div>
                       </div>
                     </td>
                     <td class="py-4 px-4 text-sm text-black opacity-80">{p.txnDescription}</td>
                     <td class="py-4 px-4 text-right font-mono font-bold text-black">
                       {p.amount.toLocaleString()}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}