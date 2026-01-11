import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Search, Filter, User, Eye, ChevronLeft, ChevronRight, ArrowDownLeft, ArrowUpRight } from 'lucide';

const formatUGX = (val) => (val || 0).toLocaleString() + ' UGX';

export function Pagination({ page, totalPages, search }) {
  if (totalPages <= 1) return null;

  return (
    <div class="flex justify-between items-center p-4 border-t border-base-200 bg-base-100">
      <div class="text-sm text-slate-500">
        Page {page} of {totalPages}
      </div>
      <div class="join">
        <button 
          class="join-item btn btn-sm" 
          disabled={page <= 1}
          hx-get={`/dashboard/savings?page=${page - 1}&search=${search}`}
          hx-target="#savings-list-container"
          hx-swap="outerHTML"
        >
          <Icon icon={ChevronLeft} size={16} />
        </button>
        <button 
          class="join-item btn btn-sm"
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
    <div id="savings-list-container">
      <div class="overflow-x-auto min-h-[400px]">
        {savings.length === 0 ? (
          <div class="p-12 text-center text-slate-400">
            <p>No savings records found.</p>
          </div>
        ) : (
          <table class="table table-sm table-zebra w-full">
            <thead class="bg-base-200">
              <tr>
                <th>Member</th>
                <th>Type</th>
                <th class="text-right">Amount (UGX)</th>
                <th>Date</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {savings.map((s) => (
                <tr key={s.id} class="hover">
                  <td>
                    <div>
                      <div class="font-bold">{s.memberName}</div>
                      <div class="text-[10px] opacity-50">ID: {s.id.substring(0,8)}</div>
                    </div>
                  </td>
                  <td>
                    <span class={`badge badge-sm badge-soft uppercase text-[10px] font-bold tracking-wider ${s.type === 'deposit' ? 'badge-success' : 'badge-error'}`}>
                       {s.type === 'deposit' ? <Icon icon={ArrowDownLeft} size={12} class="mr-1" /> : <Icon icon={ArrowUpRight} size={12} class="mr-1" />}
                       {s.type}
                    </span>
                  </td>
                  <td class="text-right font-mono font-medium tracking-tight text-slate-700">{(s.amount || 0).toLocaleString()}</td>
                  <td class="text-xs opacity-60">{s.date}</td>
                  <td class="text-right">
                    <div class="flex justify-end gap-2">
                      <a href={`/dashboard/members/${s.memberId}`} class="btn btn-outline btn-sm gap-2 font-medium">
                        <Icon icon={Eye} size={16} /> View
                      </a>
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
       <div class="flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Savings</h1>
            <p class="text-slate-500">Global overview of all member deposits and withdrawals.</p>
          </div>
        </div>

        <div class="card bg-base-100 border border-base-200 shadow-sm">
          <div class="p-4 border-b border-base-200 flex flex-col md:flex-row justify-between gap-4 items-center">
            <div class="flex gap-2 w-full max-w-sm">
              <label class="input w-full">
                <Icon icon={Search} size={16} class="opacity-50" strokeWidth={2.5} />
                <input 
                  type="search" 
                  name="search"
                  placeholder="Search by member or type..." 
                  value={search}
                  hx-get="/dashboard/savings"
                  hx-trigger="keyup changed delay:500ms, search"
                  hx-target="#savings-list-container"
                  hx-swap="outerHTML"
                  hx-indicator=".htmx-indicator"
                  hx-include="[name='page']"
                />
                 <input type="hidden" name="page" value="1" />
              </label>
            </div>
          </div>
          
          <SavingsList savings={savings} page={page} totalPages={totalPages} search={search} />
        </div>
      </div>
    </DashboardLayout>
  );
}
