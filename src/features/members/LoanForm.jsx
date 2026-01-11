import Icon from '../../components/Icon.jsx';
import { Banknote, Calendar, Percent, Clock } from 'lucide';

export default function LoanForm({ memberId, defaults = {} }) {
  return (
    <div class="p-2">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-primary/10 text-primary rounded-lg">
          <Icon icon={Banknote} size={24} />
        </div>
        <div>
          <h3 class="text-xl font-bold">Issue New Loan</h3>
          <p class="text-sm text-slate-500">Record a new loan agreement</p>
        </div>
      </div>

      <form 
        hx-post={`/dashboard/members/${memberId}/loans`}
        hx-target="#htmx-modal-content"
        hx-swap="innerHTML"
        class="space-y-4"
      >
        <div class="form-control">
          <label class="label"><span class="label-text font-semibold">Principal Amount (UGX)</span></label>
          <div class="relative">
            <input type="number" name="principal" placeholder="1000000" class="input input-bordered w-full pr-12" required />
            <div class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 text-sm font-medium">UGX</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label"><span class="label-text font-semibold">Interest Rate (%)</span></label>
            <div class="relative">
              <input type="number" step="0.1" name="interestRate" value={defaults.defaultInterestRate || 5} class="input input-bordered w-full" required />
              <div class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400"><Icon icon={Percent} size={16} /></div>
            </div>
            <label class="label"><span class="label-text-alt text-slate-400">Monthly flat rate</span></label>
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text font-semibold">Duration (Months)</span></label>
            <div class="relative">
              <input type="number" name="durationMonths" value={defaults.defaultLoanDuration || 6} class="input input-bordered w-full" required />
              <div class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400"><Icon icon={Clock} size={16} /></div>
            </div>
          </div>
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text font-semibold">Disbursement Date</span></label>
          <input type="date" name="issuedDate" value={new Date().toISOString().split('T')[0]} class="input input-bordered w-full" required />
        </div>

        <div class="modal-action mt-8">
          <button type="button" class="btn btn-ghost" onClick="document.getElementById('htmx-modal').close()">Cancel</button>
          <button type="submit" class="btn btn-primary px-8">Issue Loan</button>
        </div>
      </form>
    </div>
  );
}
