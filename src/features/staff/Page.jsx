import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import TableAction from '../../components/TableAction.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { UserPlus, Users, Building2, Briefcase, Lock, UserCheck, UserCog, ShieldCheck } from 'lucide';

export default function StaffPage({ staff = [], currentUser }) {
  const totalPayroll = staff.reduce((sum, s) => sum + (s.salary || 0), 0);
  
  // Permission Logic
  const role = currentUser?.role;
  const canManageHR = ['super_admin', 'admin', 'manager'].includes(role);
  const canManageAuth = ['super_admin', 'admin'].includes(role);

  return (
    <DashboardLayout title="Staff">
       <div class="flex flex-col gap-6">
        <PageHeader 
          title="Staff Directory"
          subtitle="Manage employee records, roles and security access."
          breadcrumbs={[{ label: 'Staff', href: '/dashboard/staff', active: true }]}
          actions={canManageHR && (
            <a 
              href="/dashboard/staff/bulk"
              class="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-opacity-90 shadow-default transition-all uppercase tracking-widest"
            >
              <Icon icon={Users} size={20} />
              Bulk Hire
            </a>
          )}
        />

        {/* HR Stats */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
          <StatsCard 
            label="Total Employees" 
            value={staff.length} 
            icon={Users} 
            colorClass="text-primary" 
          />
          <StatsCard 
            label="Monthly Payroll" 
            value={totalPayroll.toLocaleString()} 
            icon={Building2} 
            colorClass="text-secondary" 
            subtitle="UGX total obligations"
          />
        </div>

        {/* Staff Table Card */}
        <div class="rounded-sm border border-stroke bg-white shadow-default">
          <div class="max-w-full overflow-x-auto">
             <table class="w-full table-auto">
               <thead>
                 <tr class="bg-gray-2 text-left">
                   <th class="min-w-[220px] py-4 px-4 font-bold text-black text-sm uppercase">Employee</th>
                   <th class="min-w-[150px] py-4 px-4 font-bold text-black text-sm uppercase">Business Unit</th>
                   <th class="min-w-[120px] py-4 px-4 font-bold text-black text-sm uppercase">Status</th>
                   <th class="py-4 px-4 text-right font-bold text-black text-sm uppercase">Salary</th>
                   <th class="py-4 px-4"></th>
                 </tr>
               </thead>
               <tbody>
                 {staff.length === 0 ? (
                   <tr><td colspan="5" class="text-center py-10 text-body italic">No staff found in directory.</td></tr>
                 ) : staff.map((s) => (
                   <tr key={s.id} class="border-b border-stroke hover:bg-whiten transition-colors">
                     <td class="py-5 px-4">
                        <div class="flex items-center gap-2">
                           <h5 class="font-medium text-black">{s.fullName}</h5>
                           {s.hasAccount && (
                             <Badge type="secondary" size="xs">
                               <Icon icon={UserCheck} size={10} />
                             </Badge>
                           )}
                        </div>
                        <p class="text-xs text-body flex items-center gap-1 mt-0.5">
                           <Icon icon={Briefcase} size={12} />
                           {s.role}
                        </p>
                     </td>
                     <td class="py-5 px-4">
                       <Badge type="ghost">
                         {s.unitName}
                       </Badge>
                     </td>
                     <td class="py-5 px-4">
                       <Badge type={s.status === 'active' ? 'success' : 'ghost'}>
                         {s.status}
                       </Badge>
                     </td>
                     <td class="py-5 px-4 text-right">
                        <p class="text-sm font-bold text-black">{s.salary?.toLocaleString()} <span class="text-xs text-body font-normal">UGX</span></p>
                     </td>
                     <td class="py-5 px-4">
                       <div class="flex items-center justify-end space-x-3.5">
                            {/* User Access Controls (Security Context) */}
                            {canManageAuth && !s.hasAccount && (
                              <TableAction 
                                icon={Lock}
                                href={`/dashboard/staff/${s.id}/user`}
                                className="!bg-neutral !text-white !border-neutral hover:!bg-opacity-90"
                                title="Grant Access"
                              />
                            )}
                            {canManageAuth && s.hasAccount && (
                              <TableAction 
                                icon={ShieldCheck}
                                href={`/dashboard/staff/${s.id}/user/edit`}
                                className="!bg-neutral !text-white !border-neutral hover:!bg-opacity-90"
                                title="Security"
                              />
                            )}
                            
                            {/* HR Controls (Employment Context) */}
                            {canManageHR && (
                              <TableAction 
                                icon={UserCog}
                                href={`/dashboard/staff/${s.id}/edit`}
                                title="Edit Profile"
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