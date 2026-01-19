import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { ArrowLeft, Check, Search, Users, Banknote, Calendar, Percent, Clock } from 'lucide';

export default function LoanIssuePage({ members = [], settings = {} }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <DashboardLayout title="Issue New Loan">
      <div class="mx-auto max-w-270">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-title-md2 font-bold text-black uppercase tracking-tight">Loan Application</h2>
          <nav>
            <ol class="flex items-center gap-2">
              <li><a class="font-medium" href="/dashboard/loans">Loans /</a></li>
              <li class="font-medium text-primary">Issue</li>
            </ol>
          </nav>
        </div>

        <div class="grid grid-cols-1 gap-9 lg:grid-cols-5">
          <div class="flex flex-col gap-9 lg:col-span-3">
            <div class="rounded-sm border border-stroke bg-white shadow-default">
              <div class="border-b border-stroke py-4 px-6.5">
                <h3 class="font-medium text-black">Loan Terms</h3>
              </div>
              
              <form 
                hx-post="/dashboard/loans" 
                hx-push-url="true"
                hx-target="body"
                class="p-6.5"
              >
                <div class="mb-4.5">
                  <label class="mb-2.5 block text-black font-medium">Borrower (Member)</label>
                  <div class="relative z-20 bg-transparent rounded border border-stroke focus-within:border-primary p-1">
                      <div class="flex items-center px-3 border-b border-stroke mb-1">
                          <Icon icon={Search} size={18} class="text-body mr-2" />
                          <input 
                            type="text" 
                            id="member-search"
                            placeholder="Find member..."
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
                        class="relative z-20 w-full appearance-none bg-transparent py-2 px-3 outline-none transition text-black text-sm h-[120px]"
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
                    <label class="mb-2.5 block text-black font-medium text-sm uppercase">Principal Amount (UGX)</label>
                    <div class="relative">
                       <input 
                         type="number" 
                         name="principal" 
                         placeholder="0" 
                         class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-bold outline-none transition focus:border-primary active:border-primary text-black"
                         required
                       />
                       <span class="absolute right-4 top-1/2 -translate-y-1/2 text-body">
                          <Icon icon={Banknote} size={18} />
                       </span>
                    </div>
                  </div>
                  <div>
                    <label class="mb-2.5 block text-black font-medium text-sm uppercase">Interest Rate (%)</label>
                    <div class="relative">
                       <input 
                         type="number" 
                         step="0.1"
                         name="interestRate" 
                         defaultValue={settings.defaultInterestRate || 5.0}
                         class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-bold outline-none transition focus:border-primary active:border-primary text-black"
                         required
                       />
                       <span class="absolute right-4 top-1/2 -translate-y-1/2 text-body">
                          <Icon icon={Percent} size={18} />
                       </span>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-6 mb-4.5">
                  <div>
                    <label class="mb-2.5 block text-black font-medium text-sm uppercase">Duration (Months)</label>
                    <div class="relative">
                       <input 
                         type="number" 
                         name="durationMonths" 
                         defaultValue={settings.defaultLoanDuration || 6}
                         class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-bold outline-none transition focus:border-primary active:border-primary text-black"
                         required
                       />
                       <span class="absolute right-4 top-1/2 -translate-y-1/2 text-body">
                          <Icon icon={Clock} size={18} />
                       </span>
                    </div>
                  </div>
                  <div>
                    <label class="mb-2.5 block text-black font-medium text-sm uppercase">Disbursement Date</label>
                    <input 
                      type="date" 
                      name="issuedDate"
                      defaultValue={today}
                      class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black"
                      required
                    />
                  </div>
                </div>

                <div class="flex justify-end gap-4.5 mt-6">
                    <a href="/dashboard/loans" class="flex justify-center rounded border border-stroke py-3 px-6 font-medium text-black hover:shadow-1 transition">
                        Cancel
                    </a>
                    <button type="submit" class="flex justify-center rounded bg-primary py-3 px-10 font-medium text-white hover:bg-opacity-90 shadow-default">
                        Approve & Issue Loan
                    </button>
                </div>
              </form>
            </div>
          </div>

          <div class="flex flex-col gap-9 lg:col-span-2">
             <div class="rounded-sm border border-stroke bg-white shadow-default">
                <div class="border-b border-stroke py-4 px-6.5">
                    <h3 class="font-medium text-black">Loan Calculator</h3>
                </div>
                <div class="p-6.5">
                    <p class="text-sm text-body italic">
                       Calculated interest and repayment schedules will be shown here in the future. 
                       Standard interest is currently set at {settings.defaultInterestRate || 5.0}% per period.
                    </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}