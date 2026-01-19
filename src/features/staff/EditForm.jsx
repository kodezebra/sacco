import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { User, ArrowLeft, Briefcase, Building2, Trash2, Check } from 'lucide';

export default function EditStaffPage({ staff, associations = [] }) {
  return (
    <DashboardLayout title={`Edit: ${staff.fullName}`}>
      <div class="mx-auto max-w-270">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-title-md2 font-bold text-black uppercase tracking-tight">Staff Profile</h2>
          <nav>
            <ol class="flex items-center gap-2">
              <li><a class="font-medium" href="/dashboard/staff">Staff /</a></li>
              <li class="font-medium text-primary">Edit Record</li>
            </ol>
          </nav>
        </div>

        <div class="grid grid-cols-1 gap-9">
          <div class="rounded-sm border border-stroke bg-white shadow-default">
            <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50 flex justify-between items-center">
              <h3 class="font-bold text-black flex items-center gap-2 text-sm uppercase">
                <Icon icon={User} size={18} />
                Employment Details
              </h3>
              <Badge type={staff.status === 'active' ? 'success' : 'ghost'}>{staff.status}</Badge>
            </div>

            <form action={`/dashboard/staff/${staff.id}`} method="POST" class="p-6.5">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="mb-3 block text-black font-medium text-sm uppercase tracking-wide">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={staff.fullName}
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black" 
                    required 
                  />
                </div>

                <div>
                  <label class="mb-3 block text-black font-medium text-sm uppercase tracking-wide">Role / Title</label>
                  <div class="relative">
                    <input 
                      type="text" 
                      name="role" 
                      value={staff.role}
                      class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-11 font-medium outline-none transition focus:border-primary active:border-primary text-black" 
                      required 
                    />
                    <span class="absolute left-4 top-1/2 -translate-y-1/2">
                        <Icon icon={Briefcase} size={18} class="text-body" />
                    </span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="mb-3 block text-black font-medium text-sm uppercase tracking-wide">Assign to Unit</label>
                  <div class="relative z-20 bg-transparent">
                    <select name="associationId" class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 pl-11 outline-none transition focus:border-primary active:border-primary text-black" required>
                      {associations.map(assoc => (
                        <option key={assoc.id} value={assoc.id} selected={assoc.id === staff.associationId}>{assoc.name} ({assoc.type})</option>
                      ))}
                    </select>
                    <span class="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                        <Icon icon={Building2} size={18} class="text-body" />
                    </span>
                  </div>
                </div>

                <div>
                  <label class="mb-3 block text-black font-medium text-sm uppercase tracking-wide">Monthly Salary (UGX)</label>
                  <input 
                    type="number" 
                    name="salary" 
                    value={staff.salary}
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-bold outline-none transition focus:border-primary active:border-primary text-black" 
                    required 
                    min="0"
                  />
                </div>
              </div>

              <div class="mb-8">
                  <label class="mb-3 block text-black font-medium text-sm uppercase tracking-wide">Employment Status</label>
                  <div class="relative z-20 bg-transparent">
                      <select name="status" class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary text-black">
                        <option value="active" selected={staff.status === 'active'}>Active</option>
                        <option value="inactive" selected={staff.status === 'inactive'}>Inactive (Terminated)</option>
                        <option value="on_leave" selected={staff.status === 'on_leave'}>On Leave</option>
                      </select>
                  </div>
              </div>

              <div class="flex justify-between items-center border-t border-stroke pt-6">
                <button type="button" class="flex items-center gap-2 text-sm font-bold text-error hover:underline uppercase tracking-widest">
                    <Icon icon={Trash2} size={16} />
                    Terminate Record
                </button>

                <div class="flex gap-4">
                  <a href="/dashboard/staff" class="flex justify-center rounded border border-stroke py-3 px-8 font-medium text-black hover:shadow-1 transition">
                      Cancel
                  </a>
                  <button type="submit" class="flex justify-center rounded bg-primary py-3 px-10 font-bold text-white hover:bg-opacity-90 shadow-default uppercase tracking-widest">
                      Update Record
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Badge({ children, type }) {
  const styles = {
    success: "bg-success/10 text-success",
    ghost: "bg-gray-2 text-body"
  };
  return (
    <span class={`rounded-full py-1 px-3 text-xs font-bold uppercase tracking-wider ${styles[type] || styles.ghost}`}>
      {children}
    </span>
  );
}