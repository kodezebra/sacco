import Icon from '../../components/Icon.jsx';
import { Wallet, X, Users, AlertCircle, CheckCircle } from 'lucide';

export default function RunPayrollForm({ staffList = [] }) {
  const totalProjected = staffList.reduce((sum, s) => sum + (s.salary || 0), 0);

  return (
    <div class="p-0 flex flex-col h-full max-h-[85vh]">
      <div class="bg-primary p-6 text-primary-content flex justify-between items-start shrink-0">
        <div>
          <h2 class="text-xl font-bold flex items-center gap-2">
            <Icon icon={Wallet} size={24} />
            Payroll Worksheet
          </h2>
          <p class="text-primary-content/70 text-sm mt-1">Review and adjust payments before processing.</p>
        </div>
        <form method="dialog">
          <button class="btn btn-circle btn-ghost btn-sm">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form 
        action="/dashboard/payroll/run" 
        method="POST" 
        class="flex flex-col flex-1 overflow-hidden"
      >
        {/* Scrollable Table Area */}
        <div class="flex-1 overflow-y-auto p-0">
          <table class="table table-pin-rows">
            <thead>
              <tr class="bg-base-200">
                <th class="w-12">
                   {/* "Select All" logic would require JS, skipping for simplicity */}
                   <span class="text-xs opacity-50">Pay</span>
                </th>
                <th>Employee</th>
                <th class="text-right">Base Salary</th>
                <th class="w-40 text-right">Payment Amount</th>
              </tr>
            </thead>
            <tbody>
              {staffList.length === 0 ? (
                <tr><td colspan="4" class="text-center p-8 text-slate-400">No active staff found.</td></tr>
              ) : staffList.map(s => (
                <tr key={s.id} class="hover">
                  <td>
                    <label>
                      <input 
                        type="checkbox" 
                        name="staffIds" 
                        value={s.id} 
                        class="checkbox checkbox-sm checkbox-primary" 
                        checked 
                      />
                    </label>
                  </td>
                  <td>
                    <div class="font-bold text-sm">{s.fullName}</div>
                    <div class="text-xs opacity-50">{s.role}</div>
                  </td>
                  <td class="text-right font-mono text-xs opacity-60">
                    {s.salary?.toLocaleString()}
                  </td>
                  <td class="text-right">
                    <input 
                      type="number" 
                      name="amounts" 
                      defaultValue={s.salary}
                      class="input input-sm input-bordered w-full text-right font-mono font-bold focus:input-primary"
                      min="0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div class="p-6 border-t border-base-200 bg-base-100 shrink-0 flex flex-col gap-4">
          <div class="flex justify-between items-center bg-base-200 p-4 rounded-lg">
             <span class="text-sm font-bold opacity-60">Projected Total</span>
             <span class="text-xl font-bold">{totalProjected.toLocaleString()} <span class="text-xs font-normal">UGX</span></span>
          </div>

          <div class="form-control w-full">
            <label class="label py-0">
              <span class="label-text text-xs font-bold uppercase tracking-wider">Payment Date</span>
            </label>
            <input 
              type="date" 
              name="date" 
              value={new Date().toISOString().split('T')[0]}
              class="input input-sm input-bordered w-full mt-1" 
              required
            />
          </div>

          <div class="flex justify-end gap-3 mt-2">
            <form method="dialog">
              <button class="btn btn-ghost">Cancel</button>
            </form>
            <button type="submit" class="btn btn-primary px-8 gap-2">
              <Icon icon={CheckCircle} size={18} />
              Process Payments
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}