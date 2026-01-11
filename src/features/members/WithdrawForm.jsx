import Icon from '../../components/Icon.jsx';
import { Wallet, Calendar, Minus } from 'lucide';

export default function WithdrawForm({ memberId, maxAmount = 0 }) {
  return (
    <div class="p-2">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-error/10 text-error rounded-lg">
          <Icon icon={Wallet} size={24} />
        </div>
        <div>
          <h3 class="text-xl font-bold">Withdraw Savings</h3>
          <p class="text-sm text-slate-500">Available Balance: {maxAmount.toLocaleString()} UGX</p>
        </div>
      </div>

      <form 
        hx-post={`/dashboard/members/${memberId}/withdraw`}
        hx-target="#htmx-modal-content"
        hx-swap="innerHTML"
        class="space-y-4"
      >
        <div class="form-control">
          <label class="label"><span class="label-text font-semibold">Withdrawal Amount (UGX)</span></label>
          <div class="relative">
            <input 
              type="number" 
              name="amount" 
              placeholder="50000" 
              class="input input-bordered w-full pr-12" 
              max={maxAmount}
              required 
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 text-sm font-medium">UGX</div>
          </div>
          <label class="label"><span class="label-text-alt text-error">Cannot exceed available balance</span></label>
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text font-semibold">Transaction Date</span></label>
          <div class="relative">
            <input type="date" name="date" value={new Date().toISOString().split('T')[0]} class="input input-bordered w-full" required />
            <div class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400"><Icon icon={Calendar} size={16} /></div>
          </div>
        </div>

        <div class="modal-action mt-8">
          <button type="button" class="btn btn-ghost" onClick="document.getElementById('htmx-modal').close()">Cancel</button>
          <button type="submit" class="btn btn-error px-8 text-white">Confirm Withdrawal</button>
        </div>
      </form>
    </div>
  );
}