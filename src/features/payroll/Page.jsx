import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import { Wallet, History, User } from 'lucide';

export default function PayrollPage({ history = [] }) {
  const totalPaid = history.reduce((sum, h) => sum + h.amount, 0);

  return (
    <DashboardLayout title="Payroll Management">
       <div class="flex flex-col gap-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 class="text-title-md font-bold text-black">Salary Disbursement</h2>
          </div>
          <a 
            href="/dashboard/payroll/run"
            class="inline-flex items-center justify-center gap-2.5 rounded-sm bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 shadow-default"
          >
            <Icon icon={Wallet} size={20} />
            Run Payroll
          </a>
        </div>

        {/* Stats */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <StatsCard 
            label="Disbursements" 
            value={totalPaid.toLocaleString()} 
            icon={History} 
            colorClass="text-secondary" 
            subtitle={`UGX (Last ${history.length} records)`}
          />
        </div>

        {/* History Table */}
        <div class="rounded-sm border border-stroke bg-white shadow-default">
          <div class="border-b border-stroke px-6 py-6 flex justify-between items-center">
             <h3 class="font-bold text-black text-lg">Payment History</h3>
          </div>
          
          <div class="max-w-full overflow-x-auto">
             <table class="w-full table-auto">
               <thead>
                 <tr class="bg-gray-2 text-left">
                   <th class="min-w-[120px] py-4 px-4 font-bold text-black text-sm uppercase">Date</th>
                   <th class="min-w-[220px] py-4 px-4 font-bold text-black text-sm uppercase">Employee</th>
                   <th class="min-w-[250px] py-4 px-4 font-bold text-black text-sm uppercase">Description</th>
                   <th class="py-4 px-4 text-right font-bold text-black text-sm uppercase">Amount</th>
                 </tr>
               </thead>
               <tbody>
                 {history.length === 0 ? (
                   <tr><td colspan="4" class="text-center py-10 text-body italic">No payroll history found. Run a payroll to start.</td></tr>
                 ) : history.map((p) => (
                   <tr key={p.id} class="border-b border-stroke hover:bg-whiten transition-colors">
                     <td class="py-5 px-4 text-sm text-black">{p.date}</td>
                     <td class="py-5 px-4">
                       <div class="flex items-center gap-2">
                         <div class="h-8 w-8 rounded-full bg-gray-2 flex items-center justify-center text-body">
                            <Icon icon={User} size={14} />
                         </div>
                         <div>
                           <h5 class="font-medium text-black text-sm">{p.staffName}</h5>
                           <p class="text-xs text-body">{p.role}</p>
                         </div>
                       </div>
                     </td>
                     <td class="py-5 px-4 text-sm text-body">{p.txnDescription}</td>
                     <td class="py-5 px-4 text-right">
                        <p class="text-sm font-bold text-black">{p.amount.toLocaleString()} <span class="text-xs text-body font-normal">UGX</span></p>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}