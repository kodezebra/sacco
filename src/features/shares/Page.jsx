import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import TableAction from '../../components/TableAction.jsx';
import { Search, Filter, Eye, ChevronLeft, ChevronRight } from 'lucide';

export function Pagination({ page, totalPages, search }) {
  if (totalPages <= 1) return null;

  return (
    <div class="flex justify-between items-center p-6 border-t border-stroke bg-gray-2">
      <div class="text-[10px] font-bold text-bodydark2 uppercase tracking-widest">
        Page {page} of {totalPages}
      </div>
      <div class="join border border-stroke overflow-hidden rounded-sm">
        <button 
          class="join-item btn btn-xs h-9 px-4 bg-white hover:bg-gray-2 text-black border-none" 
          disabled={page <= 1}
          hx-get={`/dashboard/shares?page=${page - 1}&search=${search}`}
          hx-target="#shares-list-container"
          hx-swap="outerHTML"
        >
          <Icon icon={ChevronLeft} size={16} />
        </button>
        <button 
          class="join-item btn btn-xs h-9 px-4 bg-white hover:bg-gray-2 text-black border-none"
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
    <div id="shares-list-container" class="rounded-sm border border-stroke bg-white shadow-default">
      {/* Card Header */}
      <div class="flex flex-col gap-4 border-b border-stroke px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="text-xl font-bold text-black">Shares Ledger</h3>
        </div>
        
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative">
            <button class="absolute left-3 top-1/2 -translate-y-1/2 text-bodydark2">
              <Icon icon={Search} size={18} />
            </button>
            <input 
              type="search" 
              name="search"
              placeholder="Search shares..." 
              class="w-full rounded-sm border border-stroke bg-whiten py-2 pl-10 pr-4 text-sm font-medium text-black focus:border-primary focus:outline-none xl:w-72"
              value={search}
              hx-get="/dashboard/shares"
              hx-trigger="keyup changed delay:500ms, search"
              hx-target="#shares-list-container"
              hx-swap="outerHTML"
              hx-indicator=".htmx-indicator"
              hx-include="[name='page']"
            />
            <input type="hidden" name="page" value="1" />
          </div>

          <button class="inline-flex items-center gap-2 rounded-sm border border-stroke bg-white px-4 py-2 text-sm font-medium text-black hover:text-primary hover:border-primary">
            <Icon icon={Filter} size={16} />
            Filter
          </button>
        </div>
      </div>

      <div class="max-w-full overflow-x-auto min-h-[400px]">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-2 text-left">
              <th class="min-w-[220px] py-4 px-4 font-bold text-black text-sm uppercase">Member</th>
              <th class="min-w-[150px] py-4 px-4 text-right font-bold text-black text-sm uppercase">Amount</th>
              <th class="py-4 px-4 font-bold text-black text-sm uppercase">Date</th>
              <th class="py-4 px-4 text-right font-bold text-black text-sm uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shares.length === 0 ? (
              <tr>
                <td colspan="4" class="text-center py-10 text-body italic">
                  No share records found.
                </td>
              </tr>
            ) : (
              shares.map((share) => (
                <tr key={share.id} class="border-b border-stroke hover:bg-whiten transition-colors">
                  <td class="py-5 px-4">
                    <h5 class="font-medium text-black">{share.memberName}</h5>
                    <p class="text-xs font-bold text-bodydark2 uppercase tracking-widest">ID: {share.id.substring(0,8)}</p>
                  </td>
                  <td class="py-5 px-4 text-right">
                    <p class="text-sm font-bold text-black">{(share.amount || 0).toLocaleString()} <span class="text-xs text-body font-normal">UGX</span></p>
                  </td>
                  <td class="py-5 px-4 text-sm text-black">{share.date}</td>
                  <td class="py-5 px-4">
                    <div class="flex items-center justify-end space-x-3.5">
                      <TableAction 
                        icon={Eye}
                        href={`/dashboard/members/${share.memberId}`}
                        title="View Profile"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} search={search} />
    </div>
  );
}

export default function SharesPage({ shares = [], page = 1, totalPages = 1, search = "" }) {
  return (
    <DashboardLayout title="Shares Ledger">
       <div class="flex flex-col gap-6">
          <SharesList shares={shares} page={page} totalPages={totalPages} search={search} />
       </div>
    </DashboardLayout>
  );
}
