import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
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
          <div class="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="table table-lg">
                <thead class="bg-slate-50 border-b border-base-200">
                  <tr>
                    <th class="w-12">Pay</th>
                    <th>Employee Details</th>
                    <th>Business Unit</th>
                    <th class="text-right">Standard Salary</th>
                    <th class="w-64 text-right">Actual Payment</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-base-100">
                  {staffList.map(s => (
                    <tr key={s.id} class="hover:bg-slate-50/50 transition-colors">
                      <td>
                        <input 
                          type="checkbox" 
                          name="staffIds" 
                          value={s.id} 
                          class="checkbox checkbox-primary" 
                          checked 
                        />
                      </td>
                      <td>
                        <div class="font-bold">{s.fullName}</div>
                        <div class="text-xs opacity-50 uppercase tracking-widest font-semibold">{s.role}</div>
                      </td>
                      <td>
                        <div class="badge badge-outline badge-sm">{s.unitName}</div>
                      </td>
                      <td class="text-right font-mono text-slate-400">
                        {s.salary?.toLocaleString()}
                      </td>
                      <td class="text-right">
                        <div class="flex justify-end items-center gap-2">
                          <input 
                            type="number" 
                            name={`amount_${s.id}`} 
                            defaultValue={s.salary}
                            class="input input-bordered input-md w-full max-w-[180px] text-right font-mono font-bold focus:input-primary border-slate-200"
                            min="0"
                          />
                          <span class="text-xs font-bold opacity-30">UGX</span>
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
                   Finalize & Process
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
