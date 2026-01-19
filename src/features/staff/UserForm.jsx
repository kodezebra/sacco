import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { UserPlus, X, Lock, Shield, Mail, ArrowLeft, Check } from 'lucide';

export default function GrantAccessPage({ staff }) {
  return (
    <DashboardLayout title={`Access Control: ${staff.fullName}`}>
      <div class="mx-auto max-w-270">
        <PageHeader 
          title="Access Control"
          subtitle={`Security provisioning for ${staff.fullName}`}
          backHref="/dashboard/staff"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Staff', href: '/dashboard/staff' },
            { label: 'Grant Access', href: `/dashboard/staff/${staff.id}/user`, active: true }
          ]}
        />

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-9">
          <div class="lg:col-span-3">
            <div class="rounded-sm border border-stroke bg-white shadow-default">
              <div class="border-b border-stroke py-4 px-6.5 bg-neutral text-white rounded-t-sm">
                <h3 class="font-bold flex items-center gap-2 text-sm uppercase">
                  <Icon icon={Lock} size={18} />
                  Create Security Account
                </h3>
              </div>

              <form 
                action={`/dashboard/staff/${staff.id}/user`} 
                method="POST" 
                class="p-6.5"
              >
                <div class="mb-6">
                  <label class="mb-3 block text-black font-medium text-sm uppercase tracking-wide">Login Identifier (Email/Phone)</label>
                  <div class="relative">
                      <input 
                        type="text" 
                        name="identifier" 
                        placeholder="john@example.com" 
                        class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-11 font-medium outline-none transition focus:border-primary active:border-primary text-black" 
                        required 
                        autofocus
                      />
                      <span class="absolute left-4 top-1/2 -translate-y-1/2">
                          <Icon icon={Mail} size={18} class="text-body" />
                      </span>
                  </div>
                  <p class="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Must be unique across the entire system.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label class="mb-3 block text-black font-medium text-sm uppercase tracking-wide">Initial Password</label>
                    <div class="relative">
                        <input 
                          type="password" 
                          name="password" 
                          placeholder="••••••••" 
                          class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-11 font-medium outline-none transition focus:border-primary active:border-primary text-black" 
                          required 
                          minlength="8"
                        />
                        <span class="absolute left-4 top-1/2 -translate-y-1/2">
                            <Icon icon={Lock} size={18} class="text-body" />
                        </span>
                    </div>
                  </div>

                  <div>
                    <label class="mb-3 block text-black font-medium text-sm uppercase tracking-wide">Security Role</label>
                    <div class="relative z-20 bg-transparent">
                        <select name="role" class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary text-black" required>
                          <option value="staff">Staff (Standard)</option>
                          <option value="manager">Manager (Operations)</option>
                          <option value="admin">Administrator</option>
                          <option value="auditor">Auditor (Read-Only)</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                    </div>
                  </div>
                </div>

                <div class="flex justify-end gap-4 border-t border-stroke pt-6">
                    <a href="/dashboard/staff" class="flex justify-center rounded border border-stroke py-3 px-8 font-medium text-black hover:shadow-1 transition">
                        Cancel
                    </a>
                    <button type="submit" class="flex justify-center rounded bg-neutral py-3 px-10 font-bold text-white hover:bg-opacity-90 shadow-default uppercase tracking-widest flex items-center gap-2">
                        <Icon icon={Shield} size={18} />
                        Grant Access
                    </button>
                </div>
              </form>
            </div>
          </div>

          <div class="lg:col-span-2">
             <div class="rounded-sm border border-stroke bg-white shadow-default">
                <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50">
                    <h3 class="font-bold text-black text-sm uppercase tracking-widest">Security Policy</h3>
                </div>
                <div class="p-6.5">
                    <div class="flex gap-3 mb-4">
                        <div class="text-primary"><Icon icon={Shield} size={24} /></div>
                        <div>
                            <h4 class="font-bold text-black text-sm uppercase">Verification Required</h4>
                            <p class="text-xs text-body mt-1 leading-relaxed">
                                Creating an account allows this staff member to log in. Please ensure the identifier is correct.
                            </p>
                        </div>
                    </div>
                    <div class="bg-gray-2 p-4 rounded-sm border-l-4 border-primary">
                        <p class="text-xs text-black font-medium italic">
                            "System security depends on the integrity of our staff accounts."
                        </p>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}