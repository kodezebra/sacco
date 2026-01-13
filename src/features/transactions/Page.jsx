import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import StatsCard from '../../components/StatsCard.jsx';
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
       <div class="flex flex-col gap-8 pb-12">
        {/* Financial Summary Stats */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            label="Total Income" 
            value={"+"+totalIncome.toLocaleString()} 
            subtitle="Ledger inflows" 
            icon={ArrowUpRight} 
            colorClass="text-success" 
          />
          <StatsCard 
            label="Total Expenses" 
            value={"-"+totalExpense.toLocaleString()} 
            subtitle="Ledger outflows" 
            icon={ArrowDownLeft} 
            colorClass="text-error" 
          />
          <StatsCard 
            label="Net Position" 
            value={(totalIncome - totalExpense).toLocaleString()} 
            subtitle="Available liquidity" 
            icon={ArrowRightLeft} 
            colorClass={(totalIncome - totalExpense) >= 0 ? "text-primary" : "text-warning"} 
          />
        </div>

        {/* Ledger Table Card */}
        <div class="rounded-sm border border-slate-200 bg-white shadow-sm">
          {/* Card Header */}
          <div class="flex flex-col gap-4 border-b border-slate-100 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="text-xl font-bold text-black">Financial Ledger</h3>
              <p class="text-sm font-medium text-slate-500 mt-1">Master record of all business unit entries.</p>
            </div>
            
            <div class="flex flex-wrap items-center gap-3">
              <button class="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary hover:border-primary">
                <Icon icon={Download} size={18} />
                Export
              </button>
              <button 
                class="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-opacity-90 shadow-md"
                hx-get="/dashboard/transactions/new"
                hx-target="#htmx-modal-content"
                hx-swap="innerHTML"
                onClick="document.getElementById('htmx-modal').showModal()"
              >
                <Icon icon={Plus} size={20} />
                New
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
             <table class="table w-full">
               <thead class="bg-slate-50">
                 <tr>
                   <th class="py-4 px-4 text-sm font-bold text-black uppercase">Date</th>
                   <th class="py-4 px-4 text-sm font-bold text-black uppercase">Business Unit</th>
                   <th class="py-4 px-4 text-sm font-bold text-black uppercase">Description</th>
                   <th class="py-4 px-4 text-sm font-bold text-black uppercase">Category</th>
                   <th class="py-4 px-4 text-right text-sm font-bold text-black uppercase">Amount (UGX)</th>
                 </tr>
               </thead>
               <tbody>
                 {transactions.length === 0 ? (
                   <tr><td colspan="5" class="text-center py-12 text-slate-400">No transactions recorded.</td></tr>
                 ) : transactions.map(t => (
                   <tr key={t.id} class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                     <td class="py-4 px-4 text-sm font-medium text-black">{t.date}</td>
                     <td class="py-4 px-4">
                       <Badge type="ghost">
                         {t.unitName}
                       </Badge>
                     </td>
                     <td class="py-4 px-4 text-sm text-black font-medium">{t.description}</td>
                     <td class="py-4 px-4">
                       <Badge type={t.type === 'income' ? 'success' : 'error'}>
                          {t.category}
                       </Badge>
                     </td>
                     <td class={`py-4 px-4 text-right font-bold text-sm ${t.type === 'income' ? 'text-success' : 'text-error'}`}>
                       {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}
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