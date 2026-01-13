import Icon from '../../components/Icon.jsx';
import { Banknote, Calendar, X, Info } from 'lucide';

export default function LoanRepaymentForm({ memberId, loan, totalPaid = 0 }) {
  // Calculate remaining balance
  const totalDue = loan.principal + (loan.principal * (loan.interestRate / 100) * loan.durationMonths);
  const outstanding = totalDue - totalPaid;
  
  return (
    <div class="p-0">
      <div class="bg-success p-8 text-success-content flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-black flex items-center gap-3">
            <Icon icon={Banknote} size={28} />
            Loan Repayment
          </h2>
          <p class="text-success-content/70 text-sm mt-1 font-medium">Record a payment towards an outstanding loan balance</p>
        </div>
        <form method="dialog">
          <button class="btn btn-circle btn-ghost btn-sm text-success-content">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form 
        hx-post={`/dashboard/members/${memberId}/loans/${loan.id}/pay`}
        hx-target="#htmx-modal-content"
        hx-swap="innerHTML"
        class="p-8 flex flex-col gap-6"
      >
        <div class="card bg-slate-50 border border-slate-200 shadow-inner overflow-hidden">
           <div class="p-4 bg-slate-100/50 border-b border-slate-200 flex justify-between items-center">
              <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Loan Reference</span>
              <span class="text-xs font-mono font-black text-slate-600">#{loan.id.substring(0,8).toUpperCase()}</span>
           </div>
           <div class="p-4 space-y-2">
              <div class="flex justify-between text-sm">
                 <span class="text-slate-500">Total Contract Value</span>
                 <span class="font-bold text-slate-700">{totalDue.toLocaleString()} UGX</span>
              </div>
              <div class="flex justify-between text-sm">
                 <span class="text-slate-500">Total Paid to Date</span>
                 <span class="font-bold text-success">-{totalPaid.toLocaleString()} UGX</span>
              </div>
              <div class="divider my-1 opacity-50"></div>
              <div class="flex justify-between">
                 <span class="text-xs font-black uppercase tracking-tighter text-slate-400">Remaining Balance</span>
                 <span class="text-lg font-black text-error">{outstanding.toLocaleString()} UGX</span>
              </div>
           </div>
        </div>

        <div class="form-control w-full">
          <label class="label pt-0">
            <span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Payment Amount (UGX)</span>
          </label>
          <div class="relative">
            <input 
              type="number" 
              name="amount" 
              placeholder="0" 
              class="input input-bordered focus:input-success w-full text-lg font-black" 
              required 
              max={outstanding}
              autofocus
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 font-bold text-xs uppercase">UGX</div>
          </div>
        </div>

        <div class="form-control w-full">
          <label class="label pt-0">
            <span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Payment Date</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Icon icon={Calendar} size={16} />
            </div>
            <input 
              type="date" 
              name="date" 
              value={new Date().toISOString().split('T')[0]} 
              class="input input-bordered focus:input-success w-full pl-12 font-mono" 
              required 
            />
          </div>
        </div>

        <div class="modal-action mt-4 border-t border-slate-100 pt-6">
          <button type="button" class="btn btn-ghost px-8" onClick="document.getElementById('htmx-modal').close()">Cancel</button>
          <button type="submit" class="btn btn-success px-10 rounded-xl shadow-lg shadow-success/20 text-white font-black">
            Record Payment
          </button>
        </div>
      </form>
    </div>
  );
}
