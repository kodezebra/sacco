import Icon from '../../components/Icon.jsx';
import { UserCog, X, Lock, Shield, Mail, Trash2, Save } from 'lucide';

export default function UserEditForm({ staff, user }) {
  return (
    <div class="p-0">
      <div class="bg-base-200 p-8 text-base-content flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-bold flex items-center gap-2">
            <Icon icon={UserCog} size={24} />
            Manage User Account
          </h2>
          <p class="text-base-content/70 text-sm mt-1">
            Editing access for <span class="font-bold">{staff.fullName}</span>
          </p>
        </div>
        <form method="dialog">
          <button class="btn btn-circle btn-ghost btn-sm">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <div class="p-8 flex flex-col gap-8">
        {/* Main Edit Form */}
        <form 
          action={`/dashboard/staff/${staff.id}/user/update`} 
          method="POST" 
          class="flex flex-col gap-6"
        >
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-bold uppercase tracking-wider text-xs">Login Identifier</span>
            </label>
            <div class="input-group">
                <span><Icon icon={Mail} size={16} /></span>
                <input 
                  type="text" 
                  value={user.identifier}
                  disabled
                  class="input input-bordered w-full bg-base-200 text-base-content/60 cursor-not-allowed" 
                />
            </div>
            <label class="label">
               <span class="label-text-alt text-slate-400">Cannot be changed. Revoke and recreate if needed.</span>
            </label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-bold uppercase tracking-wider text-xs">System Role</span>
              </label>
              <select name="role" class="select select-bordered focus:select-primary w-full" required>
                <option value="staff" selected={user.role === 'staff'}>Staff (Standard Access)</option>
                <option value="manager" selected={user.role === 'manager'}>Manager (Approve & Edit)</option>
                <option value="admin" selected={user.role === 'admin'}>Admin (System Operations)</option>
                <option value="auditor" selected={user.role === 'auditor'}>Auditor (Read Only)</option>
                <option value="super_admin" selected={user.role === 'super_admin'}>Super Admin (Full Control)</option>
              </select>
            </div>

            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-bold uppercase tracking-wider text-xs">Reset Password</span>
              </label>
              <div class="input-group">
                  <span><Icon icon={Lock} size={16} /></span>
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="Leave blank to keep current" 
                    class="input input-bordered focus:input-primary w-full" 
                    minlength="8"
                  />
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-2">
            <form method="dialog">
              <button class="btn btn-ghost">Cancel</button>
            </form>
            <button type="submit" class="btn btn-primary px-6 gap-2">
              <Icon icon={Save} size={18} />
              Update Account
            </button>
          </div>
        </form>

        <div class="divider">Danger Zone</div>

        {/* Revoke Access Form */}
        <div class="alert alert-error/10 border-error/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex gap-3">
             <div class="text-error"><Icon icon={Shield} size={24} /></div>
             <div>
               <h3 class="font-bold text-error">Revoke System Access</h3>
               <p class="text-xs text-error/80">
                 This will permanently delete the user login. The staff record will remain.
               </p>
             </div>
          </div>
          <form 
            action={`/dashboard/staff/${staff.id}/user/delete`} 
            method="POST"
            onSubmit="return confirm('Are you sure you want to remove this user account? The staff member will no longer be able to log in.');"
          >
             <button class="btn btn-error btn-sm btn-outline gap-2">
               <Icon icon={Trash2} size={16} />
               Revoke Access
             </button>
          </form>
        </div>
      </div>
    </div>
  );
}
