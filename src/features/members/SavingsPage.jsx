import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import { ArrowLeft, Wallet, Plus, Minus, History } from 'lucide';

export default function MemberSavingsPage({ member, savings = [] }) {
  const totalIn = savings.filter(s => s.type === 'deposit').reduce((sum, s) => sum + s.amount, 0);
  const totalOut = savings.filter(s => s.type === 'withdrawal').reduce((sum, s) => sum + s.amount, 0);
  const balance = totalIn - totalOut;

  return (
    <DashboardLayout title={`Savings: ${member.fullName}`}>
      <div class="mx-auto max-w-screen-xl flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-4">
            <a href={`/dashboard/members/${member.id}`} class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:bg-opacity-90 shadow-default transition-all">
               <Icon icon={ArrowLeft} size={20} />
            </a>
            <div>
              <h2 class="text-2xl font-black text-black uppercase tracking-tight">Savings Ledger</h2>
              <p class="text-sm text-body font-medium">Full transaction history for {member.fullName}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <a href={`/dashboard/members/${member.id}/deposit`} class="btn btn-primary gap-2 uppercase tracking-widest text-xs font-black px-6 shadow-md">
               <Icon icon={Plus} size={16} /> Deposit Cash
            </a>
            <a href={`/dashboard/members/${member.id}/withdraw`} class="btn btn-outline gap-2 uppercase tracking-widest text-xs font-black px-6 shadow-md">
               <Icon icon={Minus} size={16} /> Withdraw
            </a>
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Current Balance</p>
                <h3 class="text-2xl font-black text-primary font-mono">{balance.toLocaleString()} <span class="text-xs">UGX</span></h3>
            </div>
            <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Deposits</p>
                <h3 class="text-2xl font-black text-success font-mono">{totalIn.toLocaleString()} <span class="text-xs">UGX</span></h3>
            </div>
            <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Withdrawals</p>
                <h3 class="text-2xl font-black text-error font-mono">{totalOut.toLocaleString()} <span class="text-xs">UGX</span></h3>
            </div>
        </div>

        {/* Full Table */}
        <div class="rounded-sm border border-stroke bg-white shadow-default overflow-hidden">
            <div class="max-w-full overflow-x-auto">
                <table class="w-full table-auto">
                    <thead>
                        <tr class="bg-gray-2 text-left">
                            <th class="py-4 px-6 font-black text-black uppercase text-[10px] tracking-widest">Transaction Date</th>
                            <th class="py-4 px-6 font-black text-black uppercase text-[10px] tracking-widest">Entry Type</th>
                            <th class="py-4 px-6 text-right font-black text-black uppercase text-[10px] tracking-widest">Amount (UGX)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {savings.length > 0 ? savings.map(s => (
                            <tr key={s.id} class="border-b border-stroke hover:bg-whiten transition-colors group">
                                <td class="py-5 px-6 text-sm text-black font-mono">{s.date}</td>
                                <td class="py-5 px-6">
                                    <Badge type={s.type === 'deposit' ? 'success' : 'error'}>{s.type.toUpperCase()}</Badge>
                                </td>
                                <td class={`py-5 px-6 text-right font-black ${s.type === 'deposit' ? 'text-success' : 'text-error'}`}>
                                  {s.type === 'deposit' ? '+' : '-'}{(s.amount || 0).toLocaleString()}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colspan="3" class="text-center py-20 text-body italic text-sm">No historical records found for this member.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}