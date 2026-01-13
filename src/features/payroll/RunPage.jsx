import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import { Wallet, CheckCircle, ArrowLeft, Info, AlertCircle } from 'lucide';

export default function RunPayrollPage({ staffList = [] }) {
  const totalProjected = staffList.reduce((sum, s) => sum + (s.salary || 0), 0);

  return (
    <DashboardLayout title="Run Payroll">
      <div class="flex flex-col gap-8 max-w-6xl mx-auto">
        
        {/* Header with Navigation */}
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-4">
            <a href="/dashboard/payroll" class="btn btn-ghost btn-circle">
               <Icon icon={ArrowLeft} size={24} />
            </a>
            <div>
              <h1 class="text-3xl font-bold tracking-tight">Process Salaries</h1>
              <p class="text-slate-500 italic">Review and adjust individual payments for this cycle.</p>
            </div>
          </div>
          
          <div class="hidden md:flex items-center gap-4 px-6 py-3 bg-base-100 border border-base-200 rounded-2xl shadow-sm">
             <div class="text-right">
                <div class="text-xs uppercase font-bold text-slate-400">Projected Total</div>
                <div class="text-xl font-mono font-black text-primary">{totalProjected.toLocaleString()}</div>
             </div>
             <Icon icon={Wallet} size={32} class="text-primary opacity-20" />
          </div>
        </div>

        <form 
          action="/dashboard/payroll/run" 
          method="POST" 
          class="flex flex-col gap-8"
        >
          {/* Main Worksheet Card */}
          <div class="rounded-sm border border-slate-200 bg-white px-5 pt-6 pb-2.5 shadow-sm sm:px-7.5 xl:pb-1">
            <div class="overflow-x-auto">
              <table class="table w-full">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="py-4 px-4 text-sm font-bold text-black uppercase w-12">Pay</th>
                    <th class="py-4 px-4 text-sm font-bold text-black uppercase">Employee Details</th>
                    <th class="py-4 px-4 text-sm font-bold text-black uppercase">Business Unit</th>
                    <th class="py-4 px-4 text-right text-sm font-bold text-black uppercase">Standard Salary</th>
                    <th class="py-4 px-4 text-right text-sm font-bold text-black uppercase w-64">Actual Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map(s => (
                    <tr key={s.id} class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td class="py-4 px-4">
                        <input 
                          type="checkbox" 
                          name="staffIds" 
                          value={s.id} 
                          class="checkbox checkbox-primary rounded-sm" 
                          checked 
                        />
                      </td>
                      <td class="py-4 px-4">
                        <div class="font-bold text-black">{s.fullName}</div>
                        <div class="text-xs text-black opacity-50 uppercase tracking-widest font-semibold">{s.role}</div>
                      </td>
                      <td class="py-4 px-4">
                        <Badge type="ghost">{s.unitName}</Badge>
                      </td>
                      <td class="py-4 px-4 text-right font-mono text-black opacity-60">
                        {s.salary?.toLocaleString()}
                      </td>
                      <td class="py-4 px-4 text-right">
                        <div class="flex justify-end items-center gap-2">
                          <input 
                            type="number" 
                            name={`amount_${s.id}`} 
                            defaultValue={s.salary}
                            class="input input-bordered input-md w-full max-w-[180px] text-right font-mono font-bold focus:input-primary border-slate-200 rounded-lg"
                            min="0"
                          />
                          <span class="text-xs font-bold opacity-30 text-black">UGX</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Submission Panel */}
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-20">
            <div class="lg:col-span-2 space-y-4">
               <div class="alert shadow-sm bg-info/5 border-info/20 text-info text-sm py-4">
                  <Icon icon={Info} size={20} />
                  <div>
                    <h3 class="font-bold">Partial Payments</h3>
                    <p>Entering an amount lower than the standard salary will record the transaction as a "Partial Payment". You can pay the balance in a future run.</p>
                  </div>
               </div>
            </div>

            <div class="card bg-base-100 border border-base-200 shadow-lg p-6 flex flex-col gap-6">
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text font-bold uppercase tracking-wider text-xs">Final Payment Date</span>
                </label>
                <input 
                  type="date" 
                  name="date" 
                  value={new Date().toISOString().split('T')[0]}
                  class="input input-bordered w-full font-mono" 
                  required
                />
              </div>

              <div class="divider my-0"></div>

              <div class="flex flex-col gap-3">
                <button type="submit" class="btn btn-primary btn-lg w-full gap-2 shadow-md">
                   <Icon icon={CheckCircle} size={20} />
                   Process
                </button>
                <a href="/dashboard/payroll" class="btn btn-ghost w-full">Cancel Run</a>
              </div>
              
              <p class="text-[10px] text-center text-slate-400 uppercase tracking-tighter leading-tight">
                By clicking finalize, you will create {staffList.length} expense transactions in the ledger.
              </p>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
