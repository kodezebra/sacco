import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { Wallet, ArrowLeft, Check, Calendar, Info, TrendingDown, AlertCircle } from 'lucide';

export default function MemberWithdrawPage({ member, maxAmount = 0, defaults = {}, errors = {}, values = {} }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <DashboardLayout title={`Withdraw: ${member.fullName}`}>
      <div class="mx-auto max-w-270">
        <PageHeader 
          title="Savings Withdrawal"
          subtitle={`Process withdrawal for ${member.fullName}`}
          backHref={`/dashboard/members/${member.id}`}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Members', href: '/dashboard/members' },
            { label: member.fullName, href: `/dashboard/members/${member.id}` },
            { label: 'Withdraw', href: `/dashboard/members/${member.id}/withdraw`, active: true }
          ]}
        />

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-9">
          <div class="lg:col-span-3">
            <div class="rounded-sm border border-stroke bg-white shadow-default">
              <div class="border-b border-stroke py-4 px-6.5 bg-error/5">
                <h3 class="font-bold text-black flex items-center gap-2 text-sm uppercase">
                   <Icon icon={Wallet} size={18} class="text-error" />
                   Record Cash Outward
                </h3>
              </div>

              <form hx-post={`/dashboard/members/${member.id}/withdraw`} hx-push-url="true" hx-target="body" class="p-6.5">
                <input type="hidden" name="type" value="withdrawal" />
                
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-black font-black text-[10px] uppercase tracking-widest">Amount to Withdraw</label>
                        <span class="text-[10px] font-black text-error uppercase tracking-widest bg-error/5 px-2 py-0.5 rounded">Max: {maxAmount.toLocaleString()} UGX</span>
                    </div>
                    <input 
                      type="number" 
                      name="amount" 
                      defaultValue={values.amount}
                      placeholder="0" 
                      max={maxAmount}
                      class={`w-full rounded border-[1.5px] bg-slate-50 py-3 px-5 font-black text-2xl outline-none transition focus:border-error active:border-error text-black ${errors.amount ? 'border-error' : 'border-stroke'}`}
                      required 
                      min="100"
                      autofocus
                    />
                    {errors.amount && <p class="text-error text-xs mt-1 font-bold">{errors.amount}</p>}
                </div>

                <div class="mb-10">
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">Date of Transaction</label>
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

                <div class="flex justify-end gap-4 border-t border-stroke pt-6">
                    <a href={`/dashboard/members/${member.id}`} class="flex justify-center rounded border border-stroke py-3 px-8 font-medium text-black hover:shadow-1 transition">
                        Cancel
                    </a>
                    <button type="submit" class="flex justify-center rounded bg-error py-3 px-10 font-bold text-white hover:bg-opacity-90 shadow-default uppercase tracking-widest flex items-center gap-2">
                        <Icon icon={Check} size={18} />
                        Confirm Withdrawal
                    </button>
                </div>
              </form>
            </div>
          </div>

          <div class="lg:col-span-2">
             <div class="rounded-sm border border-stroke bg-white shadow-default">
                <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50">
                    <h3 class="font-bold text-black text-sm uppercase tracking-widest">Warning</h3>
                </div>
                <div class="p-6.5">
                    <div class="bg-error/5 p-4 rounded-sm border-l-4 border-error mb-6">
                        <h4 class="font-bold text-error text-xs uppercase mb-1">Borrowing Power</h4>
                        <p class="text-xs text-black font-medium leading-relaxed">
                            Withdrawals immediately reduce the member's borrowing capacity.
                        </p>
                    </div>
                    
                    <div class="flex gap-3 text-[10px] text-body font-bold uppercase tracking-widest italic border border-stroke p-4 bg-gray-50">
                        <Icon icon={AlertCircle} size={16} class="text-warning shrink-0" />
                        <span>Ensure the member has provided physical ID and signed the withdrawal voucher before disbursing cash.</span>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}