import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Plus, Search } from 'lucide';

export default function MembersPage({ members = [], search = "" }) {
  return (
    <DashboardLayout title="Members">
      <div class="flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Members</h1>
            <p class="text-slate-500">Manage your SACCO members and their profiles.</p>
          </div>
          <button class="btn btn-primary gap-2">
            <Icon icon={Plus} size={20} />
            Add Member
          </button>
        </div>

        <div class="card bg-base-100 border border-base-200 shadow-sm">
          <div class="p-4 border-b border-base-200">
            <label class="input w-full max-w-sm">
              <Icon icon={Search} size={16} class="opacity-50" strokeWidth={2.5} />
              <input 
                type="search" 
                placeholder="Search members..." 
                value={search}
              />
            </label>
          </div>
          
          <div class="overflow-x-auto">
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
                  members.map((member) => (
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
                        <a href={`/dashboard/members/${member.id}`} class="btn btn-ghost btn-xs">View</a>
                      </td>
                    </tr>
                  ))
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
        </div>
      </div>
    </DashboardLayout>
  );
}