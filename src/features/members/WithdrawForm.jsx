import Icon from '../../components/Icon.jsx';
import { Wallet, Calendar, X, AlertCircle } from 'lucide';

export default function WithdrawForm({ memberId, maxAmount = 0 }) {
  return (
    <div class="rounded-sm border border-stroke bg-white shadow-default">
      <div class="border-b border-stroke py-4 px-6.5 flex justify-between items-center">
        <h3 class="font-medium text-black flex items-center gap-2">
           <Icon icon={Wallet} size={20} />
           Withdraw Savings
        </h3>
        <form method="dialog">
          <button class="hover:text-primary">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form 
        hx-post={`/dashboard/members/${memberId}/withdraw`}
        hx-target="#htmx-modal-content"
        hx-swap="innerHTML"
        class="flex flex-col gap-5.5 p-6.5"
      >
        <div class="p-4.5 bg-red-50 border border-red-100 rounded-sm flex gap-3">
           <div class="text-error"><Icon icon={AlertCircle} size={20} /></div>
           <div>
              <p class="text-xs font-bold uppercase tracking-widest text-error opacity-60">Available Balance</p>
              <p class="text-lg font-black text-error">{maxAmount.toLocaleString()} UGX</p>
           </div>
        </div>

        <div>
          <label class="mb-3 block text-black font-medium text-sm">Withdrawal Amount</label>
          <div class="relative">
            <input 
              type="number" 
              name="amount" 
              placeholder="0" 
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-bold outline-none transition focus:border-error active:border-error disabled:cursor-default disabled:bg-whiter text-black text-lg"
              max={maxAmount}
              required 
              autofocus
            />
            <span class="absolute right-4.5 top-3.5 text-sm font-bold text-body">UGX</span>
          </div>
          <p class="text-xs text-body mt-2 italic">Amount cannot exceed the member's current balance.</p>
        </div>

        <div>
          <label class="mb-3 block text-black font-medium text-sm">Transaction Date</label>
          <div class="relative">
            <input 
              type="date" 
              name="date" 
              value={new Date().toISOString().split('T')[0]} 
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-12 font-medium outline-none transition focus:border-error active:border-error disabled:cursor-default disabled:bg-whiter text-black"
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
          <button type="submit" class="flex justify-center rounded bg-error py-2 px-6 font-medium text-white hover:bg-opacity-90 shadow-default">
            Confirm Withdraw
          </button>
        </div>
      </form>
    </div>
  );
}