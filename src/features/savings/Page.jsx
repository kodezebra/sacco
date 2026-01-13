import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import TableAction from '../../components/TableAction.jsx';
import { Search, Filter, User, Eye, ChevronLeft, ChevronRight, ArrowDownLeft, ArrowUpRight } from 'lucide';

const formatUGX = (val) => (val || 0).toLocaleString() + ' UGX';

export function Pagination({ page, totalPages, search }) {
  if (totalPages <= 1) return null;

  return (
    <div class="flex justify-between items-center p-6 border-t border-slate-100 bg-slate-50/30">
      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        Page {page} of {totalPages}
      </div>
      <div class="join shadow-sm border border-slate-200 overflow-hidden rounded-xl">
        <button 
          class="join-item btn btn-xs h-10 px-4 bg-base-100 hover:bg-base-200 border-none" 
          disabled={page <= 1}
          hx-get={`/dashboard/savings?page=${page - 1}&search=${search}`}
          hx-target="#savings-list-container"
          hx-swap="outerHTML"
        >
          <Icon icon={ChevronLeft} size={16} />
        </button>
        <button 
          class="join-item btn btn-xs h-10 px-4 bg-base-100 hover:bg-base-200 border-none"
          disabled={page >= totalPages}
          hx-get={`/dashboard/savings?page=${page + 1}&search=${search}`}
          hx-target="#savings-list-container"
          hx-swap="outerHTML"
        >
          <Icon icon={ChevronRight} size={16} />
        </button>
      </div>
    </div>
  );
}

export function SavingsList({ savings = [], page = 1, totalPages = 1, search = "" }) {
  return (
    <div id="savings-list-container" class="rounded-sm border border-slate-200 bg-white shadow-sm">
      {/* Card Header */}
      <div class="flex flex-col gap-4 border-b border-slate-100 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="text-xl font-bold text-black">Savings Ledger</h3>
          <p class="text-sm font-medium text-slate-500 mt-1">Global overview of all member deposits and withdrawals.</p>
        </div>
        
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative">
            <button class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon icon={Search} size={18} />
            </button>
            <input 
              type="search" 
              name="search"
              placeholder="Search by member..." 
              class="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm font-medium text-black focus:border-primary focus:outline-none xl:w-72"
              value={search}
              hx-get="/dashboard/savings"
              hx-trigger="keyup changed delay:500ms, search"
              hx-target="#savings-list-container"
              hx-swap="outerHTML"
              hx-indicator=".htmx-indicator"
              hx-include="[name='page']"
            />
            <input type="hidden" name="page" value="1" />
          </div>
        </div>
      </div>

      <div class="overflow-x-auto min-h-[400px]">
        {savings.length === 0 ? (
          <div class="p-12 text-center text-slate-400">
            <p>No savings records found.</p>
          </div>
        ) : (
          <table class="table w-full">
            <thead class="bg-slate-50">
              <tr>
                <th class="py-4 px-4 text-sm font-bold text-black uppercase">Member</th>
                <th class="py-4 px-4 text-sm font-bold text-black uppercase">Type</th>
                <th class="py-4 px-4 text-right text-sm font-bold text-black uppercase">Amount (UGX)</th>
                <th class="py-4 px-4 text-sm font-bold text-black uppercase">Date</th>
                <th class="py-4 px-4 text-right text-sm font-bold text-black uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {savings.map((s) => (
                <tr key={s.id} class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td class="py-4 px-4">
                    <div>
                      <div class="font-bold text-black">{s.memberName}</div>
                      <div class="text-[10px] opacity-50">ID: {s.id.substring(0,8)}</div>
                    </div>
                  </td>
                  <td class="py-4 px-4">
                    <Badge type={s.type === 'deposit' ? 'success' : 'error'}>
                       {s.type === 'deposit' ? <Icon icon={ArrowDownLeft} size={12} class="mr-1" /> : <Icon icon={ArrowUpRight} size={12} class="mr-1" />}
                       {s.type}
                    </Badge>
                  </td>
                  <td class="py-4 px-4 text-right font-mono font-medium tracking-tight text-black">{(s.amount || 0).toLocaleString()}</td>
                  <td class="py-4 px-4 text-xs opacity-60 text-black">{s.date}</td>
                  <td class="py-4 px-4 text-right">
                    <div class="flex justify-end gap-2">
                      <TableAction 
                        label="View"
                        icon={Eye}
                        href={`/dashboard/members/${s.memberId}`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Pagination page={page} totalPages={totalPages} search={search} />
    </div>
  );
}

export default function SavingsPage({ savings = [], page = 1, totalPages = 1, search = "" }) {
  return (
    <DashboardLayout title="Savings">
       <div class="flex flex-col gap-8 pb-12">
          <SavingsList savings={savings} page={page} totalPages={totalPages} search={search} />
       </div>
    </DashboardLayout>
  );
}
