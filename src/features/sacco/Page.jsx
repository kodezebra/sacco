import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Settings, Save, Building2, Phone, Mail, MapPin, Banknote, Percent } from 'lucide';

export function SaccoForm({ sacco, success }) {
    return (
        <form hx-put="/dashboard/sacco" hx-target="this" hx-swap="outerHTML" class="flex flex-col gap-6">
            {success && (
                <div class="flex w-full rounded-sm border-l-6 border-success bg-success/10 px-7 py-4 shadow-default">
                    <div class="mr-5 flex h-9 w-9 items-center justify-center rounded-lg bg-success text-white">
                        <Icon icon={Save} size={20} />
                    </div>
                    <div class="w-full">
                        <h5 class="mb-1 font-bold text-success">Settings updated</h5>
                        <p class="text-sm font-medium text-success">Your organization profile has been saved.</p>
                    </div>
                </div>
            )}

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Organization Profile */}
                <div class="rounded-sm border border-stroke bg-white shadow-default">
                    <div class="border-b border-stroke py-4 px-6.5">
                        <h3 class="font-medium text-black flex items-center gap-2">
                            <Icon icon={Building2} size={20} />
                            Organization Profile
                        </h3>
                    </div>
                    <div class="p-6.5">
                        <div class="mb-4.5">
                            <label class="mb-2.5 block text-black font-medium text-sm">SACCO Name</label>
                            <input type="text" name="name" value={sacco?.name || ''} placeholder="Enter SACCO Name" class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black" required />
                        </div>
                        
                        <div class="mb-4.5 grid grid-cols-2 gap-4">
                            <div>
                                <label class="mb-2.5 block text-black font-medium text-sm">Phone Number</label>
                                <input type="tel" name="phone" value={sacco?.phone || ''} class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black" />
                            </div>
                            <div>
                                <label class="mb-2.5 block text-black font-medium text-sm">Email Address</label>
                                <input type="email" name="email" value={sacco?.email || ''} class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black" />
                            </div>
                        </div>

                        <div class="mb-4.5">
                            <label class="mb-2.5 block text-black font-medium text-sm">Physical Address</label>
                            <input type="text" name="address" value={sacco?.address || ''} class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black" />
                        </div>

                        <div>
                            <label class="mb-2.5 block text-black font-medium text-sm">Registration Date</label>
                            <input type="date" name="createdAt" value={sacco?.createdAt || ''} class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black" />
                        </div>
                    </div>
                </div>

                {/* Financial Policies */}
                <div class="rounded-sm border border-stroke bg-white shadow-default">
                    <div class="border-b border-stroke py-4 px-6.5">
                        <h3 class="font-medium text-black flex items-center gap-2">
                            <Icon icon={Banknote} size={20} />
                            Financial Policy
                        </h3>
                    </div>
                    <div class="p-6.5">
                        <div class="mb-4.5">
                            <label class="mb-2.5 block text-black font-medium text-sm">Operational Currency</label>
                            <div class="relative z-20 bg-transparent">
                                <select name="currency" class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary text-black">
                                    <option value="UGX" selected={sacco?.currency === 'UGX'}>UGX - Ugandan Shilling</option>
                                    <option value="USD" selected={sacco?.currency === 'USD'}>USD - US Dollar</option>
                                    <option value="KES" selected={sacco?.currency === 'KES'}>KES - Kenyan Shilling</option>
                                </select>
                                <span class="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                    <Icon icon={Percent} size={16} class="text-body" />
                                </span>
                            </div>
                        </div>

                        <div class="mb-4.5 grid grid-cols-2 gap-4">
                            <div>
                                <label class="mb-2.5 block text-black font-medium text-sm">Interest Rate (%)</label>
                                <input type="number" step="0.1" name="defaultInterestRate" value={sacco?.defaultInterestRate || 5.0} class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black" />
                            </div>
                            <div>
                                <label class="mb-2.5 block text-black font-medium text-sm">Loan Duration (Mo)</label>
                                <input type="number" name="defaultLoanDuration" value={sacco?.defaultLoanDuration || 6} class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black" />
                            </div>
                        </div>

                        <div class="mb-4.5 grid grid-cols-2 gap-4">
                            <div>
                                <label class="mb-2.5 block text-black font-medium text-sm">Share Price</label>
                                <input type="number" name="sharePrice" value={sacco?.sharePrice || 20000} class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black" />
                            </div>
                            <div>
                                <label class="mb-2.5 block text-black font-medium text-sm">Reg. Fee</label>
                                <input type="number" name="registrationFee" value={sacco?.registrationFee || 10000} class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black" />
                            </div>
                        </div>

                        <div class="p-4 bg-primary/5 rounded-sm border border-primary/10 text-xs text-primary leading-relaxed mt-4">
                            <strong>Note:</strong> Policy changes will only apply to new records. Existing loans and transactions will remain unaffected.
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end gap-4.5">
                <button type="submit" class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 shadow-default">
                    Save All Settings
                </button>
            </div>
        </form>
    );
}

export default function SaccoPage({ sacco }) {
  return (
    <DashboardLayout title="System Settings">
       <div class="flex flex-col gap-6">
        <SaccoForm sacco={sacco} />
      </div>
    </DashboardLayout>
  );
}