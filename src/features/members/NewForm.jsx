import Icon from '../../components/Icon.jsx';
import { UserPlus, User, Phone, MapPin, X, ShieldCheck } from 'lucide';

export default function NewMemberForm() {
  return (
    <div class="rounded-sm border border-stroke bg-white shadow-default">
      <div class="border-b border-stroke py-4 px-6.5 flex justify-between items-center">
        <h3 class="font-medium text-black flex items-center gap-2">
           <Icon icon={UserPlus} size={20} />
           Member Registration
        </h3>
        <form method="dialog">
          <button class="hover:text-primary">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form
        hx-post="/dashboard/members"
        hx-target="#members-table-body"
        hx-swap="afterbegin"
        class="flex flex-col gap-5.5 p-6.5"
      >
        <div class="p-4.5 bg-gray-2 rounded-sm border border-stroke text-sm">
           <div class="flex items-center gap-2.5 text-primary mb-1">
               <Icon icon={ShieldCheck} size={18} />
               <span class="font-bold">KYC Requirement</span>
           </div>
           <p class="text-body text-xs">Ensure all information matches the member's National ID.</p>
        </div>

        <div>
            <label class="mb-3 block text-black font-medium text-sm">Full Legal Name</label>
            <div class="relative">
              <input 
                type="text" 
                name="fullName" 
                placeholder="e.g. John Doe" 
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-black pl-11" 
                required 
              />
              <span class="absolute left-4.5 top-3.5">
                  <Icon icon={User} size={20} class="text-body" />
              </span>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
              <label class="mb-3 block text-black font-medium text-sm">Phone Number</label>
              <div class="relative">
                <input 
                    type="tel" 
                    name="phone" 
                    placeholder="0700 000 000" 
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-black pl-11" 
                />
                <span class="absolute left-4.5 top-3.5">
                    <Icon icon={Phone} size={20} class="text-body" />
                </span>
              </div>
          </div>
          <div>
              <label class="mb-3 block text-black font-medium text-sm">Residential Address</label>
              <div class="relative">
                <input 
                    type="text" 
                    name="address" 
                    placeholder="e.g. Kampala, Central" 
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-black pl-11" 
                />
                <span class="absolute left-4.5 top-3.5">
                    <Icon icon={MapPin} size={20} class="text-body" />
                </span>
              </div>
          </div>
        </div>

        <div>
            <label class="mb-3 block text-black font-medium text-sm">Next of Kin (Guardian)</label>
            <input 
                type="text" 
                name="nextOfKinName" 
                placeholder="Full name of next of kin" 
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-black" 
            />
        </div>

        <div class="flex justify-end gap-4.5 mt-2">
          <button type="button" class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 hover:text-primary" onclick="document.getElementById('htmx-modal').close()">
              Cancel
          </button>
          <button type="submit" class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 shadow-default">
            Register Member
          </button>
        </div>
      </form>
    </div>
  );
}
