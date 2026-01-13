import Icon from '../../components/Icon.jsx';
import { ArrowRightLeft, X, Building2 } from 'lucide';

export default function NewTransactionForm({ associations = [], selectedId = '', initialType = '' }) {
  return (
    <div class="rounded-sm border border-stroke bg-white shadow-default" id="transaction-form-container">
      <div class="border-b border-stroke py-4 px-6.5 flex justify-between items-center">
        <h3 class="font-medium text-black flex items-center gap-2">
           <Icon icon={ArrowRightLeft} size={20} />
           Record Transaction
        </h3>
        <form method="dialog">
          <button class="hover:text-primary">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form 
        hx-post="/dashboard/transactions" 
        hx-target="#transaction-form-container"
        hx-swap="outerHTML"
        class="flex flex-col gap-5.5 p-6.5"
      >
        {/* Transaction Type Selection */}
        <div class="grid grid-cols-2 gap-4">
          <label class="relative flex cursor-pointer select-none items-center gap-2 rounded border border-stroke p-3 hover:bg-whiten">
            <input 
              type="radio" 
              name="type" 
              value="income" 
              class="h-5 w-5 border-stroke accent-success" 
              required 
              defaultChecked={initialType === 'income'}
            />
            <span class="text-sm font-bold text-success">INCOME (+)</span>
          </label>
          
          <label class="relative flex cursor-pointer select-none items-center gap-2 rounded border border-stroke p-3 hover:bg-whiten">
            <input 
              type="radio" 
              name="type" 
              value="expense" 
              class="h-5 w-5 border-stroke accent-error" 
              required 
              defaultChecked={initialType === 'expense'}
            />
            <span class="text-sm font-bold text-error">EXPENSE (-)</span>
          </label>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="mb-3 block text-black font-medium text-sm">Amount (UGX)</label>
            <input 
              type="number" 
              name="amount" 
              placeholder="0" 
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-bold outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-black" 
              required 
              min="0"
            />
          </div>

          <div>
            <label class="mb-3 block text-black font-medium text-sm">Business Unit</label>
            <div class="relative z-20 bg-transparent">
               <select name="associationId" class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 pl-11 outline-none transition focus:border-primary active:border-primary text-black" required>
                 <option value="" disabled selected={!selectedId}>Select Unit...</option>
                 {associations.map(assoc => (
                   <option key={assoc.id} value={assoc.id} selected={assoc.id === selectedId}>{assoc.name}</option>
                 ))}
               </select>
               <span class="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                  <Icon icon={Building2} size={18} class="text-body" />
               </span>
            </div>
          </div>
        </div>

        <div>
            <label class="mb-3 block text-black font-medium text-sm">Category / Description</label>
            <div class="flex">
               <select name="category" class="rounded-l border-[1.5px] border-stroke bg-transparent py-3 px-4 outline-none focus:border-primary active:border-primary text-black text-sm border-r-0">
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
                  class="w-full rounded-r border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black" 
                  required
               />
            </div>
        </div>
        
        <input type="hidden" name="date" value={new Date().toISOString().split('T')[0]} />
        <input type="hidden" name="is_htmx" value="true" />

        <div class="flex justify-end gap-4.5 mt-2">
          <button 
            type="button" 
            class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 hover:text-primary" 
            onClick={() => document.getElementById('htmx-modal').close()}
          >
            Cancel
          </button>
          <button type="submit" class="flex justify-center rounded bg-secondary py-2 px-6 font-medium text-white hover:bg-opacity-90 shadow-default">
            Save Entry
          </button>
        </div>
      </form>
    </div>
  );
}
