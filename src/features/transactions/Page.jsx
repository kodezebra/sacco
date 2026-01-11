import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Plus, ArrowUpRight, ArrowDownLeft, Search, Filter } from 'lucide';

const formatUGX = (val) => (val || 0).toLocaleString() + ' UGX';

export function TransactionsTable({ transactions = [] }) {
  if (transactions.length === 0) {
    return (
      <div class="p-12 text-center text-slate-400">
        <p>No transactions found.</p>
      </div>
    );
  }

  return (
    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Description</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} class="hover">
              <td class="whitespace-nowrap opacity-70 text-xs font-mono">{t.date}</td>
              <td>
                <span class={`badge badge-sm badge-soft uppercase font-bold tracking-wider ${t.type === 'income' ? 'badge-success' : 'badge-error'}`}>
                   {t.type === 'income' ? <Icon icon={ArrowDownLeft} size={12} class="mr-1" /> : <Icon icon={ArrowUpRight} size={12} class="mr-1" />}
                   {t.type}
                </span>
              </td>
              <td>{t.category}</td>
              <td class="max-w-xs truncate" title={t.description}>{t.description}</td>
              <td class={`text-right font-medium ${t.type === 'income' ? 'text-success' : 'text-error'}`}>
                {t.type === 'expense' ? '-' : '+'}{formatUGX(t.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TransactionsPage({ transactions = [] }) {
  return (
    <DashboardLayout title="Transactions">
       <div class="flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Transactions</h1>
            <p class="text-slate-500">View and manage financial transactions.</p>
          </div>
          <button class="btn btn-primary gap-2">
            <Icon icon={Plus} size={20} />
            Add Transaction
          </button>
        </div>

        <div class="card bg-base-100 border border-base-200 shadow-sm">
           <div class="p-4 border-b border-base-200 flex flex-col md:flex-row justify-between gap-4 items-center">
            <div class="flex gap-2 w-full max-w-sm">
              <label class="input w-full">
                <Icon icon={Search} size={16} class="opacity-50" strokeWidth={2.5} />
                <input type="search" placeholder="Search transactions..." />
              </label>
            </div>
            <div class="flex gap-2">
               <button class="btn btn-ghost btn-sm gap-2 border-base-300">
                  <Icon icon={Filter} size={16} /> Filter
               </button>
            </div>
          </div>
          <TransactionsTable transactions={transactions} />
        </div>
      </div>
    </DashboardLayout>
  );
}
