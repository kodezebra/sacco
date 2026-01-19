import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import Badge from '../../components/Badge.jsx';
import TableAction from '../../components/TableAction.jsx';
import { Plus, Search, FileSpreadsheet, Trash2, ChevronLeft, ChevronRight, Eye, Users, Wallet, Banknote, UserPlus, Download, Filter } from 'lucide';

const formatCompact = (val) => {
  if (!val) return '0';
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
  return val.toLocaleString();
};

export function MemberRow({ member }) {
  const initials = member.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || '?';
  
  return (
    <tr key={member.id} class="border-b border-stroke hover:bg-whiten transition-colors group cursor-pointer" onclick={`window.location.href='/dashboard/members/${member.id}'`}>
      <td class="py-5 px-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-whiten text-xs font-bold text-body group-hover:bg-primary group-hover:text-white transition-colors">
            {initials}
          </div>
          <div>
            <h5 class="font-medium text-black">{member.fullName}</h5>
            <p class="text-xs font-bold text-bodydark2 uppercase tracking-widest">{member.memberNumber}</p>
          </div>
        </div>
      </td>
      <td class="py-5 px-4">
        <p class="text-sm text-black">{member.phone}</p>
      </td>
      <td class="py-5 px-4">
        <Badge type={member.status === 'active' ? 'success' : 'error'}>
          {member.status}
        </Badge>
      </td>
      <td class="hidden lg:table-cell py-5 px-4">
        <p class="text-sm text-black">{member.createdAt}</p>
      </td>
      <td class="sticky right-0 bg-white group-hover:bg-whiten transition-colors py-5 px-4 z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.02)]" onclick="event.stopPropagation()">
        <div class="flex items-center justify-end space-x-3.5">
          <TableAction 
            href={`/dashboard/members/${member.id}`} 
            icon={Eye} 
          />
          <TableAction 
            variant="danger"
            icon={Trash2}
            hx-delete={`/dashboard/members/${member.id}`}
            hx-target="body"
            hx-push-url="true"
            hx-confirm={`Are you sure you want to permanently delete member: ${member.fullName}?`}
          />
        </div>
      </td>
    </tr>
  );
}

export function Pagination({ page, totalPages, search, status = "" }) {
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
          hx-get={`/dashboard/members?page=${page - 1}&search=${search}&status=${status}`}
          hx-target="#members-list-container"
          hx-swap="outerHTML"
        >
          <Icon icon={ChevronLeft} size={16} />
        </button>
        <button 
          class="join-item btn btn-xs h-9 px-4 bg-white hover:bg-gray-2 text-black border-none"
          disabled={page >= totalPages}
          hx-get={`/dashboard/members?page=${page + 1}&search=${search}&status=${status}`}
          hx-target="#members-list-container"
          hx-swap="outerHTML"
        >
          <Icon icon={ChevronRight} size={16} />
        </button>
      </div>
    </div>
  );
}

