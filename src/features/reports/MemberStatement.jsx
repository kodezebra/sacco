import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { ArrowLeft, Printer, Download, User } from 'lucide';

export default function MemberStatement({ member, ledger = [] }) {
  const totalCredits = ledger.filter(i => i.impact === 'credit').reduce((sum, i) => sum + i.amount, 0);
  const totalDebits = ledger.filter(i => i.impact === 'debit').reduce((sum, i) => sum + i.amount, 0);

  return (
    <DashboardLayout title={`${member.fullName} | Statement`}>
      <div class="flex flex-col gap-8">
        
        {/* Header */}
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
          <div class="flex items-center gap-4">
            <a href={`/dashboard/members/${member.id}`} class="btn btn-ghost btn-circle"><Icon icon={ArrowLeft} size={24} /></a>
            <div>
              <h1 class="text-3xl font-bold tracking-tight">Statement of Account</h1>
              <p class="text-slate-500">{member.fullName} • {member.memberNumber}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-outline btn-sm gap-2" onClick="window.print()">
              <Icon icon={Printer} size={16} /> Print
            </button>
          </div>
        </div>

        {/* Branding (Print Only) */}
        <div class="hidden print:flex justify-between items-end border-b-2 border-primary pb-4 mb-8">
           <div>
              <h1 class="text-2xl font-bold text-primary">kzApp SACCO</h1>
              <p class="text-xs text-slate-500 italic">"Empowering our community through unity."</p>
           </div>
           <div class="text-right">
              <h2 class="text-xl font-bold">MEMBER STATEMENT</h2>
              <p class="text-xs">Date: {new Date().toLocaleDateString()}</p>
           </div>
        </div>

        {/* Member Info (Print Optimized) */}
        <div class="grid grid-cols-2 gap-8 bg-base-200/30 p-6 rounded-box border border-base-200">
           <div>
              <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">Member Details</div>
              <div class="font-bold text-lg">{member.fullName}</div>
              <div class="text-sm">{member.phone}</div>
              <div class="text-sm opacity-70">{member.address || 'N/A'}</div>
           </div>
           <div class="text-right">
              <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">Account Summary</div>
              <div class="text-sm">Account Number: <strong>{member.memberNumber}</strong></div>
              <div class="text-sm">Status: <span class="capitalize">{member.status}</span></div>
              <div class="text-sm">Joining Date: {member.createdAt}</div>
           </div>
        </div>

        {/* Summary Row */}
        <div class="flex flex-wrap gap-4 no-print">
           <div class="flex-1 min-w-[200px] p-4 bg-success/5 border border-success/20 rounded-lg">
              <div class="text-xs text-success/70 font-bold uppercase">Total Inflows</div>
              <div class="text-2xl font-bold">{totalCredits.toLocaleString()} UGX</div>
           </div>
           <div class="flex-1 min-w-[200px] p-4 bg-error/5 border border-error/20 rounded-lg">
              <div class="text-xs text-error/70 font-bold uppercase">Total Outflows</div>
              <div class="text-2xl font-bold">{totalDebits.toLocaleString()} UGX</div>
           </div>
        </div>

        {/* Ledger Table */}
        <div class="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
          <table class="table table-sm table-zebra w-full">
            <thead class="bg-base-200">
              <tr>
                <th>Date</th>
                <th>Transaction Type</th>
                <th>Category</th>
                <th class="text-right">Debit (Out)</th>
                <th class="text-right">Credit (In)</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((item, idx) => (
                <tr key={idx}>
                  <td class="font-mono text-xs opacity-70">{item.date}</td>
                  <td class="font-bold">{item.type}</td>
                  <td class="text-xs opacity-60 uppercase">{item.category}</td>
                  <td class="text-right font-medium text-error">
                    {item.impact === 'debit' ? item.amount.toLocaleString() : ''}
                  </td>
                  <td class="text-right font-medium text-success">
                    {item.impact === 'credit' ? item.amount.toLocaleString() : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer (Print only) */}
        <div class="hidden print:block mt-20 text-center border-t pt-4">
           <p class="text-xs italic opacity-50">This is a computer-generated statement and does not require a physical signature.</p>
           <p class="text-[10px] font-mono mt-1 opacity-30">REF: {member.id.substring(0,12)}</p>
        </div>

      </div>
    </DashboardLayout>
  );
}
