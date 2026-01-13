import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import Badge from '../../components/Badge.jsx';
import TableAction from '../../components/TableAction.jsx';
import { Plus, Search, FileSpreadsheet, Trash2, ChevronLeft, ChevronRight, Eye, Users, Wallet, Banknote, UserPlus } from 'lucide';

const formatCompact = (val) => {
  if (!val) return '0';
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
  return val.toLocaleString();
};

export function MemberRow({ member }) {
  return (
    <tr key={member.id} class="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
      <td class="py-4 px-4">
        <div class="flex items-center gap-3">
          <div>
            <div class="font-black text-slate-700 group-hover:text-primary transition-colors">{member.fullName}</div>
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{member.memberNumber}</div>
          </div>
        </div>
      </td>
      <td class="py-4 px-4 font-mono text-xs font-bold text-slate-500">{member.phone}</td>
      <td class="py-4 px-4 text-center">
        <Badge type={member.status === 'active' ? 'success' : 'error'}>
          {member.status}
        </Badge>
      </td>
      <td class="py-4 px-4 text-[11px] font-medium text-slate-400 font-mono italic">{member.createdAt}</td>
      <td class="py-4 px-4 text-right">
        <div class="flex gap-2 justify-end items-center transition-opacity">
          <TableAction 
            label="Profile" 
            href={`/dashboard/members/${member.id}`} 
            icon={Eye} 
          />
          <TableAction 
            variant="danger"
            icon={Trash2}
            hx-delete={`/dashboard/members/${member.id}`}
            hx-target="closest tr"
            hx-swap="outerHTML"
            hx-confirm={`Are you sure you want to delete ${member.fullName}?`}
          />
        </div>
      </td>
    </tr>
  );
}

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
          hx-get={`/dashboard/members?page=${page - 1}&search=${search}`}
          hx-target="#members-list-container"
          hx-swap="outerHTML"
        >
          <Icon icon={ChevronLeft} size={16} />
        </button>
        <button 
          class="join-item btn btn-xs h-10 px-4 bg-base-100 hover:bg-base-200 border-none"
          disabled={page >= totalPages}
          hx-get={`/dashboard/members?page=${page + 1}&search=${search}`}
          hx-target="#members-list-container"
          hx-swap="outerHTML"
        >
          <Icon icon={ChevronRight} size={16} />
        </button>
      </div>
    </div>
  );
}

export function MembersList({ members = [], page = 1, totalPages = 1, search = "", stats }) {
  return (
    <div id="members-list-container" class="rounded-sm border border-slate-200 bg-white shadow-sm">
      {/* Card Header */}
      <div class="flex flex-col gap-4 border-b border-slate-100 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="text-xl font-bold text-black">Member Directory</h3>
          <p class="text-sm font-medium text-slate-500 mt-1">Manage KYC profiles and financial accounts.</p>
        </div>
        
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative">
            <button class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon icon={Search} size={18} />
            </button>
            <input 
              type="search" 
              name="search"
              placeholder="Search members..." 
              class="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm font-medium text-black focus:border-primary focus:outline-none xl:w-72"
              value={search}
              hx-get="/dashboard/members"
              hx-trigger="keyup changed delay:500ms, search"
              hx-target="#members-list-container"
              hx-swap="outerHTML"
              hx-indicator=".htmx-indicator"
              hx-include="[name='page']" 
            />
            <input type="hidden" name="page" value="1" />
          </div>

          <a href="/dashboard/members/export" class="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary hover:border-primary" download>
            <Icon icon={FileSpreadsheet} size={18} />
            <span class="hidden lg:inline">Export</span>
          </a>

          <button 
            class="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-opacity-90 shadow-md"
            hx-get="/dashboard/members/new"
            hx-target="#htmx-modal-content"
            hx-swap="innerHTML"
            onClick="document.getElementById('htmx-modal').showModal()"
          >
            <Icon icon={UserPlus} size={18} />
            New
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead class="bg-slate-50">
            <tr>
              <th class="py-4 px-4 text-sm font-bold text-black uppercase">Member Profile</th>
              <th class="py-4 px-4 text-sm font-bold text-black uppercase">Contact</th>
              <th class="py-4 px-4 text-center text-sm font-bold text-black uppercase">Account Status</th>
              <th class="py-4 px-4 text-sm font-bold text-black uppercase">Joined Date</th>
              <th class="py-4 px-4 text-right text-sm font-bold text-black uppercase">Quick Actions</th>
            </tr>
          </thead>
          <tbody id="members-table-body">
            {members.length > 0 ? (
              members.map((member) => <MemberRow key={member.id} member={member} />)
            ) : (
              <tr>
                <td colspan="5" class="text-center py-20 text-slate-400 italic">
                  No members found in directory
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