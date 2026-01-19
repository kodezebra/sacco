import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import { ArrowLeft, PieChart, Plus, TrendingUp, Info } from 'lucide';

export default function MemberSharesPage({ member, shares = [], sharePrice = 20000 }) {
  const totalSharesValue = shares.reduce((sum, s) => sum + s.amount, 0);
  const shareCount = Math.floor(totalSharesValue / sharePrice);

  return (
    <DashboardLayout title={`Shares: ${member.fullName}`}>
      <div class="mx-auto max-w-screen-xl flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-4">
            <a href={`/dashboard/members/${member.id}`} class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:bg-opacity-90 shadow-default transition-all">
               <Icon icon={ArrowLeft} size={20} />
            </a>
            <div>
              <h2 class="text-2xl font-black text-black uppercase tracking-tight">Equity Portfolio</h2>
              <p class="text-sm text-body font-medium">Permanent capital and shareholding for {member.fullName}</p>
            </div>
          </div>
          <a href={`/dashboard/members/${member.id}/shares/new`} class="btn btn-primary gap-2 uppercase tracking-widest text-xs font-black px-6 shadow-md">
             <Icon icon={Plus} size={16} /> Buy New Shares
          </a>
        </div>

        {/* Portfolio Stats */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Share Value</p>
                <h3 class="text-2xl font-black text-primary font-mono">{totalSharesValue.toLocaleString()} <span class="text-xs">UGX</span></h3>
            </div>
            <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Number of Shares</p>
                <h3 class="text-2xl font-black text-black font-mono">{shareCount}</h3>
            </div>
            <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Unit Price</p>
                <h3 class="text-2xl font-black text-slate-600 font-mono">{sharePrice.toLocaleString()} <span class="text-xs font-bold uppercase">per share</span></h3>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div class="lg:col-span-8">
                <div class="rounded-sm border border-stroke bg-white shadow-default overflow-hidden">
                    <div class="bg-gray-2 py-4 px-6 border-b border-stroke">
                        <h4 class="font-black text-black text-xs uppercase tracking-widest">Share Purchase History</h4>
                    </div>
                    <div class="max-w-full overflow-x-auto">
                        <table class="w-full table-auto">
                            <thead>
                                <tr class="bg-slate-50 text-left border-b border-stroke">
                                    <th class="py-4 px-6 font-black text-black uppercase text-[9px] tracking-widest">Date</th>
                                    <th class="py-4 px-6 font-black text-black uppercase text-[9px] tracking-widest">Shares</th>
                                    <th class="py-4 px-6 text-right font-black text-black uppercase text-[9px] tracking-widest">Investment</th>
                                    <th class="py-4 px-6 text-center font-black text-black uppercase text-[9px] tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shares.length > 0 ? shares.map(s => {
                                    const count = Math.floor(s.amount / sharePrice);
                                    return (
                                        <tr key={s.id} class="border-b border-stroke hover:bg-whiten transition-colors">
                                            <td class="py-5 px-6 text-sm text-black font-mono">{s.date}</td>
                                            <td class="py-5 px-6 text-sm font-bold text-black">{count} Units</td>
                                            <td class="py-5 px-6 text-right font-black text-sm">{s.amount.toLocaleString()} <span class="text-[10px] text-body opacity-50">UGX</span></td>
                                            <td class="py-5 px-6 text-center">
                                                <Badge type="primary" size="xs">VERIFIED</Badge>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr><td colspan="4" class="text-center py-20 text-body italic text-sm">No share purchases found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-4">
                <div class="rounded-sm border border-stroke bg-white shadow-default">
                    <div class="p-6">
                        <h4 class="text-sm font-black text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Icon icon={Info} size={16} /> Equity Policy
                        </h4>
                        <div class="space-y-4 text-xs text-body leading-relaxed">
                            <p>Shares represent the permanent capital of the Sacco. They are not withdrawable but can be traded or transferred to other members with board approval.</p>
                            <div class="p-4 bg-primary/5 border-l-4 border-primary">
                                <p class="font-bold text-primary mb-1 uppercase tracking-tighter">Dividends</p>
                                <p>Annual dividends are distributed based on the number of shares held at the end of the financial year.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}