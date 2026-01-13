import Icon from '../../components/Icon.jsx';
import { Banknote, Calendar, Percent, Clock, X, Info } from 'lucide';

export default function LoanForm({ memberId, defaults = {} }) {
  return (
    <div class="p-0">
      <div class="bg-primary p-8 text-primary-content flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-black flex items-center gap-3">
            <Icon icon={Banknote} size={28} />
            Issue New Loan
          </h2>
          <p class="text-primary-content/70 text-sm mt-1 font-medium">Record a new formal credit agreement for this member</p>
        </div>
        <form method="dialog">
          <button class="btn btn-circle btn-ghost btn-sm text-primary-content">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form 
        hx-post={`/dashboard/members/${memberId}/loans`}
        hx-target="#htmx-modal-content"
        hx-swap="innerHTML"
        class="p-8 flex flex-col gap-6"
      >
        <div class="alert alert-info/10 border-info/20 text-xs font-medium text-info">
           <Icon icon={Info} size={16} />
           <div>Terms and interest calculations follow the default SACCO policy.</div>
        </div>

        <div class="form-control w-full">
          <label class="label pt-0">
            <span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Principal Amount (UGX)</span>
          </label>
          <div class="relative">
            <input 
              type="number" 
              name="principal" 
              placeholder="0" 
              class="input input-bordered focus:input-primary w-full text-lg font-black" 
              required 
              autofocus
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 font-bold text-xs uppercase">UGX</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control w-full">
            <label class="label pt-0">
              <span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Interest Rate (%)</span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Icon icon={Percent} size={16} /></div>
              <input type="number" step="0.1" name="interestRate" value={defaults.defaultInterestRate || 5} class="input input-bordered focus:input-primary w-full pl-12 font-bold" required />
            </div>
            <label class="label"><span class="label-text-alt text-slate-400 font-medium italic">Monthly flat rate</span></label>
          </div>

          <div class="form-control w-full">
            <label class="label pt-0">
              <span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Duration (Months)</span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Icon icon={Clock} size={16} /></div>
              <input type="number" name="durationMonths" value={defaults.defaultLoanDuration || 6} class="input input-bordered focus:input-primary w-full pl-12 font-bold" required />
            </div>
          </div>
        </div>

        <div class="form-control w-full">
          <label class="label pt-0">
            <span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Disbursement Date</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Icon icon={Calendar} size={16} /></div>
            <input type="date" name="issuedDate" value={new Date().toISOString().split('T')[0]} class="input input-bordered focus:input-primary w-full pl-12 font-mono" required />
          </div>
        </div>

        <div class="modal-action mt-4 border-t border-slate-100 pt-6">
          <button type="button" class="btn btn-ghost px-8" onClick="document.getElementById('htmx-modal').close()">Cancel</button>
          <button type="submit" class="btn btn-primary px-10 rounded-xl shadow-lg shadow-primary/20 font-black">
            Issue
          </button>
        </div>
      </form>
    </div>
  );
}
