import Icon from '../../components/Icon.jsx';
import { PieChart, Calendar, X, ShieldCheck } from 'lucide';

export default function SharePurchaseForm({ memberId }) {
  return (
    <div class="p-0">
      <div class="bg-primary p-8 text-primary-content flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-black flex items-center gap-3">
            <Icon icon={PieChart} size={28} />
            Buy Share Capital
          </h2>
          <p class="text-primary-content/70 text-sm mt-1 font-medium">Increase member's equity stake in the SACCO</p>
        </div>
        <form method="dialog">
          <button class="btn btn-circle btn-ghost btn-sm text-primary-content">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form 
        hx-post={`/dashboard/members/${memberId}/shares`}
        hx-target="#htmx-modal-content"
        hx-swap="innerHTML"
        class="p-8 flex flex-col gap-6"
      >
        <div class="alert alert-info/10 border-info/20 text-xs font-medium text-info">
           <Icon icon={ShieldCheck} size={16} />
           <div>Shares represent non-withdrawable equity and may earn dividends.</div>
        </div>

        <div class="form-control w-full">
          <label class="label pt-0">
            <span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Investment Amount (UGX)</span>
          </label>
          <div class="relative">
            <input 
              type="number" 
              name="amount" 
              placeholder="0" 
              class="input input-bordered focus:input-primary w-full text-lg font-black" 
              required 
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
              value={new Date().toISOString().split('T')[0]} 
              class="input input-bordered focus:input-primary w-full pl-12 font-mono" 
              required 
            />
          </div>
        </div>

        <div class="modal-action mt-4 border-t border-slate-100 pt-6">
          <button type="button" class="btn btn-ghost px-8" onClick="document.getElementById('htmx-modal').close()">Cancel</button>
          <button type="submit" class="btn btn-primary px-10 rounded-xl shadow-lg shadow-primary/20 font-black">
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}
