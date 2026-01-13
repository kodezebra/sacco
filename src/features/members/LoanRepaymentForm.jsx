import Icon from '../../components/Icon.jsx';
import { Banknote, Calendar, X, Info } from 'lucide';

export default function LoanRepaymentForm({ memberId, loan, totalPaid = 0 }) {
  // Calculate remaining balance
  const totalDue = loan.principal + (loan.principal * (loan.interestRate / 100) * loan.durationMonths);
  const outstanding = totalDue - totalPaid;
  
  return (
    <div class="rounded-sm border border-stroke bg-white shadow-default">
      <div class="border-b border-stroke py-4 px-6.5 flex justify-between items-center">
        <h3 class="font-medium text-black flex items-center gap-2">
           <Icon icon={Banknote} size={20} />
           Loan Repayment
        </h3>
        <form method="dialog">
          <button class="hover:text-primary">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form 
        hx-post={`/dashboard/members/${memberId}/loans/${loan.id}/pay`}
        hx-target="#htmx-modal-content"
        hx-swap="innerHTML"
        class="flex flex-col gap-5.5 p-6.5"
      >
        <div class="rounded-sm border border-stroke bg-gray-2 shadow-inner overflow-hidden">
           <div class="px-4.5 py-3 border-b border-stroke flex justify-between items-center bg-whiten">
              <span class="text-xs font-bold uppercase tracking-widest text-body">Loan Reference</span>
              <span class="text-xs font-mono font-black text-black">#{loan.id.substring(0,8).toUpperCase()}</span>
           </div>
           <div class="p-4.5 space-y-2">
              <div class="flex justify-between text-sm">
                 <span class="text-body">Total Contract Value</span>
                 <span class="font-bold text-black">{totalDue.toLocaleString()} UGX</span>
              </div>
              <div class="flex justify-between text-sm">
                 <span class="text-body">Total Paid to Date</span>
                 <span class="font-bold text-success">-{totalPaid.toLocaleString()} UGX</span>
              </div>
              <div class="my-2 border-t border-stroke border-dashed"></div>
              <div class="flex justify-between items-center">
                 <span class="text-xs font-bold uppercase tracking-widest text-body">Remaining</span>
                 <span class="text-lg font-black text-error">{outstanding.toLocaleString()} UGX</span>
              </div>
           </div>
        </div>

        <div>
          <label class="mb-3 block text-black font-medium text-sm">Payment Amount</label>
          <div class="relative">
            <input 
              type="number" 
              name="amount" 
              placeholder="0" 
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-bold outline-none transition focus:border-success active:border-success disabled:cursor-default disabled:bg-whiter text-black text-lg" 
              required 
              max={outstanding}
              autofocus
            />
            <span class="absolute right-4.5 top-3.5 text-sm font-bold text-body">UGX</span>
          </div>
        </div>

        <div>
          <label class="mb-3 block text-black font-medium text-sm">Payment Date</label>
          <div class="relative">
            <input 
              type="date" 
              name="date" 
              value={new Date().toISOString().split('T')[0]} 
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-12 font-medium outline-none transition focus:border-success active:border-success disabled:cursor-default disabled:bg-whiter text-black" 
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
          <button type="submit" class="flex justify-center rounded bg-success py-2 px-6 font-medium text-white hover:bg-opacity-90 shadow-default">
            Confirm Payment
          </button>
        </div>
      </form>
    </div>
  );
}
