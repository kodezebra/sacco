import Icon from '../../components/Icon.jsx';
import { User, X, Briefcase, Building2, Trash2 } from 'lucide';

export default function EditStaffForm({ staff, associations = [] }) {
  return (
    <div class="rounded-sm border border-stroke bg-white shadow-default">
      <div class="border-b border-stroke py-4 px-6.5 flex justify-between items-center">
        <h3 class="font-medium text-black flex items-center gap-2">
           <Icon icon={User} size={20} />
           Edit Staff Member
        </h3>
        <form method="dialog">
          <button class="hover:text-primary">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form 
        action={`/dashboard/staff/${staff.id}`} 
        method="POST" 
        class="flex flex-col gap-5.5 p-6.5"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="mb-3 block text-black font-medium text-sm">Full Name</label>
            <input 
              type="text" 
              name="fullName" 
              value={staff.fullName}
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black" 
              required 
            />
          </div>

          <div>
            <label class="mb-3 block text-black font-medium text-sm">Role / Title</label>
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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="mb-3 block text-black font-medium text-sm">Assign to Unit</label>
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
            <label class="mb-3 block text-black font-medium text-sm">Monthly Salary (UGX)</label>
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
        
        <div>
            <label class="mb-3 block text-black font-medium text-sm">Employment Status</label>
            <div class="relative z-20 bg-transparent">
                <select name="status" class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary text-black">
                   <option value="active" selected={staff.status === 'active'}>Active</option>
                   <option value="inactive" selected={staff.status === 'inactive'}>Inactive (Terminated)</option>
                   <option value="on_leave" selected={staff.status === 'on_leave'}>On Leave</option>
                </select>
            </div>
        </div>

        <div class="flex justify-between items-center mt-2">
           <button type="button" class="flex items-center gap-2 text-sm font-medium text-error hover:underline">
              <Icon icon={Trash2} size={16} />
              Terminate Record
           </button>

           <div class="flex gap-4.5">
            <button type="button" class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 hover:text-primary" onClick={() => document.getElementById('htmx-modal').close()}>
                Cancel
            </button>
            <button type="submit" class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 shadow-default">
                Save Changes
            </button>
           </div>
        </div>
      </form>
    </div>
  );
}
