import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { 
  ArrowLeft, Users, Banknote, History, 
  TrendingUp, TrendingDown, Calendar, Receipt
} from 'lucide';

export default function AssociationDetail({ association, transactions = [], staff = [] }) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netPosition = totalIncome - totalExpense;

  return (
    <DashboardLayout title={association.name}>
      <div class="flex flex-col gap-8">
        {/* Header Navigation */}
        <div class="flex items-center gap-4">
          <a href="/dashboard/associations" class="btn btn-ghost btn-sm p-0 hover:bg-transparent">
            <Icon icon={ArrowLeft} size={20} />
          </a>
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl font-bold tracking-tight">{association.name}</h1>
              <span class="badge badge-outline badge-sm uppercase font-bold tracking-tighter opacity-50">{association.type}</span>
            </div>
            <p class="text-slate-500">Business Unit Performance & Operations</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="stats shadow border border-base-200">
            <div class="stat">
              <div class="stat-title">Unit Net Position</div>
              <div class={`stat-value ${netPosition >= 0 ? 'text-success' : 'text-error'}`}>
                {netPosition.toLocaleString()}
              </div>
              <div class="stat-desc">Cumulative income - expense</div>
            </div>
          </div>
          
          <div class="stats shadow border border-base-200">
            <div class="stat">
              <div class="stat-title">Staff Count</div>
              <div class="stat-value text-primary">{staff.length}</div>
              <div class="stat-desc">Active employees in unit</div>
            </div>
          </div>

          <div class="stats shadow border border-base-200">
            <div class="stat">
              <div class="stat-title">Transaction Count</div>
              <div class="stat-value text-info">{transactions.length}</div>
              <div class="stat-desc">Ledger entries recorded</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Ledger */}
          <div class="lg:col-span-2 flex flex-col gap-6">
            <div class="card bg-base-100 border border-base-200 shadow-sm">
              <div class="card-body p-0">
                <div class="p-6 border-b border-base-200 flex justify-between items-center">
                  <div class="flex items-center gap-3">
                    <h3 class="card-title text-lg flex items-center gap-2">
                      <Icon icon={History} size={20} class="text-slate-400" />
                      Recent Transactions
                    </h3>
                  </div>
                  <div class="flex gap-2">
                    <button 
                      class="btn btn-xs btn-success text-white gap-1"
                      hx-get={`/dashboard/transactions/new?associationId=${association.id}&type=income`}
                      hx-target="#htmx-modal-content"
                      hx-swap="innerHTML"
                      onClick="document.getElementById('htmx-modal').showModal()"
                    >
                      <Icon icon={TrendingUp} size={14} />
                      Income
                    </button>
                    <button 
                      class="btn btn-xs btn-error text-white gap-1"
                      hx-get={`/dashboard/transactions/new?associationId=${association.id}&type=expense`}
                      hx-target="#htmx-modal-content"
                      hx-swap="innerHTML"
                      onClick="document.getElementById('htmx-modal').showModal()"
                    >
                      <Icon icon={TrendingDown} size={14} />
                      Expense
                    </button>
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
                  <div class="overflow-x-auto" id="transaction-ledger-table">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Details</th>
                          <th class="text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.length === 0 ? (
                          <tr><td colspan="3" class="text-center py-12 text-slate-400">No transactions recorded yet.</td></tr>
                        ) : transactions.map(t => (
                          <tr key={t.id} class="hover">
                            <td class="text-xs opacity-60 font-mono">{t.date}</td>
                            <td>
                              <div class="flex flex-col">
                                <span class="font-bold text-sm uppercase tracking-tight">{t.category}</span>
                                <span class="text-xs text-slate-500">{t.description}</span>
                              </div>
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
                              </div>
          {/* Sidebar: Staff & Info */}
          <div class="flex flex-col gap-6">
             <div class="card bg-base-100 border border-base-200 shadow-sm">
              <div class="card-body p-0">
                <div class="p-6 border-b border-base-200">
                  <h3 class="card-title text-lg flex items-center gap-2">
                    <Icon icon={Users} size={20} class="text-slate-400" />
                    Assigned Staff
                  </h3>
                </div>
                <div class="divide-y divide-base-100">
                  {staff.length === 0 ? (
                    <div class="p-8 text-center text-slate-400 text-sm">No staff assigned to this unit.</div>
                  ) : staff.map(s => (
                    <div key={s.id} class="p-4 flex justify-between items-center">
                      <div>
                        <div class="font-bold">{s.fullName}</div>
                        <div class="text-xs opacity-60 uppercase tracking-widest">{s.role}</div>
                      </div>
                      <div class="text-xs font-mono font-bold">
                        {s.salary?.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                {staff.length > 0 && (
                  <div class="p-4 bg-slate-50 border-t border-base-200 text-center">
                    <a href="/dashboard/staff" class="btn btn-xs btn-ghost text-primary">Manage All Staff</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}