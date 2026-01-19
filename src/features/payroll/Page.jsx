import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { Wallet, History, User } from 'lucide';

export default function PayrollPage({ history = [], stats = {} }) {
  return (
    <DashboardLayout title="Payroll">
       <div class="flex flex-col gap-6">
        <PageHeader 
          title="Payroll Control"
          subtitle="Process monthly disbursements and manage payment history."
          breadcrumbs={[{ label: 'Payroll', href: '/dashboard/payroll', active: true }]}
          actions={(
            <a 
              href="/dashboard/payroll/run"
              class="inline-flex items-center justify-center gap-2.5 rounded-sm bg-primary py-2.5 px-8 text-center font-bold text-white hover:bg-opacity-90 shadow-default transition-all active:scale-95 uppercase tracking-widest text-sm"
            >
              <Icon icon={Wallet} size={20} />
              Run Payroll
            </a>
          )}
        />

        {/* Stats */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <StatsCard 
            label="Monthly Obligation" 
            value={(stats.totalMonthlyObligation || 0).toLocaleString()} 
            icon={User} 
            colorClass="text-primary" 
            subtitle="Total active salary liability"
          />
          <StatsCard 
            label="Paid This Month" 
            value={(stats.totalPaidMonth || 0).toLocaleString()} 
            icon={History} 
            colorClass="text-success" 
            subtitle="Successfully disbursed"
          />
          <StatsCard 
            label="Pending Disbursement" 
            value={(stats.pending || 0).toLocaleString()} 
            icon={Wallet} 
            colorClass="text-warning" 
            subtitle="Remaining for this cycle"
          />
        </div>

        {/* History Table */}
        <div class="rounded-sm border border-stroke bg-white shadow-default">
          <div class="border-b border-stroke px-6 py-6 flex justify-between items-center bg-gray-2/30">
             <h3 class="font-bold text-black text-sm uppercase tracking-widest">Recent Payments</h3>
          </div>
          
          <div class="max-w-full overflow-x-auto min-h-[400px]">
             <table class="w-full table-auto">
               <thead>
                 <tr class="bg-gray-2 text-left">
                   <th class="min-w-[120px] py-4 px-4 font-bold text-black text-[10px] uppercase">Date</th>
                   <th class="min-w-[220px] py-4 px-4 font-bold text-black text-[10px] uppercase">Employee</th>
                   <th class="min-w-[250px] py-4 px-4 font-bold text-black text-[10px] uppercase">Transaction</th>
                   <th class="py-4 px-4 text-right font-bold text-black text-[10px] uppercase">Amount</th>
                 </tr>
               </thead>
               <tbody>
                 {history.length === 0 ? (
                   <tr><td colspan="4" class="text-center py-24 text-body italic bg-gray-50/50">No payroll history found. Run a payroll to start.</td></tr>
                 ) : history.map((p) => (
                   <tr key={p.id} class="border-b border-stroke hover:bg-whiten transition-colors group">
                     <td class="py-5 px-4 text-sm text-black font-mono">{p.date}</td>
                     <td class="py-5 px-4">
                       <div class="flex items-center gap-3">
                         <div class="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-body border border-slate-200 group-hover:bg-white transition-colors">
                            <Icon icon={User} size={16} />
                         </div>
                         <div>
                           <h5 class="font-bold text-black text-sm">{p.staffName}</h5>
                           <p class="text-[10px] text-body uppercase tracking-widest font-bold">{p.role}</p>
                         </div>
                       </div>
                     </td>
                     <td class="py-5 px-4 text-sm text-body italic">{p.txnDescription}</td>
                     <td class="py-5 px-4 text-right">
                        <p class="text-sm font-black text-black">{(p.amount || 0).toLocaleString()} <span class="text-[10px] text-body font-bold">UGX</span></p>
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