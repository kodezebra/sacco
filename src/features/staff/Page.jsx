import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import TableAction from '../../components/TableAction.jsx';
import { UserPlus, Users, Building2, Briefcase, Lock, UserCheck, UserCog } from 'lucide';

export default function StaffPage({ staff = [], currentUser }) {
  const totalPayroll = staff.reduce((sum, s) => sum + (s.salary || 0), 0);
  
  // Permission Logic
  const role = currentUser?.role;
  const canManageHR = ['super_admin', 'admin', 'manager'].includes(role);
  const canManageAuth = ['super_admin', 'admin'].includes(role);

  return (
    <DashboardLayout title="Human Resources">
       <div class="flex flex-col gap-8">
        {/* HR Stats */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="stats shadow border border-base-200">
            <div class="stat">
              <div class="stat-figure text-primary">
                <Icon icon={Users} size={32} />
              </div>
              <div class="stat-title text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Employees</div>
              <div class="stat-value text-primary">{staff.length}</div>
            </div>
          </div>
          
          <div class="stats shadow border border-base-200">
             <div class="stat">
              <div class="stat-figure text-secondary">
                <Icon icon={Building2} size={32} />
              </div>
              <div class="stat-title text-[10px] font-bold uppercase tracking-widest text-slate-400">Monthly Payroll</div>
              <div class="stat-value text-secondary text-2xl">{totalPayroll.toLocaleString()}</div>
              <div class="stat-desc font-medium text-slate-500">Total salary obligations</div>
            </div>
          </div>
        </div>

        {/* Staff Table Card */}
        <div class="rounded-sm border border-slate-200 bg-white shadow-sm">
          {/* Card Header */}
          <div class="flex flex-col gap-4 border-b border-slate-100 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="text-xl font-bold text-black">Staff Directory</h3>
              <p class="text-sm font-medium text-slate-500 mt-1">Manage employees across all business units.</p>
            </div>
            
            {canManageHR && (
              <button 
                class="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-opacity-90 shadow-md"
                hx-get="/dashboard/staff/new"
                hx-target="#htmx-modal-content"
                hx-swap="innerHTML"
                onClick="document.getElementById('htmx-modal').showModal()"
              >
                <Icon icon={UserPlus} size={20} />
                New
              </button>
            )}
          </div>

          <div class="overflow-x-auto">
             <table class="table w-full">
               <thead class="bg-slate-50">
                 <tr>
                   <th class="py-4 px-4 text-sm font-bold text-black uppercase">Name / Role</th>
                   <th class="py-4 px-4 text-sm font-bold text-black uppercase">Business Unit</th>
                   <th class="py-4 px-4 text-sm font-bold text-black uppercase">Status</th>
                   <th class="py-4 px-4 text-right text-sm font-bold text-black uppercase">Salary (UGX)</th>
                   <th class="py-4 px-4"></th>
                 </tr>
               </thead>
               <tbody>
                 {staff.length === 0 ? (
                   <tr><td colspan="5" class="text-center py-12 text-slate-400">No staff found. Hire someone to get started.</td></tr>
                 ) : staff.map(s => (
                   <tr key={s.id} class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                     <td class="py-4 px-4">
                       <div class="flex items-center gap-3">
                         <div>
                           <div class="font-bold flex items-center gap-2 text-black">
                             {s.fullName}
                             {s.hasAccount && (
                               <Badge type="secondary" title="Has Login Access" size="xs">
                                 <Icon icon={UserCheck} size={10} />
                               </Badge>
                             )}
                           </div>
                           <div class="text-xs opacity-60 flex items-center gap-1 text-black">
                             <Icon icon={Briefcase} size={12} />
                             {s.role}
                           </div>
                         </div>
                       </div>
                     </td>
                     <td class="py-4 px-4">
                       <Badge type="ghost" className="gap-2">
                         <Icon icon={Building2} size={12} />
                         {s.unitName}
                       </Badge>
                     </td>
                     <td class="py-4 px-4">
                       <Badge type={s.status === 'active' ? 'success' : 'ghost'}>
                         {s.status}
                       </Badge>
                     </td>
                     <td class="py-4 px-4 text-right font-mono font-bold text-black">
                       {s.salary?.toLocaleString()}
                     </td>
                     <td class="py-4 px-4 text-right">
                       <div class="flex items-center justify-end gap-2">
                            {/* User Access Controls (Admins Only) */}
                            {canManageAuth && !s.hasAccount && (
                              <TableAction 
                                label="Access"
                                icon={Lock}
                                hx-get={`/dashboard/staff/${s.id}/user`}
                                hx-target="#htmx-modal-content"
                                hx-swap="innerHTML"
                                onClick={() => document.getElementById('htmx-modal').showModal()}
                                title="Create Login Account"
                              />
                            )}
                            {canManageAuth && s.hasAccount && (
                              <TableAction 
                                label="Auth"
                                icon={UserCog}
                                hx-get={`/dashboard/staff/${s.id}/user/edit`}
                                hx-target="#htmx-modal-content"
                                hx-swap="innerHTML"
                                onClick={() => document.getElementById('htmx-modal').showModal()}
                                title="Manage User Account"
                              />
                            )}
                            
                            {/* HR Controls (Managers & Admins) */}
                            {canManageHR && (
                              <TableAction 
                                label="Edit"
                                icon={UserCog}
                                hx-get={`/dashboard/staff/${s.id}/edit`}
                                hx-target="#htmx-modal-content"
                                hx-swap="innerHTML"
                                onClick={() => document.getElementById('htmx-modal').showModal()}
                              />
                            )}
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}