import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { UserPlus, Users, Building2, Briefcase } from 'lucide';

export default function StaffPage({ staff = [] }) {
  const totalPayroll = staff.reduce((sum, s) => sum + (s.salary || 0), 0);

  return (
    <DashboardLayout title="Human Resources">
       <div class="flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Staff Directory</h1>
            <p class="text-slate-500">Manage employees across all business units.</p>
          </div>
          <button 
            class="btn btn-primary gap-2"
            hx-get="/dashboard/staff/new"
            hx-target="#htmx-modal-content"
            hx-swap="innerHTML"
            onClick="document.getElementById('htmx-modal').showModal()"
          >
            <Icon icon={UserPlus} size={20} />
            Hire Staff
          </button>
        </div>

        {/* HR Stats */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="stats shadow border border-base-200">
            <div class="stat">
              <div class="stat-figure text-primary">
                <Icon icon={Users} size={32} />
              </div>
              <div class="stat-title">Total Employees</div>
              <div class="stat-value text-primary">{staff.length}</div>
            </div>
          </div>
          
          <div class="stats shadow border border-base-200">
             <div class="stat">
              <div class="stat-figure text-secondary">
                <Icon icon={Building2} size={32} />
              </div>
              <div class="stat-title">Monthly Payroll</div>
              <div class="stat-value text-secondary text-2xl">{totalPayroll.toLocaleString()}</div>
              <div class="stat-desc">Total salary obligations</div>
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div class="card bg-base-100 border border-base-200 shadow-sm">
          <div class="card-body p-0">
             <div class="overflow-x-auto">
               <table class="table">
                 <thead>
                   <tr>
                     <th>Name / Role</th>
                     <th>Business Unit</th>
                     <th>Status</th>
                     <th class="text-right">Salary (UGX)</th>
                     <th></th>
                   </tr>
                 </thead>
                 <tbody>
                   {staff.length === 0 ? (
                     <tr><td colspan="5" class="text-center py-12 text-slate-400">No staff found. Hire someone to get started.</td></tr>
                   ) : staff.map(s => (
                     <tr key={s.id} class="hover">
                       <td>
                         <div class="flex items-center gap-3">
                           <div class="avatar placeholder">
                             <div class="bg-neutral-focus text-neutral-content rounded-full w-10">
                               <span class="text-xs">{s.fullName.substring(0,2).toUpperCase()}</span>
                             </div>
                           </div>
                           <div>
                             <div class="font-bold">{s.fullName}</div>
                             <div class="text-xs opacity-60 flex items-center gap-1">
                               <Icon icon={Briefcase} size={12} />
                               {s.role}
                             </div>
                           </div>
                         </div>
                       </td>
                       <td>
                         <div class="badge badge-outline gap-2">
                           <Icon icon={Building2} size={12} />
                           {s.unitName}
                         </div>
                       </td>
                       <td>
                         <div class={`badge badge-xs ${s.status === 'active' ? 'badge-success' : 'badge-ghost'}`}>
                           {s.status}
                         </div>
                       </td>
                       <td class="text-right font-mono font-bold">
                         {s.salary?.toLocaleString()}
                       </td>
                       <td class="text-right">
                         <button 
                           class="btn btn-ghost btn-xs"
                           hx-get={`/dashboard/staff/${s.id}/edit`}
                           hx-target="#htmx-modal-content"
                           hx-swap="innerHTML"
                           onClick="document.getElementById('htmx-modal').showModal()"
                         >
                           Edit
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}