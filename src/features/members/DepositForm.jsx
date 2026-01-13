import Icon from '../../components/Icon.jsx';
import { Wallet, X, Calendar } from 'lucide';

export default function DepositForm({ memberId }) {
  return (
    <div class="p-0">
      <div class="bg-success p-8 text-success-content flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-black flex items-center gap-3">
            <Icon icon={Wallet} size={28} />
            Savings Deposit
          </h2>
          <p class="text-success-content/70 text-sm mt-1 font-medium">Record a new cash deposit into the member's account</p>
        </div>
        <form method="dialog">
          <button class="btn btn-circle btn-ghost btn-sm text-success-content">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form
        hx-post={`/dashboard/members/${memberId}/savings`}
        hx-swap="none"
        class="p-8 flex flex-col gap-6"
      >
        <input type="hidden" name="memberId" value={memberId} />
        
        <div class="form-control w-full">
            <label class="label pt-0">
              <span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Deposit Amount (UGX)</span>
            </label>
            <div class="relative">
              <input 
                type="number" 
                name="amount" 
                placeholder="0" 
                class="input input-bordered focus:input-success w-full text-lg font-black" 
                required 
                min="1000" 
                autofocus
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 font-bold text-xs uppercase">UGX</div>
            </div>
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
                class="input input-bordered focus:input-success w-full pl-12 font-mono" 
                defaultValue={new Date().toISOString().split('T')[0]} 
                required 
              />
            </div>
        </div>

        <div class="modal-action mt-4 border-t border-slate-100 pt-6">
          <button type="button" class="btn btn-ghost px-8" onclick="document.getElementById('htmx-modal').close()">Cancel</button>
          <button type="submit" class="btn btn-success px-10 rounded-xl shadow-lg shadow-success/20 text-white font-black">
            Deposit
          </button>
        </div>
      </form>
    </div>
  );
}
