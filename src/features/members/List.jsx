import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Plus, Search, FileSpreadsheet, Trash2, ChevronLeft, ChevronRight } from 'lucide';

export function MemberRow({ member }) {
  return (
    <tr key={member.id} class="hover">
      <td>
        <div class="flex items-center gap-3">
          <div class="avatar placeholder">
            <div class="bg-neutral text-neutral-content rounded-full w-8">
              <span>{member.fullName[0]}</span>
            </div>
          </div>
          <div>
            <div class="font-bold">{member.fullName}</div>
            <div class="text-xs opacity-50">{member.memberNumber}</div>
          </div>
        </div>
      </td>
      <td>{member.phone}</td>
      <td>
        <span class={`badge badge-sm ${member.status === 'active' ? 'badge-success' : 'badge-ghost'}`}>
          {member.status}
        </span>
      </td>
      <td>{member.createdAt}</td>
      <td class="text-right">
        <div class="flex gap-1 justify-end">
          <a href={`/dashboard/members/${member.id}`} class="btn btn-ghost btn-xs">View</a>
          <button 
            class="btn btn-ghost btn-xs text-error"
            hx-delete={`/dashboard/members/${member.id}`}
            hx-target="closest tr"
            hx-swap="outerHTML"
            hx-confirm={`Are you sure you want to delete ${member.fullName}?`}
          >
            <Icon icon={Trash2} size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

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
          hx-get={`/dashboard/members?page=${page - 1}&search=${search}`}
          hx-target="#members-list-container"
          hx-swap="outerHTML"
        >
          <Icon icon={ChevronLeft} size={16} />
        </button>
        <button 
          class="join-item btn btn-sm"
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
    <div id="members-list-container">
      <div class="overflow-x-auto min-h-[400px]">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>Member</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Joined</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map((member) => <MemberRow key={member.id} member={member} />)
            ) : (
              <tr>
                <td colspan="5" class="text-center py-8 text-slate-400">
                  No members found
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

export default function MembersPage({ members = [], page = 1, totalPages = 1, search = "" }) {
  return (
    <DashboardLayout title="Members">
      <div class="flex flex-col gap-8">
        <div>
           <h1 class="text-3xl font-bold tracking-tight">Members</h1>
           <p class="text-slate-500">Manage your SACCO members and their profiles.</p>
        </div>

        <div class="card bg-base-100 border border-base-200 shadow-sm">
          <div class="p-4 border-b border-base-200 flex flex-col md:flex-row justify-between gap-4 items-center">
            <div class="flex gap-2 w-full max-w-sm">
              <label class="input w-full">
                <Icon icon={Search} size={16} class="opacity-50" strokeWidth={2.5} />
                <input 
                  type="search" 
                  name="search"
                  placeholder="Search members..." 
                  value={search}
                  hx-get="/dashboard/members"
                  hx-trigger="keyup changed delay:500ms, search"
                  hx-target="#members-list-container"
                  hx-swap="outerHTML"
                  hx-indicator=".htmx-indicator"
                  hx-include="[name='page']" 
                />
                 {/* Reset page to 1 on search */}
                <input type="hidden" name="page" value="1" />
              </label>
            </div>
            
            <div class="flex gap-2">
              <a href="/dashboard/members/export" class="btn btn-ghost gap-2" download title="Export to Excel">
                <Icon icon={FileSpreadsheet} size={20} />
                Download
              </a>
              <button 
                class="btn btn-primary gap-2"
                hx-get="/dashboard/members/new"
                hx-target="#htmx-modal-content"
                hx-swap="innerHTML"
                onClick="document.getElementById('htmx-modal').showModal()"
              >
                <Icon icon={Plus} size={20} />
                New
              </button>
            </div>
          </div>
          
          <MembersList members={members} page={page} totalPages={totalPages} search={search} />
        </div>
      </div>
    </DashboardLayout>
  );
}