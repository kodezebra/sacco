import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import { 
  ArrowRightLeft, ArrowUpRight, ArrowDownLeft, 
  Plus, Download, Search, Filter, 
  ChevronLeft, ChevronRight, Layers 
} from 'lucide';

export function LedgerTable({ transactions = [], associations = [], filters = {}, page = 1, totalPages = 1 }) {
  return (
    <div id="ledger-list-container" class="rounded-sm border border-stroke bg-white shadow-default">
      {/* Search & Filter Bar */}
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-stroke px-6 py-4.5">
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-bodydark2">
              <Icon icon={Search} size={18} />
            </span>
            <input 
              type="search" 
              name="search"
              placeholder="Search details..." 
              class="w-full rounded-sm border border-stroke bg-whiten py-2 pl-10 pr-4 text-sm font-medium text-black focus:border-primary focus:outline-none xl:w-64"
              value={filters.search}
              hx-get="/dashboard/transactions"
              hx-trigger="keyup changed delay:500ms, search"
              hx-target="#ledger-list-container"
              hx-swap="outerHTML"
              hx-include="[name='associationId'], [name='type'], [name='page']"
            />
          </div>

          <div class="relative">
            <select 
              name="associationId"
              class="appearance-none rounded-sm border border-stroke bg-whiten py-2 pl-4 pr-10 text-sm font-medium text-black focus:border-primary outline-none"
              hx-get="/dashboard/transactions"
              hx-target="#ledger-list-container"
              hx-swap="outerHTML"
              hx-include="[name='search'], [name='type']"
            >
              <option value="">All Units</option>
              {associations.map(a => (
                <option key={a.id} value={a.id} selected={filters.associationId === a.id}>{a.name}</option>
              ))}
            </select>
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-bodydark2 pointer-events-none">
              <Icon icon={Layers} size={14} />
            </span>
          </div>

          <div class="relative">
            <select 
              name="type"
              class="appearance-none rounded-sm border border-stroke bg-whiten py-2 pl-4 pr-10 text-sm font-medium text-black focus:border-primary outline-none"
              hx-get="/dashboard/transactions"
              hx-target="#ledger-list-container"
              hx-swap="outerHTML"
              hx-include="[name='search'], [name='associationId']"
            >
              <option value="">All Types</option>
              <option value="income" selected={filters.type === 'income'}>Income</option>
              <option value="expense" selected={filters.type === 'expense'}>Expense</option>
            </select>
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-bodydark2 pointer-events-none">
              <Icon icon={Filter} size={14} />
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <a 
            href="/dashboard/transactions/new"
            class="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-2 text-sm font-bold text-white hover:bg-opacity-90 shadow-default uppercase tracking-widest"
          >
            <Icon icon={Plus} size={18} />
            New Entry
          </a>
        </div>
      </div>

      <div class="max-w-full overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-2 text-left">
              <th class="min-w-[120px] py-4 px-4 font-bold text-black text-[10px] uppercase">Date</th>
              <th class="min-w-[150px] py-4 px-4 font-bold text-black text-[10px] uppercase">Business Unit</th>
              <th class="min-w-[200px] py-4 px-4 font-bold text-black text-[10px] uppercase">Description</th>
              <th class="min-w-[120px] py-4 px-4 font-bold text-black text-[10px] uppercase">Category</th>
              <th class="py-4 px-4 text-right font-bold text-black text-[10px] uppercase">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colspan="5" class="text-center py-20 text-body italic bg-gray-50/50">No transactions match your criteria.</td></tr>
            ) : transactions.map((t) => (
              <tr key={t.id} class="border-b border-stroke hover:bg-whiten transition-colors group">
                <td class="py-5 px-4 text-sm text-black font-mono">{t.date}</td>
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
                <td class={`py-5 px-4 text-right font-black text-sm ${t.type === 'income' ? 'text-success' : 'text-error'}`}>
                  {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div class="flex justify-between items-center p-6 border-t border-stroke bg-gray-50">
          <div class="text-[10px] font-black text-bodydark2 uppercase tracking-widest">
            Page {page} of {totalPages}
          </div>
          <div class="join border border-stroke overflow-hidden rounded-sm bg-white">
            <button 
              class="join-item btn btn-xs h-9 px-4 bg-transparent hover:bg-gray-2 text-black border-none" 
              disabled={page <= 1}
              hx-get={`/dashboard/transactions?page=${page - 1}&search=${filters.search || ''}&associationId=${filters.associationId || ''}&type=${filters.type || ''}`}
              hx-target="#ledger-list-container"
              hx-swap="outerHTML"
            >
              <Icon icon={ChevronLeft} size={16} />
            </button>
            <button 
              class="join-item btn btn-xs h-9 px-4 bg-transparent hover:bg-gray-2 text-black border-none"
              disabled={page >= totalPages}
              hx-get={`/dashboard/transactions?page=${page + 1}&search=${filters.search || ''}&associationId=${filters.associationId || ''}&type=${filters.type || ''}`}
              hx-target="#ledger-list-container"
              hx-swap="outerHTML"
            >
              <Icon icon={ChevronRight} size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TransactionsPage({ transactions = [], associations = [], filters = {}, page = 1, totalPages = 1, stats = {} }) {
  const netPosition = (stats.income || 0) - (stats.expense || 0);

  return (
    <DashboardLayout title="Financial Ledger">
       <div class="flex flex-col gap-6">
        {/* Financial Summary Stats */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <StatsCard 
            label="Aggregate Income" 
            value={"+"+(stats.income || 0).toLocaleString()} 
            icon={ArrowUpRight} 
            colorClass="text-success" 
          />
          <StatsCard 
            label="Aggregate Expenses" 
            value={"-"+(stats.expense || 0).toLocaleString()} 
            icon={ArrowDownLeft} 
            colorClass="text-error" 
          />
          <StatsCard 
            label="Net Position" 
            value={netPosition.toLocaleString()} 
            icon={ArrowRightLeft} 
            colorClass={netPosition >= 0 ? "text-primary" : "text-warning"} 
          />
        </div>

        <LedgerTable 
          transactions={transactions} 
          associations={associations} 
          filters={filters} 
          page={page} 
          totalPages={totalPages} 
        />
      </div>
    </DashboardLayout>
  );
}