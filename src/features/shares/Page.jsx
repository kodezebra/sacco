import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Plus, Search, Filter, User, ChevronLeft, ChevronRight } from 'lucide';

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
          hx-get={`/dashboard/shares?page=${page - 1}&search=${search}`}
          hx-target="#shares-list-container"
          hx-swap="outerHTML"
        >
          <Icon icon={ChevronLeft} size={16} />
        </button>
        <button 
          class="join-item btn btn-sm"
          disabled={page >= totalPages}
          hx-get={`/dashboard/shares?page=${page + 1}&search=${search}`}
          hx-target="#shares-list-container"
          hx-swap="outerHTML"
        >
          <Icon icon={ChevronRight} size={16} />
        </button>
      </div>
    </div>
  );
}

export function SharesList({ shares = [], page = 1, totalPages = 1, search = "" }) {
  return (
    <div id="shares-list-container">
      <div class="overflow-x-auto min-h-[400px]">
        {shares.length === 0 ? (
          <div class="p-12 text-center text-slate-400">
            <p>No share records found.</p>
          </div>
        ) : (
          <table class="table table-zebra">
            <thead>
              <tr>
                <th>Member</th>
                <th class="text-right">Amount (UGX)</th>
                <th>Date</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shares.map((share) => (
                <tr key={share.id} class="hover">
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="avatar placeholder">
                          <div class="bg-neutral text-neutral-content rounded-full w-8">
                            <Icon icon={User} size={14} />
                          </div>
                      </div>
                      <div>
                        <div class="font-bold">{share.memberName}</div>
                        <div class="text-xs opacity-50">ID: {share.id.substring(0,8)}</div>
                      </div>
                    </div>
                  </td>
                  <td class="text-right font-medium text-slate-700">{(share.amount || 0).toLocaleString()}</td>
                  <td class="text-xs opacity-60">{share.date}</td>
                  <td class="text-right">
                    <a href={`/dashboard/members/${share.memberId}`} class="btn btn-ghost btn-xs">View Member</a>
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

export default function SharesPage({ shares = [], page = 1, totalPages = 1, search = "" }) {
  return (
    <DashboardLayout title="Shares">
       <div class="flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Shares</h1>
            <p class="text-slate-500">Manage member share capital and dividends.</p>
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
                  placeholder="Search shares..." 
                  value={search}
                  hx-get="/dashboard/shares"
                  hx-trigger="keyup changed delay:500ms, search"
                  hx-target="#shares-list-container"
                  hx-swap="outerHTML"
                  hx-indicator=".htmx-indicator"
                  hx-include="[name='page']"
                />
                 <input type="hidden" name="page" value="1" />
              </label>
            </div>
            
            <div class="flex gap-2">
               <button class="btn btn-ghost btn-sm gap-2 border-base-300">
                  <Icon icon={Filter} size={16} /> Filter
               </button>
            </div>
          </div>
          
          <SharesList shares={shares} page={page} totalPages={totalPages} search={search} />
        </div>
      </div>
    </DashboardLayout>
  );
}
