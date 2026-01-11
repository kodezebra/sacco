import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Search, Filter, Banknote, User, Eye, ChevronLeft, ChevronRight } from 'lucide';

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
          hx-get={`/dashboard/loans?page=${page - 1}&search=${search}`}
          hx-target="#loans-list-container"
          hx-swap="outerHTML"
        >
          <Icon icon={ChevronLeft} size={16} />
        </button>
        <button 
          class="join-item btn btn-sm"
          disabled={page >= totalPages}
          hx-get={`/dashboard/loans?page=${page + 1}&search=${search}`}
          hx-target="#loans-list-container"
          hx-swap="outerHTML"
        >
          <Icon icon={ChevronRight} size={16} />
        </button>
      </div>
    </div>
  );
}

export function LoansList({ loans = [], page = 1, totalPages = 1, search = "" }) {
  return (
    <div id="loans-list-container">
      <div class="overflow-x-auto min-h-[400px]">
        {loans.length === 0 ? (
          <div class="p-12 text-center text-slate-400">
            <p>No loans found.</p>
          </div>
        ) : (
          <table class="table table-sm table-zebra w-full">
            <thead class="bg-base-200">
              <tr>
                <th>Member</th>
                <th class="text-right">Principal (UGX)</th>
                <th class="text-right">Interest</th>
                <th class="text-right">Term</th>
                <th class="text-center">Status</th>
                <th>Issued</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} class="hover">
                  <td>
                    <div>
                      <div class="font-bold">{loan.memberName}</div>
                      <div class="text-[10px] opacity-50">ID: {loan.id.substring(0,8)}</div>
                    </div>
                  </td>
                  <td class="text-right font-mono font-medium tracking-tight text-slate-700">{(loan.principal || 0).toLocaleString()}</td>
                  <td class="text-right">{loan.interestRate}%</td>
                  <td class="text-right">{loan.durationMonths} Mo</td>
                  <td class="text-center">
                    <span class={`badge badge-sm badge-soft uppercase text-[10px] font-bold tracking-wider ${loan.status === 'active' ? 'badge-info' : 'badge-success'}`}>
                      {loan.status}
                    </span>
                  </td>
                  <td class="text-xs opacity-60">{loan.issuedDate}</td>
                  <td class="text-right">
                    <div class="flex justify-end gap-2">
                      {loan.status === 'active' && (
                        <button 
                          class="btn btn-sm btn-outline btn-success gap-2 font-medium"
                          hx-get={`/dashboard/members/${loan.memberId}/loans/${loan.id}/pay`}
                          hx-target="#htmx-modal-content"
                          hx-swap="innerHTML"
                          onClick="document.getElementById('htmx-modal').showModal()"
                        >
                          <Icon icon={Banknote} size={16} /> Pay
                        </button>
                      )}
                      <a href={`/dashboard/members/${loan.memberId}`} class="btn btn-outline btn-sm gap-2 font-medium">
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

// Export for backward compat if needed (though we updated usage)
export { LoansList as LoansTable };

export default function LoansPage({ loans = [], page = 1, totalPages = 1, search = "" }) {
  return (
    <DashboardLayout title="Loans Management">
       <div class="flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Loans Management</h1>
            <p class="text-slate-500">Overview of all member loans and repayment statuses.</p>
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
                  placeholder="Search loans..." 
                  value={search}
                  hx-get="/dashboard/loans"
                  hx-trigger="keyup changed delay:500ms, search"
                  hx-target="#loans-list-container"
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
          
          <LoansList loans={loans} page={page} totalPages={totalPages} search={search} />
        </div>
      </div>
    </DashboardLayout>
  );
}
