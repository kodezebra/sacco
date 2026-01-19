import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { ArrowRightLeft, X, Building2, Calendar, Tag, ArrowLeft, Check, Plus } from 'lucide';

export default function NewTransactionPage({ associations = [], selectedId = '', initialType = 'income', errors = {}, values = {} }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <DashboardLayout title="Record Transaction">
      <div class="mx-auto max-w-270">
        <PageHeader 
          title="Single Ledger Entry"
          subtitle="Record a new income or expense transaction."
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Ledger', href: '/dashboard/transactions' },
            { label: 'New Entry', href: '/dashboard/transactions/new', active: true }
          ]}
        />

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-9">
          <div class="lg:col-span-3">
            <div class="rounded-sm border border-stroke bg-white shadow-default">
              <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50">
                <h3 class="font-bold text-black flex items-center gap-2 text-sm uppercase">
                   <Icon icon={ArrowRightLeft} size={18} />
                   Transaction Details
                </h3>
              </div>

              <form action="/dashboard/transactions" method="POST" class="p-6.5">
                {Object.keys(errors).length > 0 && (
                  <div class="p-4 mb-6 bg-error/10 text-error text-sm rounded-sm border border-error/20 font-bold">
                    Please correct the highlighted errors below.
                  </div>
                )}

                {/* Transaction Type Selection */}
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <label class={`relative flex cursor-pointer select-none items-center justify-center gap-2 rounded border p-4 transition-all ${values.type === 'income' || initialType === 'income' ? 'bg-success/5 border-success border-2' : 'border-stroke hover:bg-whiten'}`}>
                    <input 
                      type="radio" 
                      name="type" 
                      value="income" 
                      class="hidden" 
                      defaultChecked={values.type ? values.type === 'income' : initialType === 'income'}
                      onclick="this.parentElement.parentElement.querySelectorAll('label').forEach(l => l.classList.remove('bg-success/5', 'bg-error/5', 'border-success', 'border-error', 'border-2')); this.parentElement.classList.add('bg-success/5', 'border-success', 'border-2');"
                    />
                    <div class={`h-4 w-4 rounded-full border-2 border-stroke flex items-center justify-center ${(values.type === 'income' || initialType === 'income') ? 'border-success' : ''}`}>
                        <div class={`h-2 w-2 rounded-full bg-success ${(values.type === 'income' || initialType === 'income') ? 'block' : 'hidden'}`}></div>
                    </div>
                    <span class="text-sm font-black text-success uppercase tracking-widest">Income (+)</span>
                  </label>
                  
                  <label class={`relative flex cursor-pointer select-none items-center justify-center gap-2 rounded border p-4 transition-all ${values.type === 'expense' || initialType === 'expense' ? 'bg-error/5 border-error border-2' : 'border-stroke hover:bg-whiten'}`}>
                    <input 
                      type="radio" 
                      name="type" 
                      value="expense" 
                      class="hidden" 
                      defaultChecked={values.type ? values.type === 'expense' : initialType === 'expense'}
                      onclick="this.parentElement.parentElement.querySelectorAll('label').forEach(l => l.classList.remove('bg-success/5', 'bg-error/5', 'border-success', 'border-error', 'border-2')); this.parentElement.classList.add('bg-error/5', 'border-error', 'border-2');"
                    />
                    <div class={`h-4 w-4 rounded-full border-2 border-stroke flex items-center justify-center ${(values.type === 'expense' || initialType === 'expense') ? 'border-error' : ''}`}>
                        <div class={`h-2 w-2 rounded-full bg-error ${(values.type === 'expense' || initialType === 'expense') ? 'block' : 'hidden'}`}></div>
                    </div>
                    <span class="text-sm font-black text-error uppercase tracking-widest">Expense (-)</span>
                  </label>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">Business Unit</label>
                    <div class="relative z-20 bg-transparent">
                       <select 
                         name="associationId" 
                         defaultValue={values.associationId || selectedId}
                         class={`relative z-20 w-full appearance-none rounded border-[1.5px] bg-transparent py-3 px-5 pl-11 outline-none transition focus:border-primary active:border-primary text-black ${errors.associationId ? 'border-error' : 'border-stroke'}`}
                         required
                       >
                         <option value="" disabled>Select Unit...</option>
                         {associations.map(assoc => (
                           <option key={assoc.id} value={assoc.id}>{assoc.name}</option>
                         ))}
                       </select>
                       <span class="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                          <Icon icon={Building2} size={18} class="text-bodydark2" />
                       </span>
                    </div>
                  </div>

                  <div>
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">Date</label>
                    <div class="relative">
                      <input 
                        type="date" 
                        name="date" 
                        defaultValue={values.date || today}
                        class={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 pl-11 font-bold outline-none transition focus:border-primary active:border-primary text-black ${errors.date ? 'border-error' : 'border-stroke'}`}
                        required 
                      />
                      <span class="absolute left-4 top-1/2 -translate-y-1/2">
                          <Icon icon={Calendar} size={18} class="text-bodydark2" />
                      </span>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">Amount (UGX)</label>
                    <input 
                      type="number" 
                      name="amount" 
                      defaultValue={values.amount}
                      placeholder="0" 
                      class={`w-full rounded border-[1.5px] bg-slate-50 py-3 px-5 font-black text-lg outline-none transition focus:border-primary active:border-primary text-black ${errors.amount ? 'border-error' : 'border-stroke'}`}
                      required 
                      min="0"
                    />
                  </div>

                  <div>
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">Category</label>
                    <div class="relative z-20 bg-transparent">
                        <select 
                          name="category" 
                          defaultValue={values.category || "Sales"}
                          class="w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-11 outline-none focus:border-primary active:border-primary text-black"
                        >
                          <option>Sales</option>
                          <option>Service Fee</option>
                          <option>Supplies</option>
                          <option>Maintenance</option>
                          <option>Salary</option>
                          <option>Fuel</option>
                          <option>Utilities</option>
                          <option>Consulting</option>
                          <option>Other</option>
                        </select>
                        <span class="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                            <Icon icon={Tag} size={18} class="text-bodydark2" />
                        </span>
                    </div>
                  </div>
                </div>

                <div class="mb-8">
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">Description / Narration</label>
                    <textarea 
                      name="description" 
                      defaultValue={values.description}
                      placeholder="Enter specific details about this entry..." 
                      class={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black h-24 ${errors.description ? 'border-error' : 'border-stroke'}`}
                      required
                    ></textarea>
                </div>

                <div class="flex justify-end gap-4 border-t border-stroke pt-6">
                    <a href="/dashboard/transactions" class="flex justify-center rounded border border-stroke py-3 px-8 font-medium text-black hover:shadow-1 transition">
                        Cancel
                    </a>
                    <button type="submit" class="flex justify-center rounded bg-primary py-3 px-10 font-bold text-white hover:bg-opacity-90 shadow-default uppercase tracking-widest flex items-center gap-2">
                        <Icon icon={Check} size={18} />
                        Record Transaction
                    </button>
                </div>
              </form>
            </div>
          </div>

          <div class="lg:col-span-2">
             <div class="rounded-sm border border-stroke bg-white shadow-default">
                <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50">
                    <h3 class="font-bold text-black text-sm uppercase tracking-widest">Journaling Info</h3>
                </div>
                <div class="p-6.5">
                    <div class="bg-primary/5 p-4 rounded-sm border-l-4 border-primary mb-6">
                        <h4 class="font-bold text-primary text-xs uppercase mb-1">Batch Entry?</h4>
                        <p class="text-xs text-black font-medium leading-relaxed">
                            To record multiple items at once, use the <strong>Transaction Journal</strong> under the Business Unit detail page.
                        </p>
                    </div>
                    
                    <ul class="text-xs text-body font-medium space-y-3">
                        <li class="flex gap-2">
                            <Icon icon={Check} size={14} class="text-success shrink-0" />
                            <span>Amounts are recorded in UGX.</span>
                        </li>
                        <li class="flex gap-2">
                            <Icon icon={Check} size={14} class="text-success shrink-0" />
                            <span>This will immediately affect the Unit's P&L.</span>
                        </li>
                    </ul>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}