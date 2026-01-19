import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { UserCog, X, Lock, Shield, Mail, Trash2, Save, ArrowLeft } from 'lucide';

export default function ManageAccessPage({ staff, user }) {
  return (
    <DashboardLayout title={`Manage: ${staff.fullName}`}>
      <div class="mx-auto max-w-270">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-title-md2 font-bold text-black uppercase tracking-tight">Security Management</h2>
          <nav>
            <ol class="flex items-center gap-2">
              <li><a class="font-medium" href="/dashboard/staff">Staff /</a></li>
              <li class="font-medium text-primary">Manage Auth</li>
            </ol>
          </nav>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-9">
          <div class="lg:col-span-3 flex flex-col gap-9">
            
            {/* Main Update Form */}
            <div class="rounded-sm border border-stroke bg-white shadow-default">
              <div class="border-b border-stroke py-4 px-6.5 bg-neutral text-white rounded-t-sm">
                <h3 class="font-bold flex items-center gap-2 text-sm uppercase">
                  <Icon icon={UserCog} size={18} />
                  Account Configuration
                </h3>
              </div>

              <form 
                action={`/dashboard/staff/${staff.id}/user/update`} 
                method="POST" 
                class="p-6.5"
              >
                <div class="mb-6">
                  <label class="mb-3 block text-black font-medium text-sm uppercase tracking-wide">Identifier (Locked)</label>
                  <div class="relative">
                      <input 
                        type="text" 
                        value={user.identifier}
                        disabled
                        class="w-full rounded border-[1.5px] border-stroke bg-gray-2 py-3 px-5 pl-11 font-bold text-body cursor-not-allowed outline-none" 
                      />
                      <span class="absolute left-4 top-1/2 -translate-y-1/2">
                          <Icon icon={Mail} size={18} class="text-bodydark2" />
                      </span>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label class="mb-3 block text-black font-medium text-sm uppercase tracking-wide">System Role</label>
                    <div class="relative z-20 bg-transparent">
                        <select name="role" class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary text-black" required>
                          <option value="staff" selected={user.role === 'staff'}>Staff (Standard)</option>
                          <option value="manager" selected={user.role === 'manager'}>Manager</option>
                          <option value="admin" selected={user.role === 'admin'}>Administrator</option>
                          <option value="auditor" selected={user.role === 'auditor'}>Auditor</option>
                          <option value="super_admin" selected={user.role === 'super_admin'}>Super Admin</option>
                        </select>
                    </div>
                  </div>

                  <div>
                    <label class="mb-3 block text-black font-medium text-sm uppercase tracking-wide">Password Reset</label>
                    <div class="relative">
                        <input 
                          type="password" 
                          name="password" 
                          placeholder="Leave blank to keep" 
                          class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-11 font-medium outline-none transition focus:border-primary active:border-primary text-black" 
                          minlength="8"
                        />
                        <span class="absolute left-4 top-1/2 -translate-y-1/2">
                            <Icon icon={Lock} size={18} class="text-body" />
                        </span>
                    </div>
                  </div>
                </div>

                <div class="flex justify-end gap-4 border-t border-stroke pt-6">
                    <a href="/dashboard/staff" class="flex justify-center rounded border border-stroke py-3 px-8 font-medium text-black hover:shadow-1 transition">
                        Cancel
                    </a>
                    <button type="submit" class="flex justify-center rounded bg-primary py-3 px-10 font-bold text-white hover:bg-opacity-90 shadow-default uppercase tracking-widest flex items-center gap-2">
                        <Icon icon={Save} size={18} />
                        Save Settings
                    </button>
                </div>
              </form>
            </div>

            {/* Revoke Card */}
            <div class="rounded-sm border border-error/20 bg-white shadow-default">
                <div class="border-b border-error/10 py-4 px-6.5 bg-error/5 flex justify-between items-center">
                    <h3 class="font-bold text-error text-sm uppercase tracking-widest">Revoke Access</h3>
                </div>
                <div class="p-6.5">
                    <p class="text-sm text-body mb-6">
                        This action will immediately disable and permanently delete the user login account for <strong>{staff.fullName}</strong>. 
                        The employment record will not be affected.
                    </p>
                    <form 
                        action={`/dashboard/staff/${staff.id}/user/delete`} 
                        method="POST"
                        onSubmit="return confirm('Are you sure you want to permanently revoke system access for this employee?');"
                    >
                        <button type="submit" class="w-full flex justify-center items-center gap-2 rounded bg-error py-3 font-bold text-white hover:bg-opacity-90 shadow-default active:scale-95 transition-all uppercase tracking-widest">
                            <Icon icon={Trash2} size={18} />
                            Delete Account
                        </button>
                    </form>
                </div>
            </div>

          </div>

          <div class="lg:col-span-2">
             <div class="rounded-sm border border-stroke bg-white shadow-default">
                <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50">
                    <h3 class="font-bold text-black text-sm uppercase tracking-widest">Security Audit</h3>
                </div>
                <div class="p-6.5 space-y-4">
                    <div class="flex justify-between items-center border-b border-stroke pb-2">
                        <span class="text-xs font-bold text-slate-400 uppercase">Created On</span>
                        <span class="text-xs font-mono font-bold text-black">{user.createdAt?.split('T')[0] || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between items-center border-b border-stroke pb-2">
                        <span class="text-xs font-bold text-slate-400 uppercase">Last Login</span>
                        <span class="text-xs font-mono font-bold text-black">None Recorded</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-bold text-slate-400 uppercase">Account Status</span>
                        <span class="bg-success/10 text-success text-[10px] font-black px-2 py-0.5 rounded uppercase">Active</span>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}