import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Banknote, ArrowLeft, Check, Calendar, Info, TrendingUp, Percent, Clock } from 'lucide';

export default function MemberLoanPage({ member, loanLimit = 0, defaults = {}, errors = {}, values = {} }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <DashboardLayout title={`Loan: ${member.fullName}`}>
      <div class="mx-auto max-w-270">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-title-md2 font-bold text-black uppercase tracking-tight">Loan Disbursement</h2>
          <nav>
            <ol class="flex items-center gap-2">
              <li><a class="font-medium" href={`/dashboard/members/${member.id}`}>{member.fullName} /</a></li>
              <li class="font-medium text-primary">New Loan</li>
            </ol>
          </nav>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-9">
          <div class="lg:col-span-3">
            <div class="rounded-sm border border-stroke bg-white shadow-default">
              <div class="border-b border-stroke py-4 px-6.5 bg-primary/5">
                <h3 class="font-bold text-black flex items-center gap-2 text-sm uppercase">
                   <Icon icon={Banknote} size={18} class="text-primary" />
                   Credit Agreement
                </h3>
              </div>

              <form hx-post={`/dashboard/members/${member.id}/loans`} hx-push-url="true" hx-target="body" class="p-6.5">
                
                <div class="mb-6">
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-black font-black text-[10px] uppercase tracking-widest">Principal Amount (UGX)</label>
                        <span class="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded">Limit: {loanLimit.toLocaleString()} UGX</span>
                    </div>
                    <input 
                      type="number" 
                      name="principal" 
                      defaultValue={values.principal}
                      placeholder="0" 
                      max={loanLimit}
                      class={`w-full rounded border-[1.5px] bg-slate-50 py-3 px-5 font-black text-2xl outline-none transition focus:border-primary active:border-primary text-black ${errors.principal ? 'border-error' : 'border-stroke'}`}
                      required 
                      min="1000"
                      autofocus
                    />
                    {errors.principal && <p class="text-error text-xs mt-1 font-bold">{errors.principal}</p>}
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">Interest Rate (%)</label>
                    <div class="relative">
                        <input 
                          type="number" 
                          step="0.1"
                          name="interestRate" 
                          defaultValue={values.interestRate || defaults.defaultInterestRate || 5.0}
                          class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-11 font-bold outline-none transition focus:border-primary active:border-primary text-black" 
                          required 
                        />
                        <span class="absolute left-4 top-1/2 -translate-y-1/2">
                            <Icon icon={Percent} size={18} class="text-bodydark2" />
                        </span>
                    </div>
                  </div>

                  <div>
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">Duration (Months)</label>
                    <div class="relative">
                        <input 
                          type="number" 
                          name="durationMonths" 
                          defaultValue={values.durationMonths || defaults.defaultLoanDuration || 6}
                          class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-11 font-bold outline-none transition focus:border-primary active:border-primary text-black" 
                          required 
                        />
                        <span class="absolute left-4 top-1/2 -translate-y-1/2">
                            <Icon icon={Clock} size={18} class="text-bodydark2" />
                        </span>
                    </div>
                  </div>
                </div>

                <div class="mb-10">
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">Disbursement Date</label>
                    <div class="relative">
                      <input 
                        type="date" 
                        name="issuedDate" 
                        defaultValue={values.issuedDate || today}
                        class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-11 font-bold outline-none transition focus:border-primary active:border-primary text-black"
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
                    <button type="submit" class="flex justify-center rounded bg-primary py-3 px-10 font-bold text-white hover:bg-opacity-90 shadow-default uppercase tracking-widest flex items-center gap-2">
                        <Icon icon={Check} size={18} />
                        Approve & Issue
                    </button>
                </div>
              </form>
            </div>
          </div>

          <div class="lg:col-span-2">
             <div class="rounded-sm border border-stroke bg-white shadow-default">
                <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50">
                    <h3 class="font-bold text-black text-sm uppercase tracking-widest">Loan Policy</h3>
                </div>
                <div class="p-6.5">
                    <div class="bg-primary/5 p-4 rounded-sm border-l-4 border-primary mb-6">
                        <h4 class="font-bold text-primary text-xs uppercase mb-1">Risk Control</h4>
                        <p class="text-xs text-black font-medium leading-relaxed">
                            Loans are secured by the member's existing savings and shares. Total exposure cannot exceed the multiplier set in Sacco settings.
                        </p>
                    </div>
                    
                    <ul class="text-xs text-body font-medium space-y-3">
                        <li class="flex gap-2">
                            <Icon icon={Info} size={14} class="text-primary shrink-0" />
                            <span>Interest is calculated simple/flat per period.</span>
                        </li>
                        <li class="flex gap-2">
                            <Icon icon={Info} size={14} class="text-primary shrink-0" />
                            <span>Funds are disbursed from the main Sacco HQ account.</span>
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