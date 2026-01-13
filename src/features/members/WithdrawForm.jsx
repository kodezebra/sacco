import Icon from '../../components/Icon.jsx';
import { Wallet, Calendar, X, AlertCircle } from 'lucide';

export default function WithdrawForm({ memberId, maxAmount = 0 }) {
  return (
    <div class="p-0">
      <div class="bg-error p-8 text-error-content flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-black flex items-center gap-3">
            <Icon icon={Wallet} size={28} />
            Withdraw Savings
          </h2>
          <p class="text-error-content/70 text-sm mt-1 font-medium">Process a cash withdrawal for this member</p>
        </div>
        <form method="dialog">
          <button class="btn btn-circle btn-ghost btn-sm text-error-content">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form 
        hx-post={`/dashboard/members/${memberId}/withdraw`}
        hx-target="#htmx-modal-content"
        hx-swap="innerHTML"
        class="p-8 flex flex-col gap-6"
      >
        <div class="alert alert-error/10 border-error/20 flex gap-3 p-4 rounded-xl">
           <div class="text-error"><Icon icon={AlertCircle} size={20} /></div>
           <div>
              <p class="text-[10px] font-bold uppercase tracking-widest text-error/60">Available Balance</p>
              <p class="text-lg font-black text-error">{maxAmount.toLocaleString()} UGX</p>
           </div>
        </div>

        <div class="form-control w-full">
          <label class="label pt-0">
            <span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Withdrawal Amount (UGX)</span>
          </label>
          <div class="relative">
            <input 
              type="number" 
              name="amount" 
              placeholder="0" 
              class="input input-bordered focus:input-error w-full text-lg font-black" 
              max={maxAmount}
              required 
              autofocus
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 font-bold text-xs uppercase">UGX</div>
          </div>
          <label class="label">
            <span class="label-text-alt text-slate-400 font-medium italic">Amount cannot exceed the member's current balance.</span>
          </label>
        </div>

        <div class="form-control w-full">
          <label class="label pt-0">
            <span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Transaction Date</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Icon icon={Calendar} size={16} />
            </div>
            <input 
              type="date" 
              name="date" 
              value={new Date().toISOString().split('T')[0]} 
              class="input input-bordered focus:input-error w-full pl-12 font-mono" 
              required 
            />
          </div>
        </div>

        <div class="modal-action mt-4 border-t border-slate-100 pt-6">
          <button type="button" class="btn btn-ghost px-8" onClick="document.getElementById('htmx-modal').close()">Cancel</button>
          <button type="submit" class="btn btn-error px-10 rounded-xl shadow-lg shadow-error/20 text-white font-black">
            Withdraw
          </button>
        </div>
      </form>
    </div>
  );
}