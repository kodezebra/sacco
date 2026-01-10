import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Settings, Save } from 'lucide';

export function SaccoForm({ sacco, success }) {
    return (
        <form hx-put="/dashboard/sacco" hx-target="this" hx-swap="outerHTML" class="card bg-base-100 border border-base-200 shadow-sm max-w-2xl">
            <div class="card-body">
                <div class="flex items-center gap-2 mb-4">
                    <Icon icon={Settings} size={24} class="text-primary" />
                    <h2 class="card-title">Organization Details</h2>
                </div>
                
                {success && (
                    <div role="alert" class="alert alert-success mb-4 py-2 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Update successful!</span>
                    </div>
                )}

                <div class="form-control w-full">
                    <label class="label"><span class="label-text font-medium">SACCO Name</span></label>
                    <input type="text" name="name" value={sacco?.name || ''} class="input input-bordered w-full" required />
                </div>
                
                <div class="form-control w-full mt-4">
                     <label class="label"><span class="label-text font-medium">Registration Date</span></label>
                     <input type="date" name="createdAt" value={sacco?.createdAt || ''} class="input input-bordered w-full" />
                </div>

                <div class="card-actions justify-end mt-6">
                    <button type="submit" class="btn btn-primary gap-2">
                        <Icon icon={Save} size={18} />
                        Save Changes
                    </button>
                </div>
            </div>
        </form>
    );
}

export default function SaccoPage({ sacco }) {
  return (
    <DashboardLayout title="Settings">
       <div class="flex flex-col gap-8">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Settings</h1>
            <p class="text-slate-500">Configure SACCO settings and parameters.</p>
        </div>

        <SaccoForm sacco={sacco} />
      </div>
    </DashboardLayout>
  );
}