import Icon from '../../components/Icon.jsx';
import { UserPlus, X, Briefcase, Building2 } from 'lucide';

export default function NewStaffForm({ associations = [] }) {
  return (
    <div class="p-0">
      <div class="bg-primary p-8 text-primary-content flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-bold flex items-center gap-2">
            <Icon icon={UserPlus} size={24} />
            Hire New Staff
          </h2>
          <p class="text-primary-content/70 text-sm mt-1">Add an employee to a Business Unit</p>
        </div>
        <form method="dialog">
          <button class="btn btn-circle btn-ghost btn-sm">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form 
        action="/dashboard/staff" 
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
              placeholder="e.g. John Doe" 
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
                placeholder="e.g. Farm Manager" 
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
                 <option value="" disabled selected>Select Association / Unit...</option>
                 
                 {/* Administrative Units */}
                 <optgroup label="Administrative (Sacco HQ)">
                   {associations.filter(a => a.type === 'department').map(assoc => (
                     <option key={assoc.id} value={assoc.id}>{assoc.name}</option>
                   ))}
                 </optgroup>

                 {/* Associations / Projects */}
                 <optgroup label="Associations (Projects)">
                   {associations.filter(a => a.type !== 'department').map(assoc => (
                     <option key={assoc.id} value={assoc.id}>{assoc.name} ({assoc.type})</option>
                   ))}
                 </optgroup>
               </select>
            </div>
            <label class="label">
              <span class="label-text-alt text-slate-400">Salary expenses will be charged here.</span>
            </label>
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-bold uppercase tracking-wider text-xs">Monthly Salary (UGX)</span>
            </label>
            <input 
              type="number" 
              name="salary" 
              placeholder="0" 
              class="input input-bordered focus:input-primary w-full font-mono" 
              required 
              min="0"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <form method="dialog">
            <button class="btn btn-ghost">Cancel</button>
          </form>
          <button type="submit" class="btn btn-primary px-8">
            Complete Hiring
          </button>
        </div>
      </form>
    </div>
  );
}
