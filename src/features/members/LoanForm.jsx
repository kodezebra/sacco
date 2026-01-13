import Icon from '../../components/Icon.jsx';
import { Banknote, Calendar, Percent, Clock, X, Info } from 'lucide';

export default function LoanForm({ memberId, defaults = {} }) {
  return (
    <div class="rounded-sm border border-stroke bg-white shadow-default">
      <div class="border-b border-stroke py-4 px-6.5 flex justify-between items-center">
        <h3 class="font-medium text-black flex items-center gap-2">
           <Icon icon={Banknote} size={20} />
           Issue New Loan
        </h3>
        <form method="dialog">
          <button class="hover:text-primary">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form 
        hx-post={`/dashboard/members/${memberId}/loans`}
        hx-target="#htmx-modal-content"
        hx-swap="innerHTML"
        class="flex flex-col gap-5.5 p-6.5"
      >
        <div class="p-4.5 bg-gray-2 rounded-sm border border-stroke text-sm">
           <div class="flex items-center gap-2.5 text-primary mb-1">
               <Icon icon={Info} size={18} />
               <span class="font-bold">Policy Reminder</span>
           </div>
           <p class="text-body text-xs">Terms and interest calculations follow the default SACCO policy.</p>
        </div>

        <div>
          <label class="mb-3 block text-black font-medium text-sm">Principal Amount</label>
          <div class="relative">
            <input 
              type="number" 
              name="principal" 
              placeholder="0" 
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-bold outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-black text-lg" 
              required 
              autofocus
            />
            <span class="absolute right-4.5 top-3.5 text-sm font-bold text-body">UGX</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="mb-3 block text-black font-medium text-sm">Interest Rate (%)</label>
            <div class="relative">
              <input 
                  type="number" 
                  step="0.1" 
                  name="interestRate" 
                  value={defaults.defaultInterestRate || 5} 
                  class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-12 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-black" 
                  required 
              />
              <span class="absolute left-4.5 top-3.5">
                  <Icon icon={Percent} size={20} class="text-body" />
              </span>
            </div>
            <p class="text-xs text-body mt-2 italic">Monthly flat rate</p>
          </div>

          <div>
            <label class="mb-3 block text-black font-medium text-sm">Duration (Months)</label>
            <div class="relative">
              <input 
                  type="number" 
                  name="durationMonths" 
                  value={defaults.defaultLoanDuration || 6} 
                  class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-12 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-black" 
                  required 
              />
              <span class="absolute left-4.5 top-3.5">
                  <Icon icon={Clock} size={20} class="text-body" />
              </span>
            </div>
          </div>
        </div>

        <div>
          <label class="mb-3 block text-black font-medium text-sm">Disbursement Date</label>
          <div class="relative">
            <input 
                type="date" 
                name="issuedDate" 
                value={new Date().toISOString().split('T')[0]} 
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-12 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-black"
                required 
            />
            <span class="absolute left-4.5 top-3.5">
                <Icon icon={Calendar} size={20} class="text-body" />
            </span>
          </div>
        </div>

        <div class="flex justify-end gap-4.5 mt-2">
          <button type="button" class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 hover:text-primary" onClick="document.getElementById('htmx-modal').close()">
              Cancel
          </button>
          <button type="submit" class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 shadow-default">
            Issue Loan
          </button>
        </div>
      </form>
    </div>
  );
}
