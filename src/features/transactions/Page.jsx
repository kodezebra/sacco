import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { ArrowRightLeft, ArrowUpRight, ArrowDownLeft, Plus, Filter, Download } from 'lucide';

export default function TransactionsPage({ transactions = [] }) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardLayout title="Accounting">
       <div class="flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Transactions</h1>
            <p class="text-slate-500">Master ledger for all business units.</p>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-ghost gap-2">
              <Icon icon={Download} size={20} />
              Export
            </button>
            <button 
              class="btn btn-primary gap-2"
              hx-get="/dashboard/transactions/new"
              hx-target="#htmx-modal-content"
              hx-swap="innerHTML"
              onClick="document.getElementById('htmx-modal').showModal()"
            >
              <Icon icon={Plus} size={20} />
              Record Entry
            </button>
          </div>
        </div>

        {/* Financial Summary */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="stats shadow border border-base-200">
            <div class="stat">
              <div class="stat-title">Total Income</div>
              <div class="stat-value text-success">+{totalIncome.toLocaleString()}</div>
            </div>
          </div>
          <div class="stats shadow border border-base-200">
             <div class="stat">
              <div class="stat-title">Total Expenses</div>
              <div class="stat-value text-error">-{totalExpense.toLocaleString()}</div>
            </div>
          </div>
          <div class="stats shadow border border-base-200">
             <div class="stat">
              <div class="stat-title">Net Position</div>
              <div class={`stat-value ${(totalIncome - totalExpense) >= 0 ? 'text-primary' : 'text-warning'}`}>
                {(totalIncome - totalExpense).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div class="card bg-base-100 border border-base-200 shadow-sm">
          <div class="card-body p-0">
             <div class="overflow-x-auto">
               <table class="table">
                 <thead>
                   <tr>
                     <th>Date</th>
                     <th>Business Unit</th>
                     <th>Description</th>
                     <th>Category</th>
                     <th class="text-right">Amount (UGX)</th>
                   </tr>
                 </thead>
                 <tbody>
                   {transactions.length === 0 ? (
                     <tr><td colspan="5" class="text-center py-12 text-slate-400">No transactions recorded.</td></tr>
                   ) : transactions.map(t => (
                     <tr key={t.id} class="hover">
                       <td class="font-mono text-xs opacity-60">{t.date}</td>
                       <td>
                         <span class="badge badge-outline text-xs font-bold">
                           {t.unitName}
                         </span>
                       </td>
                       <td>{t.description}</td>
                       <td>
                         <span class={`badge badge-sm uppercase font-bold tracking-wider ${t.type === 'income' ? 'badge-success badge-soft' : 'badge-error badge-soft'}`}>
                            {t.category}
                         </span>
                       </td>
                       <td class={`text-right font-bold ${t.type === 'income' ? 'text-success' : 'text-error'}`}>
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