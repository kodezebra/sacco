import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import { ArrowRightLeft, ArrowUpRight, ArrowDownLeft, Plus, Download } from 'lucide';

export default function TransactionsPage({ transactions = [] }) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardLayout title="Accounting">
       <div class="flex flex-col gap-6">
        {/* Financial Summary Stats */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <StatsCard 
            label="Total Income" 
            value={"+"+totalIncome.toLocaleString()} 
            icon={ArrowUpRight} 
            colorClass="text-success" 
          />
          <StatsCard 
            label="Total Expenses" 
            value={"-"+totalExpense.toLocaleString()} 
            icon={ArrowDownLeft} 
            colorClass="text-error" 
          />
          <StatsCard 
            label="Net Position" 
            value={(totalIncome - totalExpense).toLocaleString()} 
            icon={ArrowRightLeft} 
            colorClass={(totalIncome - totalExpense) >= 0 ? "text-primary" : "text-warning"} 
          />
        </div>

        {/* Ledger Table Card */}
        <div class="rounded-sm border border-stroke bg-white shadow-default">
          {/* Card Header */}
          <div class="flex flex-col gap-4 border-b border-stroke px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="text-xl font-bold text-black">Financial Ledger</h3>
            </div>
            
            <div class="flex flex-wrap items-center gap-3">
              <button class="inline-flex items-center gap-2 rounded-sm border border-stroke bg-white px-4 py-2 text-sm font-medium text-black hover:border-primary hover:text-primary">
                <Icon icon={Download} size={18} />
                Export
              </button>
              <button 
                class="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-opacity-90 shadow-default"
                hx-get="/dashboard/transactions/new"
                hx-target="#htmx-modal-content"
                hx-swap="innerHTML"
                onClick="document.getElementById('htmx-modal').showModal()"
              >
                <Icon icon={Plus} size={20} />
                New Entry
              </button>
            </div>
          </div>

          <div class="max-w-full overflow-x-auto">
             <table class="w-full table-auto">
               <thead>
                 <tr class="bg-gray-2 text-left">
                   <th class="min-w-[120px] py-4 px-4 font-bold text-black text-sm uppercase">Date</th>
                   <th class="min-w-[150px] py-4 px-4 font-bold text-black text-sm uppercase">Business Unit</th>
                   <th class="min-w-[200px] py-4 px-4 font-bold text-black text-sm uppercase">Description</th>
                   <th class="min-w-[120px] py-4 px-4 font-bold text-black text-sm uppercase">Category</th>
                   <th class="py-4 px-4 text-right font-bold text-black text-sm uppercase">Amount</th>
                 </tr>
               </thead>
               <tbody>
                 {transactions.length === 0 ? (
                   <tr><td colspan="5" class="text-center py-10 text-body italic">No transactions recorded.</td></tr>
                 ) : transactions.map((t) => (
                   <tr key={t.id} class="border-b border-stroke hover:bg-whiten transition-colors">
                     <td class="py-5 px-4 text-sm text-black">{t.date}</td>
                     <td class="py-5 px-4">
                       <Badge type="ghost">
                         {t.unitName}
                       </Badge>
                     </td>
                     <td class="py-5 px-4 text-sm text-black font-medium">{t.description}</td>
                     <td class="py-5 px-4">
                       <Badge type={t.type === 'income' ? 'success' : 'error'}>
                          {t.category}
                       </Badge>
                     </td>
                     <td class={`py-5 px-4 text-right font-bold text-sm ${t.type === 'income' ? 'text-success' : 'text-error'}`}>
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