import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { ArrowLeft, Check, Search, Users, Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide';

export default function SavingsTransactionPage({ members = [], initialType = 'deposit' }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <DashboardLayout title={`Record Savings ${initialType === 'deposit' ? 'Deposit' : 'Withdrawal'}`}>
      <div class="mx-auto max-w-270">
        <PageHeader 
          title={initialType === 'deposit' ? 'Add Savings' : 'Withdraw Savings'}
          subtitle={`Record a new ${initialType} transaction.`}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Savings', href: '/dashboard/savings' },
            { label: initialType === 'deposit' ? 'Deposit' : 'Withdraw', href: `/dashboard/savings/new?type=${initialType}`, active: true }
          ]}
        />

        <div class="grid grid-cols-1 gap-9 lg:grid-cols-5">
          <div class="flex flex-col gap-9 lg:col-span-3">
            <div class="rounded-sm border border-stroke bg-white shadow-default">
              <div class="border-b border-stroke py-4 px-6.5">
                <h3 class="font-medium text-black">Transaction Details</h3>
              </div>
              
              <form 
                hx-post="/dashboard/savings" 
                hx-push-url="true"
                hx-target="body"
                class="p-6.5"
              >
                <input type="hidden" name="type" value={initialType} />

                <div class="mb-4.5">
                  <label class="mb-2.5 block text-black font-medium">Select Member</label>
                  <div class="relative z-20 bg-transparent rounded border border-stroke focus-within:border-primary p-1">
                      <div class="flex items-center px-3 border-b border-stroke mb-1">
                          <Icon icon={Search} size={18} class="text-body mr-2" />
                          <input 
                            type="text" 
                            id="member-search"
                            placeholder="Type to filter members..."
                            class="w-full bg-transparent py-2 text-sm outline-none text-black"
                            onkeyup="
                                const filter = this.value.toLowerCase();
                                const options = document.querySelectorAll('#member-select option');
                                options.forEach(opt => {
                                    if(opt.value === '') return;
                                    const text = opt.text.toLowerCase();
                                    opt.style.display = text.includes(filter) ? '' : 'none';
                                });
                            "
                          />
                      </div>
                      <select 
                        name="memberId" 
                        id="member-select"
                        size="5"
                        class="relative z-20 w-full appearance-none bg-transparent py-2 px-3 outline-none transition text-black text-sm h-[150px]"
                        required
                      >
                        {members.map(m => (
                            <option key={m.id} value={m.id} class="py-1 px-2 hover:bg-primary/10 cursor-pointer rounded-sm">
                                {m.fullName} — {m.memberNumber}
                            </option>
                        ))}
                      </select>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-6 mb-4.5">
                  <div>
                    <label class="mb-2.5 block text-black font-medium text-sm uppercase">Amount (UGX)</label>
                    <input 
                      type="number" 
                      name="amount" 
                      placeholder="0" 
                      min="100"
                      class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-bold outline-none transition focus:border-primary active:border-primary text-black"
                      required
                    />
                  </div>
                  <div>
                    <label class="mb-2.5 block text-black font-medium text-sm uppercase">Date</label>
                    <input 
                      type="date" 
                      name="date"
                      defaultValue={today}
                      class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black"
                      required
                    />
                  </div>
                </div>

                <div class="flex justify-end gap-4.5">
                    <a href="/dashboard/savings" class="flex justify-center rounded border border-stroke py-3 px-6 font-medium text-black hover:shadow-1 transition">
                        Cancel
                    </a>
                    <button type="submit" class={`flex justify-center rounded py-3 px-6 font-medium text-white hover:bg-opacity-90 shadow-default ${initialType === 'deposit' ? 'bg-success' : 'bg-error'}`}>
                        {initialType === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdrawal'}
                    </button>
                </div>
              </form>
            </div>
          </div>

          <div class="flex flex-col gap-9 lg:col-span-2">
             <div class="rounded-sm border border-stroke bg-white shadow-default">
                <div class="border-b border-stroke py-4 px-6.5">
                    <h3 class="font-medium text-black">Information</h3>
                </div>
                <div class="p-6.5">
                    <div class="mb-4 flex items-center gap-3">
                        <div class={`h-10 w-10 flex items-center justify-center rounded-full ${initialType === 'deposit' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                           <Icon icon={initialType === 'deposit' ? ArrowDownLeft : ArrowUpRight} size={20} />
                        </div>
                        <h4 class="font-bold text-black uppercase">{initialType} Action</h4>
                    </div>
                    <p class="text-sm text-body leading-relaxed">
                        {initialType === 'deposit' 
                          ? 'Deposits increase the member balance. Ensure the cash has been physically received before confirming.' 
                          : 'Withdrawals reduce the member balance. Verify the member has sufficient funds before processing.'}
                    </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}