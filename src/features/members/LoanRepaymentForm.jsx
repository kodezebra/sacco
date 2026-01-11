import Icon from '../../components/Icon.jsx';
import { Banknote, Calendar } from 'lucide';

export default function LoanRepaymentForm({ memberId, loan, totalPaid = 0 }) {
  // Calculate remaining balance
  const totalDue = loan.principal + (loan.principal * (loan.interestRate / 100) * loan.durationMonths);
  const outstanding = totalDue - totalPaid;
  
  return (
    <div class="p-2">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-success/10 text-success rounded-lg">
          <Icon icon={Banknote} size={24} />
        </div>
        <div>
          <h3 class="text-xl font-bold">Record Repayment</h3>
          <p class="text-sm text-slate-500">Add a payment for this loan</p>
        </div>
      </div>

      <div class="alert alert-info shadow-sm mb-6 text-xs py-2 flex flex-col gap-1 items-start">
        <div class="font-bold">Loan #{loan.id.substring(0,8)}</div>
        <div class="w-full flex justify-between"><span>Total Due:</span> <span>{totalDue.toLocaleString()} UGX</span></div>
        <div class="w-full flex justify-between"><span>Paid So Far:</span> <span>{totalPaid.toLocaleString()} UGX</span></div>
        <div class="divider my-0"></div>
        <div class="w-full flex justify-between font-bold"><span>Outstanding:</span> <span>{outstanding.toLocaleString()} UGX</span></div>
      </div>

      <form 
        hx-post={`/dashboard/members/${memberId}/loans/${loan.id}/pay`}
        hx-target="#htmx-modal-content"
        hx-swap="innerHTML"
        class="space-y-4"
      >
        <div class="form-control">
          <label class="label"><span class="label-text font-semibold">Payment Amount (UGX)</span></label>
          <div class="relative">
            <input type="number" name="amount" placeholder="50000" class="input input-bordered w-full pr-12" required />
            <div class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 text-sm font-medium">UGX</div>
          </div>
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text font-semibold">Payment Date</span></label>
          <div class="relative">
            <input type="date" name="date" value={new Date().toISOString().split('T')[0]} class="input input-bordered w-full" required />
            <div class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400"><Icon icon={Calendar} size={16} /></div>
          </div>
        </div>

        <div class="modal-action mt-8">
          <button type="button" class="btn btn-ghost" onClick="document.getElementById('htmx-modal').close()">Cancel</button>
          <button type="submit" class="btn btn-success px-8 text-white">Record Payment</button>
        </div>
      </form>
    </div>
  );
}
