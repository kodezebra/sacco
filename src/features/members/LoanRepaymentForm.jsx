import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Banknote, ArrowLeft, Check, Calendar, Info, TrendingUp, Receipt } from 'lucide';

export default function LoanRepaymentPage({ member, loan, totalPaid = 0, errors = {}, values = {} }) {
  const today = new Date().toISOString().split('T')[0];
  const totalInterest = loan.principal * (loan.interestRate / 100) * loan.durationMonths;
  const totalDue = loan.principal + totalInterest;
  const balance = totalDue - totalPaid;

  return (
    <DashboardLayout title={`Payment: ${member.fullName}`}>
      <div class="mx-auto max-w-270">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-title-md2 font-bold text-black uppercase tracking-tight">Loan Repayment</h2>
          <nav>
            <ol class="flex items-center gap-2">
              <li><a class="font-medium" href={`/dashboard/members/${member.id}`}>{member.fullName} /</a></li>
              <li class="font-medium text-primary">Repayment</li>
            </ol>
          </nav>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-9">
          <div class="lg:col-span-3">
            <div class="rounded-sm border border-stroke bg-white shadow-default">
              <div class="border-b border-stroke py-4 px-6.5 bg-success/5">
                <h3 class="font-bold text-black flex items-center gap-2 text-sm uppercase">
                   <Icon icon={Receipt} size={18} class="text-success" />
                   Record Payment
                </h3>
              </div>

              <form hx-post={`/dashboard/members/${member.id}/loans/${loan.id}/pay`} hx-push-url="true" hx-target="body" class="p-6.5">
                
                <div class="mb-6">
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-black font-black text-[10px] uppercase tracking-widest">Amount to Pay (UGX)</label>
                        <span class="text-[10px] font-black text-success uppercase tracking-widest bg-success/5 px-2 py-0.5 rounded">Balance: {balance.toLocaleString()} UGX</span>
                    </div>
                    <input 
                      type="number" 
                      name="amount" 
                      defaultValue={values.amount || Math.min(balance, loan.principal / loan.durationMonths)}
                      placeholder="0" 
                      max={balance}
                      class={`w-full rounded border-[1.5px] bg-slate-50 py-3 px-5 font-black text-2xl outline-none transition focus:border-success active:border-success text-black ${errors.amount ? 'border-error' : 'border-stroke'}`}
                      required 
                      min="100"
                      autofocus
                    />
                    {errors.amount && <p class="text-error text-xs mt-1 font-bold">{errors.amount}</p>}
                </div>

                <div class="mb-10">
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">Payment Date</label>
                    <div class="relative">
                      <input 
                        type="date" 
                        name="date" 
                        defaultValue={values.date || today}
                        class={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-11 font-bold outline-none transition focus:border-primary active:border-primary text-black ${errors.date ? 'border-error' : 'border-stroke'}`}
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
                        Submit Payment
                    </button>
                </div>
              </form>
            </div>
          </div>

          <div class="lg:col-span-2">
             <div class="rounded-sm border border-stroke bg-white shadow-default">
                <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50">
                    <h3 class="font-bold text-black text-sm uppercase tracking-widest">Loan Overview</h3>
                </div>
                <div class="p-6.5">
                    <div class="space-y-4">
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-body font-medium uppercase tracking-tighter text-xs">Total Principal</span>
                            <span class="text-black font-bold">{loan.principal.toLocaleString()} UGX</span>
                        </div>
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-body font-medium uppercase tracking-tighter text-xs">Interest ({loan.interestRate}%)</span>
                            <span class="text-black font-bold">{totalInterest.toLocaleString()} UGX</span>
                        </div>
                        <div class="divider my-0"></div>
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-body font-medium uppercase tracking-tighter text-xs">Total Payable</span>
                            <span class="text-black font-bold">{totalDue.toLocaleString()} UGX</span>
                        </div>
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-body font-medium uppercase tracking-tighter text-xs">Total Paid</span>
                            <span class="text-success font-black">{totalPaid.toLocaleString()} UGX</span>
                        </div>
                    </div>
                    
                    <div class="mt-8 bg-success/5 p-4 rounded-sm border-l-4 border-success">
                        <h4 class="font-bold text-success text-xs uppercase mb-1">Status</h4>
                        <p class="text-xs text-black font-medium leading-relaxed">
                            Loan will be automatically closed when total paid reaches {totalDue.toLocaleString()} UGX.
                        </p>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}