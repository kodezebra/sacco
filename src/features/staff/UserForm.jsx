import Icon from '../../components/Icon.jsx';
import { UserPlus, X, Lock, Shield, Mail } from 'lucide';

export default function UserForm({ staff }) {
  return (
    <div class="p-0">
      <div class="bg-secondary p-8 text-secondary-content flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-bold flex items-center gap-2">
            <Icon icon={Lock} size={24} />
            Create Login Account
          </h2>
          <p class="text-secondary-content/70 text-sm mt-1">
            Grant system access to <span class="font-bold text-white">{staff.fullName}</span>
          </p>
        </div>
        <form method="dialog">
          <button class="btn btn-circle btn-ghost btn-sm text-secondary-content">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form 
        action={`/dashboard/staff/${staff.id}/user`} 
        method="POST" 
        class="p-8 flex flex-col gap-6"
      >
        <div class="alert alert-info shadow-sm text-sm">
          <Icon icon={Shield} size={18} />
          <div>
            <h3 class="font-bold">Security Notice</h3>
            <p>The user will use these credentials to log in. Ensure the password is strong.</p>
          </div>
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text font-bold uppercase tracking-wider text-xs">Login Identifier</span>
          </label>
          <div class="input-group">
              <span><Icon icon={Mail} size={16} /></span>
              <input 
                type="text" 
                name="identifier" 
                placeholder="Email or Phone Number" 
                class="input input-bordered focus:input-secondary w-full" 
                required 
                autofocus
              />
          </div>
          <label class="label">
             <span class="label-text-alt text-slate-400">Must be unique in the system.</span>
          </label>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-bold uppercase tracking-wider text-xs">Password</span>
            </label>
            <div class="input-group">
                <span><Icon icon={Lock} size={16} /></span>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="••••••••" 
                  class="input input-bordered focus:input-secondary w-full" 
                  required 
                  minlength="8"
                />
            </div>
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-bold uppercase tracking-wider text-xs">System Role</span>
            </label>
            <select name="role" class="select select-bordered focus:select-secondary w-full" required>
              <option value="staff" selected>Staff (Standard Access)</option>
              <option value="manager">Manager (Approve & Edit)</option>
              <option value="admin">Admin (System Operations)</option>
              <option value="auditor">Auditor (Read Only)</option>
              <option value="super_admin">Super Admin (Full Control)</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <form method="dialog">
            <button class="btn btn-ghost">Cancel</button>
          </form>
          <button type="submit" class="btn btn-secondary px-8">
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}
