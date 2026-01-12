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
        <div class="card bg-base-100 border border-base-200 shadow-sm">
          <div class="card-body p-0">
             <div class="p-4 border-b border-base-200">
               <h3 class="font-bold flex items-center gap-2">
                 <Icon icon={History} size={16} /> Payment History
               </h3>
             </div>
             <div class="overflow-x-auto">
               <table class="table">
                 <thead>
                   <tr>
                     <th>Date</th>
                     <th>Employee</th>
                     <th>Description</th>
                     <th class="text-right">Amount (UGX)</th>
                   </tr>
                 </thead>
                 <tbody>
                   {history.length === 0 ? (
                     <tr><td colspan="4" class="text-center py-12 text-slate-400">No payroll history found. Run a payroll to start.</td></tr>
                   ) : history.map(p => (
                     <tr key={p.id} class="hover">
                       <td class="font-mono text-xs opacity-60">{p.date}</td>
                       <td>
                         <div class="flex items-center gap-2">
                           <Icon icon={User} size={14} class="opacity-50" />
                           <div>
                             <div class="font-bold text-sm">{p.staffName}</div>
                             <div class="text-xs opacity-50">{p.role}</div>
                           </div>
                         </div>
                       </td>
                       <td class="text-sm opacity-80">{p.txnDescription}</td>
                       <td class="text-right font-mono font-bold">
                         {p.amount.toLocaleString()}
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