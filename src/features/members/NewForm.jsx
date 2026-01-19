import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { UserPlus, X, Phone, MapPin, User, Calendar, Check, Info } from 'lucide';

export default function NewMemberPage({ errors = {}, values = {}, defaults = {} }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <DashboardLayout title="Register New Member">
      <div class="mx-auto max-w-270">
        <PageHeader 
          title="New Membership"
          subtitle="Register a new person into the SACCO database."
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Directory', href: '/dashboard/members' },
            { label: 'Registration', href: '/dashboard/members/new', active: true }
          ]}
        />

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-9">
          <div class="lg:col-span-3">
            <div class="rounded-sm border border-stroke bg-white shadow-default">
              <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50">
                <h3 class="font-bold text-black flex items-center gap-2 text-sm uppercase">
                   <Icon icon={UserPlus} size={18} />
                   Member Profile
                </h3>
              </div>

              <form action="/dashboard/members" method="POST" class="p-6.5">
                {Object.keys(errors).length > 0 && (
                  <div class="p-4 mb-6 bg-error/10 text-error text-sm rounded-sm border border-error/20 font-bold">
                    Validation failed. Please check the fields below.
                  </div>
                )}

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">Full Name</label>
                    <div class="relative">
                        <input 
                          type="text" 
                          name="fullName" 
                          defaultValue={values.fullName}
                          placeholder="e.g. John Peter Mukasa" 
                          class={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 pl-11 font-medium outline-none transition focus:border-primary active:border-primary text-black ${errors.fullName ? 'border-error' : 'border-stroke'}`}
                          required 
                          autofocus
                        />
                        <span class="absolute left-4 top-1/2 -translate-y-1/2">
                            <Icon icon={User} size={18} class="text-bodydark2" />
                        </span>
                    </div>
                    {errors.fullName && <p class="text-error text-xs mt-1 font-bold">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">Phone Number</label>
                    <div class="relative">
                      <input 
                        type="text" 
                        name="phone" 
                        defaultValue={values.phone}
                        placeholder="+256 700 000 000"
                        class={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 pl-11 font-medium outline-none transition focus:border-primary active:border-primary text-black ${errors.phone ? 'border-error' : 'border-stroke'}`}
                        required 
                      />
                      <span class="absolute left-4 top-1/2 -translate-y-1/2">
                          <Icon icon={Phone} size={18} class="text-bodydark2" />
                      </span>
                    </div>
                    {errors.phone && <p class="text-error text-xs mt-1 font-bold">{errors.phone}</p>}
                  </div>
                </div>

                <div class="mb-6">
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">Residential Address</label>
                    <div class="relative">
                        <input 
                          type="text" 
                          name="address" 
                          defaultValue={values.address}
                          placeholder="Village, District, Street" 
                          class={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 pl-11 font-medium outline-none transition focus:border-primary active:border-primary text-black ${errors.address ? 'border-error' : 'border-stroke'}`}
                        />
                        <span class="absolute left-4 top-1/2 -translate-y-1/2">
                            <Icon icon={MapPin} size={18} class="text-bodydark2" />
                        </span>
                    </div>
                </div>

                <div class="divider border-stroke my-8 font-black text-[10px] uppercase tracking-[0.2em] text-slate-300">Next of Kin Details</div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">NOK Full Name</label>
                    <input 
                      type="text" 
                      name="nextOfKinName" 
                      defaultValue={values.nextOfKinName}
                      placeholder="Spouse / Parent Name" 
                      class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black" 
                    />
                  </div>

                  <div>
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">NOK Phone</label>
                    <input 
                      type="text" 
                      name="nextOfKinPhone" 
                      defaultValue={values.nextOfKinPhone}
                      placeholder="Phone Number"
                      class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black" 
                    />
                  </div>
                </div>

                <div class="mb-10">
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">Registration Date</label>
                    <div class="relative">
                      <input 
                        type="date" 
                        name="createdAt" 
                        defaultValue={values.createdAt || today}
                        class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-11 font-bold outline-none transition focus:border-primary active:border-primary text-black"
                        required 
                      />
                      <span class="absolute left-4 top-1/2 -translate-y-1/2">
                          <Icon icon={Calendar} size={18} class="text-bodydark2" />
                      </span>
                    </div>
                </div>

                <div class="flex justify-end gap-4 border-t border-stroke pt-6">
                    <a href="/dashboard/members" class="flex justify-center rounded border border-stroke py-3 px-8 font-medium text-black hover:shadow-1 transition">
                        Cancel
                    </a>
                    <button type="submit" class="flex justify-center rounded bg-primary py-3 px-10 font-bold text-white hover:bg-opacity-90 shadow-default uppercase tracking-widest flex items-center gap-2">
                        <Icon icon={Check} size={18} />
                        Register Member
                    </button>
                </div>
              </form>
            </div>
          </div>

          <div class="lg:col-span-2">
             <div class="rounded-sm border border-stroke bg-white shadow-default">
                <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50">
                    <h3 class="font-bold text-black text-sm uppercase tracking-widest">Member Policy</h3>
                </div>
                <div class="p-6.5">
                    <div class="bg-primary/5 p-4 rounded-sm border-l-4 border-primary mb-6">
                        <h4 class="font-bold text-primary text-xs uppercase mb-1">Onboarding</h4>
                        <p class="text-xs text-black font-medium leading-relaxed">
                            New members are registered with an "Active" status by default. An automated Member Number will be generated.
                        </p>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="flex gap-3">
                            <div class="text-success shrink-0"><Icon icon={Check} size={16} /></div>
                            <p class="text-[11px] text-body font-medium">Valid Phone Number is required for SMS alerts.</p>
                        </div>
                        <div class="flex gap-3">
                            <div class="text-success shrink-0"><Icon icon={Check} size={16} /></div>
                            <p class="text-[11px] text-body font-medium">Identity verification should be done physically.</p>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}