import Icon from '../../components/Icon.jsx';
import { UserPlus, User, Phone, MapPin, X, ShieldCheck } from 'lucide';

export default function NewMemberForm() {
  return (
    <div class="p-0">
      <div class="bg-primary p-8 text-primary-content flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-black flex items-center gap-3">
            <Icon icon={UserPlus} size={28} />
            Member Registration
          </h2>
          <p class="text-primary-content/70 text-sm mt-1 font-medium">Create a new member account and KYC profile</p>
        </div>
        <form method="dialog">
          <button class="btn btn-circle btn-ghost btn-sm text-primary-content">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form
        hx-post="/dashboard/members"
        hx-target="#members-table-body"
        hx-swap="afterbegin"
        class="p-8 flex flex-col gap-6"
      >
        <div class="alert alert-info/10 border-info/20 text-xs font-medium text-info">
           <Icon icon={ShieldCheck} size={16} />
           <div>Ensure all information matches the member's National ID for KYC compliance.</div>
        </div>

        <div class="form-control w-full">
            <label class="label pt-0">
              <span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Legal Name</span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Icon icon={User} size={16} /></div>
              <input type="text" name="fullName" placeholder="e.g. John Doe" class="input input-bordered focus:input-primary w-full pl-12 font-bold" required />
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control w-full">
              <label class="label pt-0">
                <span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone Number</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Icon icon={Phone} size={16} /></div>
                <input type="tel" name="phone" placeholder="0700 000 000" class="input input-bordered focus:input-primary w-full pl-12 font-mono" />
              </div>
          </div>
          <div class="form-control w-full">
              <label class="label pt-0">
                <span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Residential Address</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Icon icon={MapPin} size={16} /></div>
                <input type="text" name="address" placeholder="e.g. Kampala, Central" class="input input-bordered focus:input-primary w-full pl-12" />
              </div>
          </div>
        </div>

        <div class="divider text-[10px] uppercase font-bold tracking-widest opacity-30">Next of Kin (Emergency)</div>

        <div class="form-control w-full">
            <label class="label pt-0">
              <span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Guardian Name</span>
            </label>
            <input type="text" name="nextOfKinName" placeholder="Full name of next of kin" class="input input-bordered focus:input-primary w-full" />
        </div>

        <div class="modal-action mt-4 border-t border-slate-100 pt-6">
          <button type="button" class="btn btn-ghost px-8" onclick="document.getElementById('htmx-modal').close()">Cancel</button>
          <button type="submit" class="btn btn-primary px-10 rounded-xl shadow-lg shadow-primary/20">
            Register Member
          </button>
        </div>
      </form>
    </div>
  );
}
