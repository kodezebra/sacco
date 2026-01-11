import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Settings, Save, Building2, Phone, Mail, MapPin, Banknote, Percent } from 'lucide';

export function SaccoForm({ sacco, success }) {
    return (
        <form hx-put="/dashboard/sacco" hx-target="this" hx-swap="outerHTML" class="flex flex-col gap-6 max-w-4xl w-full">
            {success && (
                <div role="alert" class="alert alert-success py-3 shadow-sm border-none bg-success/10 text-success font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Settings updated successfully!</span>
                </div>
            )}

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Organization Profile */}
                <div class="card bg-base-100 border border-base-200 shadow-sm">
                    <div class="card-body">
                        <div class="flex items-center gap-2 mb-4 border-b pb-2">
                            <Icon icon={Building2} size={20} class="text-primary" />
                            <h2 class="card-title text-base font-bold">Organization Profile</h2>
                        </div>

                        <div class="space-y-4">
                            <div class="form-control w-full">
                                <label class="label"><span class="label-text font-medium text-xs uppercase tracking-wider opacity-60">SACCO Name</span></label>
                                <input type="text" name="name" value={sacco?.name || ''} class="input input-bordered w-full" required />
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <div class="form-control w-full">
                                    <label class="label"><span class="label-text font-medium text-xs uppercase tracking-wider opacity-60">Phone Number</span></label>
                                    <div class="relative">
                                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-40"><Icon icon={Phone} size={16} /></div>
                                        <input type="tel" name="phone" value={sacco?.phone || ''} class="input input-bordered w-full pl-10" />
                                    </div>
                                </div>
                                <div class="form-control w-full">
                                    <label class="label"><span class="label-text font-medium text-xs uppercase tracking-wider opacity-60">Email Address</span></label>
                                    <div class="relative">
                                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-40"><Icon icon={Mail} size={16} /></div>
                                        <input type="email" name="email" value={sacco?.email || ''} class="input input-bordered w-full pl-10" />
                                    </div>
                                </div>
                            </div>

                            <div class="form-control w-full">
                                <label class="label"><span class="label-text font-medium text-xs uppercase tracking-wider opacity-60">Physical Address</span></label>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-40"><Icon icon={MapPin} size={16} /></div>
                                    <input type="text" name="address" value={sacco?.address || ''} class="input input-bordered w-full pl-10" />
                                </div>
                            </div>

                            <div class="form-control w-full">
                                <label class="label"><span class="label-text font-medium text-xs uppercase tracking-wider opacity-60">Registration Date</span></label>
                                <input type="date" name="createdAt" value={sacco?.createdAt || ''} class="input input-bordered w-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Policies */}
                <div class="card bg-base-100 border border-base-200 shadow-sm">
                    <div class="card-body">
                        <div class="flex items-center gap-2 mb-4 border-b pb-2">
                            <Icon icon={Banknote} size={20} class="text-secondary" />
                            <h2 class="card-title text-base font-bold">Financial Policy</h2>
                        </div>

                        <div class="space-y-4">
                            <div class="form-control w-full">
                                <label class="label"><span class="label-text font-medium text-xs uppercase tracking-wider opacity-60">Operational Currency</span></label>
                                <select name="currency" class="select select-bordered w-full">
                                    <option value="UGX" selected={sacco?.currency === 'UGX'}>UGX - Ugandan Shilling</option>
                                    <option value="USD" selected={sacco?.currency === 'USD'}>USD - US Dollar</option>
                                    <option value="KES" selected={sacco?.currency === 'KES'}>KES - Kenyan Shilling</option>
                                </select>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div class="form-control w-full">
                                    <label class="label"><span class="label-text font-medium text-xs uppercase tracking-wider opacity-60">Interest Rate (%)</span></label>
                                    <div class="relative">
                                        <input type="number" step="0.1" name="defaultInterestRate" value={sacco?.defaultInterestRate || 5.0} class="input input-bordered w-full pr-10" />
                                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-40"><Icon icon={Percent} size={16} /></div>
                                    </div>
                                </div>
                                <div class="form-control w-full">
                                    <label class="label"><span class="label-text font-medium text-xs uppercase tracking-wider opacity-60">Loan Duration (Months)</span></label>
                                    <input type="number" name="defaultLoanDuration" value={sacco?.defaultLoanDuration || 6} class="input input-bordered w-full" />
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div class="form-control w-full">
                                    <label class="label"><span class="label-text font-medium text-xs uppercase tracking-wider opacity-60">Share Price</span></label>
                                    <input type="number" name="sharePrice" value={sacco?.sharePrice || 20000} class="input input-bordered w-full" />
                                </div>
                                <div class="form-control w-full">
                                    <label class="label"><span class="label-text font-medium text-xs uppercase tracking-wider opacity-60">Registration Fee</span></label>
                                    <input type="number" name="registrationFee" value={sacco?.registrationFee || 10000} class="input input-bordered w-full" />
                                </div>
                            </div>
                        </div>

                        <div class="mt-auto pt-10">
                            <div class="p-4 bg-info/5 rounded-lg border border-info/10 text-xs text-info leading-relaxed">
                                <strong>Note:</strong> Policy changes will only apply to new records. Existing loans and transactions will remain unaffected.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end mt-4">
                <button type="submit" class="btn btn-primary px-10 gap-2 shadow-lg">
                    <Icon icon={Save} size={18} />
                    Save All Settings
                </button>
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