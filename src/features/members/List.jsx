import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import { Plus, Search, FileSpreadsheet, Trash2, ChevronLeft, ChevronRight, Eye, Users, Wallet, Banknote, UserPlus } from 'lucide';

const formatCompact = (val) => {
  if (!val) return '0';
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
  return val.toLocaleString();
};

export function MemberRow({ member }) {
  return (
    <tr key={member.id} class="hover group">
      <td class="py-4">
        <div class="flex items-center gap-3">
          <div class="avatar placeholder">
            <div class="bg-primary/10 text-primary font-black rounded-xl w-10 border border-primary/20">
              <span>{member.fullName[0].toUpperCase()}</span>
            </div>
          </div>
          <div>
            <div class="font-black text-slate-700 group-hover:text-primary transition-colors">{member.fullName}</div>
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{member.memberNumber}</div>
          </div>
        </div>
      </td>
      <td class="font-mono text-xs font-bold text-slate-500">{member.phone}</td>
      <td class="text-center">
        <span class={`badge badge-sm badge-outline uppercase text-[9px] font-black tracking-tighter ${member.status === 'active' ? 'badge-success text-success' : 'badge-error text-error'}`}>
          {member.status}
        </span>
      </td>
      <td class="text-[11px] font-medium text-slate-400 font-mono italic">{member.createdAt}</td>
      <td class="text-right">
        <div class="flex gap-2 justify-end items-center transition-opacity">
          <a href={`/dashboard/members/${member.id}`} class="btn btn-ghost btn-xs text-primary font-bold gap-1 px-3">
            <Icon icon={Eye} size={14} /> Profile
          </a>
          <button 
            class="btn btn-ghost btn-xs text-error btn-square"
            hx-delete={`/dashboard/members/${member.id}`}
            hx-target="closest tr"
            hx-swap="outerHTML"
            hx-confirm={`Are you sure you want to delete ${member.fullName}?`}
          >
            <Icon icon={Trash2} size={14} />
          </button>
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

export function MembersList({ members = [], page = 1, totalPages = 1, search = "" }) {
  return (
    <div id="members-list-container" class="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table w-full table-zebra">
          <thead class="bg-slate-50/50">
            <tr class="text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-100">
              <th class="py-4 px-6 font-black">Member Profile</th>
              <th class="font-black">Contact</th>
              <th class="text-center font-black">Account Status</th>
              <th class="font-black">Joined Date</th>
              <th class="text-right px-6 font-black">Quick Actions</th>
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
          
          {/* Header & Main Actions */}
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h1 class="text-3xl font-black tracking-tight text-slate-900">Member Directory</h1>
               <p class="text-slate-500 text-sm font-medium mt-1">Manage KYC profiles and financial accounts.</p>
            </div>
            <div class="flex items-center gap-3">
               <a href="/dashboard/members/export" class="btn btn-ghost btn-sm gap-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100" download>
                  <Icon icon={FileSpreadsheet} size={18} />
                  Export CSV
               </a>
               <button 
                  class="btn btn-primary btn-sm gap-2 rounded-xl shadow-lg shadow-primary/20 h-10 px-5"
                  hx-get="/dashboard/members/new"
                  hx-target="#htmx-modal-content"
                  hx-swap="innerHTML"
                  onClick="document.getElementById('htmx-modal').showModal()"
                >
                  <Icon icon={UserPlus} size={18} />
                  New Member
                </button>
            </div>
          </div>

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

          {/* Search & Filter Bar */}
          <div class="flex flex-col md:flex-row gap-4 items-center bg-base-100 p-4 rounded-2xl border border-base-200 shadow-sm">
            <div class="relative w-full">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Icon icon={Search} size={18} />
              </div>
              <input 
                type="search" 
                name="search"
                placeholder="Search by name, phone or member number..." 
                class="input bg-slate-50 border-slate-200 w-full pl-12 focus:bg-white rounded-xl text-sm font-medium"
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
          </div>
          
          <MembersList members={members} page={page} totalPages={totalPages} search={search} />
        </div>
      </div>
    </DashboardLayout>
  );
}