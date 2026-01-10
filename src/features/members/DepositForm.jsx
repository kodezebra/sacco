import Icon from '../../components/Icon.jsx';
import { Wallet } from 'lucide';

export default function DepositForm({ memberId }) {
  return (
    <form
      hx-post={`/dashboard/members/${memberId}/savings`}
      hx-swap="none" // OOB swaps will handle updates
    >
      <div class="flex items-center gap-2 mb-6">
        <Icon icon={Wallet} size={24} class="text-success" />
        <h3 class="font-bold text-lg">New Savings Deposit</h3>
      </div>

      <div class="space-y-4">
        <input type="hidden" name="memberId" value={memberId} />
        <div class="form-control w-full">
            <label class="label"><span class="label-text font-medium">Deposit Amount (UGX)</span></label>
            <input type="number" name="amount" class="input input-bordered w-full" required min="1000" />
        </div>
        <div class="form-control w-full">
            <label class="label"><span class="label-text font-medium">Date</span></label>
            <input type="date" name="date" class="input input-bordered w-full" defaultValue={new Date().toISOString().split('T')[0]} required />
        </div>
      </div>

      <div class="modal-action mt-8">
        <button type="button" class="btn" onclick="document.getElementById('htmx-modal').close()">Cancel</button>
        <button type="submit" class="btn btn-primary">
          Record Deposit
        </button>
      </div>
    </form>
  );
}
