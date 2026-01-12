import Icon from '../../components/Icon.jsx';
import { ArrowRightLeft, X, Building2, Tag } from 'lucide';

export default function NewTransactionForm({ associations = [], selectedId = '', initialType = '' }) {
  return (
    <div class="p-0" id="transaction-form-container">
      <div class="bg-base-200 p-8 flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-bold flex items-center gap-2">
            <Icon icon={ArrowRightLeft} size={24} />
            Record Transaction
          </h2>
          <p class="text-base-content/70 text-sm mt-1">Log income or expense for a business unit</p>
        </div>
        <form method="dialog">
          <button class="btn btn-circle btn-ghost btn-sm">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form 
        hx-post="/dashboard/transactions" 
        hx-target="#transaction-form-container"
        hx-swap="outerHTML"
        class="p-8 flex flex-col gap-6"
      >
        {/* Transaction Type Selection */}
        <div class="grid grid-cols-2 gap-4">
          <label class="cursor-pointer label border border-base-300 rounded-lg p-4 has-[:checked]:border-success has-[:checked]:bg-success/10 transition-all">
            <span class="label-text font-bold text-success flex items-center gap-2">
               INCOME (+)
            </span>
            <input 
              type="radio" 
              name="type" 
              value="income" 
              class="radio radio-success" 
              required 
              checked={initialType === 'income'}
            />
          </label>
          
          <label class="cursor-pointer label border border-base-300 rounded-lg p-4 has-[:checked]:border-error has-[:checked]:bg-error/10 transition-all">
            <span class="label-text font-bold text-error flex items-center gap-2">
               EXPENSE (-)
            </span>
            <input 
              type="radio" 
              name="type" 
              value="expense" 
              class="radio radio-error" 
              required 
              checked={initialType === 'expense'}
            />
          </label>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-bold uppercase tracking-wider text-xs">Amount (UGX)</span>
            </label>
            <input 
              type="number" 
              name="amount" 
              placeholder="0" 
              class="input input-bordered focus:input-primary w-full text-lg font-mono" 
              required 
              min="0"
            />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-bold uppercase tracking-wider text-xs">Business Unit</span>
            </label>
            <div class="input-group">
               <span><Icon icon={Building2} size={16} /></span>
               <select name="associationId" class="select select-bordered focus:select-primary w-full" required>
                 <option value="" disabled selected={!selectedId}>Select Unit...</option>
                 {associations.map(assoc => (
                   <option key={assoc.id} value={assoc.id} selected={assoc.id === selectedId}>{assoc.name}</option>
                 ))}
               </select>
            </div>
          </div>
        </div>

        <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-bold uppercase tracking-wider text-xs">Category / Description</span>
            </label>
            <div class="join w-full">
               <select name="category" class="select select-bordered join-item w-1/3">
                 <option>Sales</option>
                 <option>Service Fee</option>
                 <option>Supplies</option>
                 <option>Maintenance</option>
                 <option>Salary</option>
                 <option>Fuel</option>
                 <option>Utilities</option>
                 <option>Other</option>
               </select>
               <input 
                  type="text" 
                  name="description" 
                  placeholder="Details (e.g. Sold 50 trays of eggs)" 
                  class="input input-bordered join-item w-2/3" 
                  required
               />
            </div>
        </div>
        
        <input type="hidden" name="date" value={new Date().toISOString().split('T')[0]} />
        <input type="hidden" name="is_htmx" value="true" />

        <div class="flex justify-end gap-3 mt-4">
          <button 
            type="button" 
            class="btn btn-ghost" 
            onClick="document.getElementById('htmx-modal').close()"
          >
            Done
          </button>
          <button type="submit" class="btn btn-neutral px-8">
            Save & Add Another
          </button>
        </div>
      </form>
    </div>
  );
}
