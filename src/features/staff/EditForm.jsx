import Icon from '../../components/Icon.jsx';
import { User, X, Briefcase, Building2, Trash2 } from 'lucide';

export default function EditStaffForm({ staff, associations = [] }) {
  return (
    <div class="p-0">
      <div class="bg-base-200 p-8 flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-bold flex items-center gap-2">
            <Icon icon={User} size={24} />
            Edit Staff Member
          </h2>
          <p class="text-base-content/70 text-sm mt-1">Update employment details</p>
        </div>
        <form method="dialog">
          <button class="btn btn-circle btn-ghost btn-sm">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form 
        action={`/dashboard/staff/${staff.id}`} 
        method="POST" 
        class="p-8 flex flex-col gap-6"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-bold uppercase tracking-wider text-xs">Full Name</span>
            </label>
            <input 
              type="text" 
              name="fullName" 
              value={staff.fullName}
              class="input input-bordered focus:input-primary w-full" 
              required 
            />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-bold uppercase tracking-wider text-xs">Role / Title</span>
            </label>
            <label class="input-group">
              <span><Icon icon={Briefcase} size={16} /></span>
              <input 
                type="text" 
                name="role" 
                value={staff.role}
                class="input input-bordered focus:input-primary w-full" 
                required 
              />
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-bold uppercase tracking-wider text-xs">Assign to Unit</span>
            </label>
            <div class="input-group">
               <span><Icon icon={Building2} size={16} /></span>
               <select name="associationId" class="select select-bordered focus:select-primary w-full" required>
                 {associations.map(assoc => (
                   <option key={assoc.id} value={assoc.id} selected={assoc.id === staff.associationId}>{assoc.name} ({assoc.type})</option>
                 ))}
               </select>
            </div>
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-bold uppercase tracking-wider text-xs">Monthly Salary (UGX)</span>
            </label>
            <input 
              type="number" 
              name="salary" 
              value={staff.salary}
              class="input input-bordered focus:input-primary w-full font-mono" 
              required 
              min="0"
            />
          </div>
        </div>
        
        <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-bold uppercase tracking-wider text-xs">Status</span>
            </label>
            <select name="status" class="select select-bordered w-full">
               <option value="active" selected={staff.status === 'active'}>Active</option>
               <option value="inactive" selected={staff.status === 'inactive'}>Inactive (Terminated)</option>
               <option value="on_leave" selected={staff.status === 'on_leave'}>On Leave</option>
            </select>
        </div>

        <div class="flex justify-between mt-4">
           {/* Delete Button (could use hx-delete but simple method override or specific endpoint is easier without JS setup) */}
           <button type="button" class="btn btn-ghost text-error gap-2 hover:bg-error/10">
              <Icon icon={Trash2} size={16} />
              Terminate
           </button>

           <div class="flex gap-3">
            <form method="dialog">
                <button class="btn btn-ghost">Cancel</button>
            </form>
            <button type="submit" class="btn btn-primary px-8">
                Save Changes
            </button>
           </div>
        </div>
      </form>
    </div>
  );
}