export function MembersList({ members = [], page = 1, totalPages = 1, search = "", status = "", stats }) {
  return (
    <div id="members-list-container" class="rounded-sm border border-stroke bg-white shadow-default">
      {/* Refined Header */}
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-stroke px-6 py-4.5">
        
        {/* Left Side: Search & Filters */}
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-bodydark2">
              <Icon icon={Search} size={18} />
            </span>
            <input 
              type="search" 
              name="search"
              placeholder="Search members..." 
              class="w-full rounded-sm border border-stroke bg-whiten py-2 pl-10 pr-10 text-sm font-medium text-black focus:border-primary focus:outline-none md:w-64"
              value={search}
              hx-get="/dashboard/members"
              hx-trigger="keyup changed delay:500ms, search"
              hx-target="#members-list-container"
              hx-swap="outerHTML"
              hx-indicator="#search-indicator"
              hx-include="[name='page'], [name='status']" 
            />
            <div id="search-indicator" class="htmx-indicator absolute right-3 top-1/2 -translate-y-1/2">
               <div class="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          </div>

          <div class="relative">
            <select 
              name="status"
              class="appearance-none rounded-sm border border-stroke bg-whiten py-2 pl-4 pr-10 text-sm font-medium text-black focus:border-primary outline-none"
              hx-get="/dashboard/members"
              hx-target="#members-list-container"
              hx-swap="outerHTML"
              hx-include="[name='search'], [name='page']"
            >
              <option value="">All Statuses</option>
              <option value="active" selected={status === 'active'}>Active</option>
              <option value="inactive" selected={status === 'inactive'}>Inactive</option>
            </select>
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-bodydark2 pointer-events-none">
              <Icon icon={Filter} size={14} />
            </span>
          </div>
          
          <input type="hidden" name="page" value="1" />
        </div>
        
        {/* Right Side: Global Actions */}
        <div class="flex flex-wrap items-center gap-3">
          <a 
            href="/dashboard/members/export-form"
            class="inline-flex items-center gap-2 rounded-sm border border-stroke bg-white px-4 py-2.5 text-sm font-bold text-black hover:text-primary hover:border-primary transition-colors shadow-sm uppercase tracking-widest text-xs"
          >
            <Icon icon={Download} size={18} />
            <span>Export</span>
          </a>

          <a 
            href="/dashboard/members/new"
            class="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-opacity-90 shadow-default transition-all active:scale-95 uppercase tracking-widest text-xs"
          >
            <Icon icon={UserPlus} size={18} />
            <span>New Member</span>
          </a>
        </div>
      </div>

      <div class="max-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-stroke">
        <table class="w-full table-auto border-collapse">
          <thead>
            <tr class="bg-gray-2 text-left">
              <th class="min-w-[220px] py-4 px-4 font-bold text-black text-sm uppercase">Member</th>
              <th class="min-w-[150px] py-4 px-4 font-bold text-black text-sm uppercase">Contact</th>
              <th class="min-w-[120px] py-4 px-4 font-bold text-black text-sm uppercase">Status</th>
              <th class="hidden lg:table-cell py-4 px-4 font-bold text-black text-sm uppercase">Joined</th>
              <th class="sticky right-0 bg-gray-2 py-4 px-4 text-right font-bold text-black text-sm uppercase z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.02)]">Actions</th>
            </tr>
          </thead>
          <tbody id="members-table-body">
            {members.length > 0 ? (
              members.map((member) => (
                <tr key={member.id} class="border-b border-stroke hover:bg-whiten transition-colors group">
                  <td class="py-5 px-4">
                    <h5 class="font-medium text-black">{member.fullName}</h5>
                    <p class="text-xs font-bold text-bodydark2 uppercase tracking-widest">{member.memberNumber}</p>
                  </td>
                  <td class="py-5 px-4">
                    <p class="text-sm text-black">{member.phone}</p>
                  </td>
                  <td class="py-5 px-4">
                    <Badge type={member.status === 'active' ? 'success' : 'error'}>
                      {member.status}
                    </Badge>
                  </td>
                  <td class="hidden lg:table-cell py-5 px-4">
                    <p class="text-sm text-black">{member.createdAt}</p>
                  </td>
                  <td class="sticky right-0 bg-white group-hover:bg-whiten transition-colors py-5 px-4 z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.02)]">
                    <div class="flex items-center justify-end space-x-3.5">
                      <TableAction 
                        href={`/dashboard/members/${member.id}`} 
                        icon={Eye} 
                      />
                      <TableAction 
                        variant="danger"
                        icon={Trash2}
                        hx-delete={`/dashboard/members/${member.id}`}
                        hx-target="closest tr"
                        hx-swap="outerHTML"
                        hx-confirm={`Are you sure?`}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colspan="5" class="text-center py-24 bg-gray-2/30">
                  <div class="flex flex-col items-center gap-2">
                    <Icon icon={Users} size={48} class="text-bodydark2 opacity-20" />
                    <p class="text-body italic text-sm">No members found in directory</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} search={search} />
    </div>
  );
}


// Export MemberRow for individual row updates if needed
export { MembersList as MembersTable }; 

export default function MembersPage({ members = [], page = 1, totalPages = 1, search = "", stats }) {
  return (
    <DashboardLayout title="Member Directory">
      <div class="max-w-full overflow-x-hidden">
        <div class="flex flex-col gap-8 pb-12">
          
          {/* Directory Stats Row */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              label="Total Population" 
              value={stats?.totalMembers || 0} 
              subtitle="Registered members" 
              icon={Users} 
              colorClass="text-primary" 
            />
            <StatsCard 
              label="Growth (Monthly)" 
              value={stats?.newMembers || 0} 
              subtitle="Joined this month" 
              icon={UserPlus} 
              colorClass="text-secondary" 
            />
            <StatsCard 
              label="Aggregated Savings" 
              value={formatCompact(stats?.totalSavings)} 
              subtitle="Total liquidity" 
              icon={Wallet} 
              colorClass="text-success" 
            />
            <StatsCard 
              label="Active Exposure" 
              value={formatCompact(stats?.totalLoans)} 
              subtitle="Outstanding credit" 
              icon={Banknote} 
              colorClass="text-error" 
            />
          </div>
          
          <MembersList members={members} page={page} totalPages={totalPages} search={search} stats={stats} />
        </div>
      </div>
    </DashboardLayout>
  );
}