import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Wallet, ArrowLeft, Check, Search, Calendar, Info, TrendingUp } from 'lucide';

export default function MemberDepositPage({ member, defaults = {}, errors = {}, values = {} }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <DashboardLayout title={`Deposit: ${member.fullName}`}>
      <div class="mx-auto max-w-270">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-title-md2 font-bold text-black uppercase tracking-tight">Savings Deposit</h2>
          <nav>
            <ol class="flex items-center gap-2">
              <li><a class="font-medium" href={`/dashboard/members/${member.id}`}>{member.fullName} /</a></li>
              <li class="font-medium text-primary">Deposit</li>
            </ol>
          </nav>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-9">
          <div class="lg:col-span-3">
            <div class="rounded-sm border border-stroke bg-white shadow-default">
              <div class="border-b border-stroke py-4 px-6.5 bg-success/5">
                <h3 class="font-bold text-black flex items-center gap-2 text-sm uppercase">
                   <Icon icon={Wallet} size={18} class="text-success" />
                   Record Cash Inward
                </h3>
              </div>

              <form hx-post={`/dashboard/members/${member.id}/savings`} hx-push-url="true" hx-target="body" class="p-6.5">
                <input type="hidden" name="type" value="deposit" />
                
                <div class="mb-6">
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">Amount (UGX)</label>
                    <input 
                      type="number" 
                      name="amount" 
                      defaultValue={values.amount}
                      placeholder="0" 
                      class={`w-full rounded border-[1.5px] bg-slate-50 py-3 px-5 font-black text-2xl outline-none transition focus:border-success active:border-success text-black ${errors.amount ? 'border-error' : 'border-stroke'}`}
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
                    <button type="submit" class="flex justify-center rounded bg-success py-3 px-10 font-bold text-white hover:bg-opacity-90 shadow-default uppercase tracking-widest flex items-center gap-2">
                        <Icon icon={Check} size={18} />
                        Confirm Deposit
                    </button>
                </div>
              </form>
            </div>
          </div>

          <div class="lg:col-span-2">
             <div class="rounded-sm border border-stroke bg-white shadow-default">
                <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50">
                    <h3 class="font-bold text-black text-sm uppercase tracking-widest">Transaction Info</h3>
                </div>
                <div class="p-6.5">
                    <div class="bg-success/5 p-4 rounded-sm border-l-4 border-success mb-6">
                        <h4 class="font-bold text-success text-xs uppercase mb-1">Savings Growth</h4>
                        <p class="text-xs text-black font-medium leading-relaxed">
                            Regular deposits increase borrowing power. This member can currently borrow up to 3x their combined savings and shares.
                        </p>
                    </div>
                    
                    <ul class="text-xs text-body font-medium space-y-3">
                        <li class="flex gap-2">
                            <Icon icon={TrendingUp} size={14} class="text-success shrink-0" />
                            <span>This will increase the member's liquid balance.</span>
                        </li>
                        <li class="flex gap-2">
                            <Icon icon={Info} size={14} class="text-primary shrink-0" />
                            <span>An automated ledger entry will be created in the Sacco HQ unit.</span>
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