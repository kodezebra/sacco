import Icon from '../../components/Icon.jsx';
import { Wallet, X, Calendar } from 'lucide';

export default function DepositForm({ memberId }) {
  return (
    <div class="rounded-sm border border-stroke bg-white shadow-default">
      <div class="border-b border-stroke py-4 px-6.5 flex justify-between items-center">
        <h3 class="font-medium text-black flex items-center gap-2">
           <Icon icon={Wallet} size={20} />
           Savings Deposit
        </h3>
        <form method="dialog">
          <button class="hover:text-primary">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form
        hx-post={`/dashboard/members/${memberId}/savings`}
        hx-swap="none"
        class="flex flex-col gap-5.5 p-6.5"
      >
        <input type="hidden" name="memberId" value={memberId} />
        
        <div>
            <label class="mb-3 block text-black font-medium text-sm">Deposit Amount</label>
            <div class="relative">
              <input 
                type="number" 
                name="amount" 
                placeholder="0" 
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-bold outline-none transition focus:border-success active:border-success disabled:cursor-default disabled:bg-whiter text-black text-lg"
                required 
                min="1000" 
                autofocus
              />
              <span class="absolute right-4.5 top-3.5 text-sm font-bold text-body">UGX</span>
            </div>
        </div>

        <div>
            <label class="mb-3 block text-black font-medium text-sm">Transaction Date</label>
            <div class="relative">
              <input 
                type="date" 
                name="date" 
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-12 font-medium outline-none transition focus:border-success active:border-success disabled:cursor-default disabled:bg-whiter text-black"
                defaultValue={new Date().toISOString().split('T')[0]} 
                required 
              />
              <span class="absolute left-4.5 top-3.5">
                  <Icon icon={Calendar} size={20} class="text-body" />
              </span>
            </div>
        </div>

        <div class="flex justify-end gap-4.5 mt-2">
          <button type="button" class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 hover:text-primary" onclick="document.getElementById('htmx-modal').close()">
              Cancel
          </button>
          <button type="submit" class="flex justify-center rounded bg-success py-2 px-6 font-medium text-white hover:bg-opacity-90 shadow-default">
            Confirm Deposit
          </button>
        </div>
      </form>
    </div>
  );
}
