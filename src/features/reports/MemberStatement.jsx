import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import { ArrowLeft, Printer, Download, User, Wallet, History, CreditCard, PieChart } from 'lucide';

export default function MemberStatement({ member, ledger = [] }) {
  const totalCredit = ledger.filter(l => l.impact === 'credit').reduce((sum, l) => sum + l.amount, 0);
  const totalDebit = ledger.filter(l => l.impact === 'debit').reduce((sum, l) => sum + l.amount, 0);

  return (
    <DashboardLayout title={`Statement: ${member.fullName}`}>
      <div class="flex flex-col gap-8 max-w-screen-2xl mx-auto">
        
        {/* Header */}
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
          <div class="flex items-center gap-4">
            <a href="/dashboard/reports" class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:bg-opacity-90 shadow-default transition-all">
                <Icon icon={ArrowLeft} size={20} />
            </a>
            <div>
              <h2 class="text-2xl font-black text-black uppercase tracking-tight">Financial Statement</h2>
              <p class="text-sm text-body font-medium">Personal consolidated ledger for {member.fullName}.</p>
            </div>
          </div>
          <div class="flex gap-3">
            <button class="inline-flex items-center justify-center gap-2.5 rounded-sm border border-stroke bg-white py-2 px-6 text-center font-bold text-black hover:border-primary hover:text-primary transition-all uppercase tracking-widest text-xs" onClick="window.print()">
                <Icon icon={Printer} size={16} /> Print Statement
            </button>
          </div>
        </div>

        {/* Professional Statement Header (Print Only) */}
        <div class="hidden print:flex flex-col border-b-4 border-black pb-8 mb-8">
            <div class="flex justify-between items-start">
                <div>
                    <h1 class="text-4xl font-black uppercase tracking-tighter">SACCO Management</h1>
                    <p class="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Official Member Statement</p>
                </div>
                <div class="text-right">
                    <p class="text-xs font-black uppercase tracking-widest">Statement Period</p>
                    <p class="text-sm font-bold mt-1">All Activity to {new Date().toLocaleDateString()}</p>
                </div>
            </div>
            
            <div class="mt-12 flex justify-between">
                <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Member Details</p>
                    <h3 class="text-xl font-black text-black">{member.fullName}</h3>
                    <p class="text-xs font-bold text-slate-600 mt-1 uppercase tracking-widest">{member.memberNumber}</p>
                    <p class="text-xs font-medium text-slate-500 mt-1">{member.phone}</p>
                    <p class="text-xs font-medium text-slate-500">{member.address}</p>
                </div>
                <div class="bg-slate-50 p-6 border border-slate-200 min-w-[250px]">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Account Position</p>
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-[10px] font-bold text-slate-500 uppercase">Total Inflow</span>
                        <span class="text-sm font-black text-success">+{totalCredit.toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-[10px] font-bold text-slate-500 uppercase">Total Outflow</span>
                        <span class="text-sm font-black text-error">-{totalDebit.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Dashboard Cards (Web Only) */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 no-print">
            <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Inflow Volume</p>
                <h3 class="text-2xl font-black text-success font-mono">+{totalCredit.toLocaleString()} <span class="text-xs font-bold opacity-50">UGX</span></h3>
            </div>
            <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Outflow Volume</p>
                <h3 class="text-2xl font-black text-error font-mono">-{totalDebit.toLocaleString()} <span class="text-xs font-bold opacity-50">UGX</span></h3>
            </div>
            <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Activity Count</p>
                <h3 class="text-2xl font-black text-black font-mono">{ledger.length} <span class="text-xs font-bold opacity-50">Trans</span></h3>
            </div>
            <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Account Status</p>
                <Badge type={member.status === 'active' ? 'success' : 'error'}>{member.status.toUpperCase()}</Badge>
            </div>
        </div>

        {/* Statement Table */}
        <div class="rounded-sm border border-stroke bg-white shadow-default overflow-hidden">
            <div class="bg-gray-2/50 py-4 px-6 border-b border-stroke flex justify-between items-center no-print">
                <h4 class="font-black text-black text-xs uppercase tracking-widest">Transaction History</h4>
            </div>
            <div class="max-w-full overflow-x-auto">
                <table class="w-full table-auto">
                    <thead>
                        <tr class="bg-slate-50 text-left border-b border-stroke">
                            <th class="py-4 px-6 font-black text-black uppercase text-[10px] tracking-widest">Date</th>
                            <th class="py-4 px-6 font-black text-black uppercase text-[10px] tracking-widest">Service Item</th>
                            <th class="py-4 px-6 font-black text-black uppercase text-[10px] tracking-widest">Category</th>
                            <th class="py-4 px-6 text-right font-black text-black uppercase text-[10px] tracking-widest">Volume (UGX)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ledger.map((item, idx) => (
                        <tr key={idx} class="border-b border-stroke border-dashed last:border-none hover:bg-whiten transition-colors group">
                            <td class="py-5 px-6 text-[10px] text-body font-mono">{item.date}</td>
                            <td class="py-5 px-6">
                                <div class="font-black text-black text-xs uppercase tracking-wider">{item.type}</div>
                            </td>
                            <td class="py-5 px-6">
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-gray-2 px-2 py-1 rounded border border-stroke">{item.category}</span>
                            </td>
                            <td class={`py-5 px-6 text-right font-mono font-black text-sm ${item.impact === 'credit' ? 'text-success' : 'text-error'}`}>
                                {item.impact === 'credit' ? '+' : '-'}{item.amount.toLocaleString()}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Footer (Print Only) */}
        <div class="hidden print:block mt-auto pt-20">
            <div class="flex justify-between border-t border-stroke pt-6">
                <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Generated By</p>
                    <p class="text-xs font-bold text-black uppercase tracking-widest">kzApp SACCO Platform</p>
                </div>
                <div class="text-right">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Official Seal</p>
                    <div class="h-16 w-16 bg-slate-50 border border-slate-200 rounded-sm ml-auto"></div>
                </div>
            </div>
            <p class="text-[8px] text-center text-slate-400 mt-12 uppercase tracking-widest">This statement is a computer-generated document and is valid without physical signature.</p>
        </div>

      </div>
    </DashboardLayout>
  );
}