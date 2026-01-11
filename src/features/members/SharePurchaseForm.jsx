import Icon from '../../components/Icon.jsx';
import { PieChart, Calendar } from 'lucide';

export default function SharePurchaseForm({ memberId }) {
  return (
    <div class="p-2">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-primary/10 text-primary rounded-lg">
          <Icon icon={PieChart} size={24} />
        </div>
        <div>
          <h3 class="text-xl font-bold">Buy Shares</h3>
          <p class="text-sm text-slate-500">Increase member's share capital (equity)</p>
        </div>
      </div>

      <form 
        hx-post={`/dashboard/members/${memberId}/shares`}
        hx-target="#htmx-modal-content"
        hx-swap="innerHTML"
        class="space-y-4"
      >
        <div class="form-control">
          <label class="label"><span class="label-text font-semibold">Investment Amount (UGX)</span></label>
          <div class="relative">
            <input type="number" name="amount" placeholder="200000" class="input input-bordered w-full pr-12" required />
            <div class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 text-sm font-medium">UGX</div>
          </div>
        </div>

        <div class="form-control">
          <label class="label"><span class="label-text font-semibold">Transaction Date</span></label>
          <input type="date" name="date" value={new Date().toISOString().split('T')[0]} class="input input-bordered w-full" required />
        </div>

        <div class="modal-action mt-8">
          <button type="button" class="btn btn-ghost" onClick="document.getElementById('htmx-modal').close()">Cancel</button>
          <button type="submit" class="btn btn-primary px-8">Confirm Purchase</button>
        </div>
      </form>
    </div>
  );
}
