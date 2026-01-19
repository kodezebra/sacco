import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import ApexChart from '../../components/ApexChart.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import Badge from '../../components/Badge.jsx';
import { 
  ArrowLeft, Phone, MapPin, User, 
  Wallet, Banknote, PieChart, History, Plus, Minus, FileText,
  TrendingUp, TrendingDown, ArrowUpRight, ShieldCheck, ChevronDown, CheckCircle2,
  ArrowRight
} from 'lucide';

const formatUGX = (val) => (val || 0).toLocaleString() + ' UGX';

export function MemberDetailStats({ stats }) {
  const borrowingCapacity = (stats.savingsBalance + stats.totalShares) * stats.multiplier;
  const loanProgress = stats.activeLoanTotal > 0 
    ? Math.round((stats.loanPaidTotal / stats.activeLoanTotal) * 100) 
    : 0;

  return (
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
      <div class="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black">{formatUGX(borrowingCapacity)}</h4>
            <span class="text-sm font-medium text-body">Max Borrowing Power</span>
          </div>
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon icon={TrendingUp} size={22} />
          </div>
        </div>
        <div class="mt-4">
           <div class="flex justify-between mb-1">
              <span class="text-[10px] font-black uppercase text-body tracking-widest">Limit Usage</span>
              <span class="text-[10px] font-black text-primary uppercase">{Math.round((stats.loanBalance / borrowingCapacity) * 100) || 0}%</span>
           </div>
           <div class="relative h-1.5 w-full rounded-full bg-slate-100">
              <div class="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${Math.min(100, Math.round((stats.loanBalance / borrowingCapacity) * 100) || 0)}%` }}></div>
           </div>
        </div>
      </div>

      <StatsCard 
        label="Savings Balance" 
        value={formatUGX(stats.savingsBalance)} 
        icon={Wallet} 
        colorClass="text-success" 
        subtitle={`Incl. ${formatUGX(stats.totalShares)} shares`}
      />

      <div class="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black">{formatUGX(stats.loanBalance)}</h4>
            <span class="text-sm font-medium text-body">Active Debt</span>
          </div>
          <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-error/10 text-error">
            <Icon icon={Banknote} size={22} />
          </div>
        </div>
        <div class="mt-4">
           <div class="flex justify-between mb-1">
              <span class="text-[10px] font-black uppercase text-body tracking-widest">Settlement Progress</span>
              <span class="text-[10px] font-black text-success uppercase">{loanProgress}%</span>
           </div>
           <div class="relative h-1.5 w-full rounded-full bg-slate-100">
              <div class="absolute left-0 top-0 h-full rounded-full bg-success transition-all duration-500" style={{ width: `${loanProgress}%` }}></div>
           </div>
        </div>
      </div>
    </div>
  );
}

export function SavingsSummary({ memberId, balance, history = [] }) {
    const recent = history.slice(0, 3);
    return (
        <div class="rounded-sm border border-stroke bg-white shadow-default flex flex-col h-full">
            <div class="flex justify-between items-center p-6 border-b border-stroke bg-gray-2/30">
                <h4 class="text-xs font-black text-black uppercase tracking-widest flex items-center gap-2">
                    <Icon icon={Wallet} size={14} class="text-success" /> Savings
                </h4>
                <a href={`/dashboard/members/${memberId}/savings`} class="text-[10px] font-black text-primary hover:underline uppercase tracking-tighter flex items-center gap-1">
                    Manage <Icon icon={ArrowRight} size={10} />
                </a>
            </div>
            <div class="p-6 flex flex-col gap-4 grow">
                <div class="pb-4 border-b border-stroke border-dashed">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Balance</p>
                    <p class="text-xl font-black text-black font-mono">{balance.toLocaleString()} <span class="text-xs">UGX</span></p>
                </div>
                <div class="space-y-3">
                    <p class="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Recent Activity</p>
                    {recent.length > 0 ? recent.map(s => (
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-body font-mono">{s.date}</span>
                            <span class={`font-black ${s.type === 'deposit' ? 'text-success' : 'text-error'}`}>
                                {s.type === 'deposit' ? '+' : '-'}{s.amount.toLocaleString()}
                            </span>
                        </div>
                    )) : <p class="text-[10px] text-body italic">No records</p>}
                </div>
            </div>
        </div>
    );
}

export function LoansSummary({ memberId, balance, loans = [] }) {
    const active = loans.filter(l => l.status === 'active');
    return (
        <div class="rounded-sm border border-stroke bg-white shadow-default flex flex-col h-full">
            <div class="flex justify-between items-center p-6 border-b border-stroke bg-gray-2/30">
                <h4 class="text-xs font-black text-black uppercase tracking-widest flex items-center gap-2">
                    <Icon icon={Banknote} size={14} class="text-primary" /> Loans
                </h4>
                <a href={`/dashboard/members/${memberId}/loans`} class="text-[10px] font-black text-primary hover:underline uppercase tracking-tighter flex items-center gap-1">
                    Manage <Icon icon={ArrowRight} size={10} />
                </a>
            </div>
            <div class="p-6 flex flex-col gap-4 grow">
                <div class="pb-4 border-b border-stroke border-dashed">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Outstanding Debt</p>
                    <p class="text-xl font-black text-black font-mono">{balance.toLocaleString()} <span class="text-xs">UGX</span></p>
                </div>
                <div class="space-y-3">
                    <p class="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Current Exposure</p>
                    {active.length > 0 ? active.map(l => (
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-body font-bold">{l.durationMonths} Mo Term</span>
                            <span class="font-black text-primary">{l.principal.toLocaleString()}</span>
                        </div>
                    )) : <p class="text-[10px] text-body italic">No active loans</p>}
                </div>
            </div>
        </div>
    );
}

export function SharesSummary({ memberId, total, sharePrice = 20000 }) {
    const count = Math.floor(total / sharePrice);
    return (
        <div class="rounded-sm border border-stroke bg-white shadow-default flex flex-col h-full">
            <div class="flex justify-between items-center p-6 border-b border-stroke bg-gray-2/30">
                <h4 class="text-xs font-black text-black uppercase tracking-widest flex items-center gap-2">
                    <Icon icon={PieChart} size={14} class="text-primary" /> Shares
                </h4>
                <a href={`/dashboard/members/${memberId}/shares`} class="text-[10px] font-black text-primary hover:underline uppercase tracking-tighter flex items-center gap-1">
                    Manage <Icon icon={ArrowRight} size={10} />
                </a>
            </div>
            <div class="p-6 flex flex-col gap-4 grow">
                <div class="pb-4 border-b border-stroke border-dashed">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Equity Contribution</p>
                    <p class="text-xl font-black text-black font-mono">{total.toLocaleString()} <span class="text-xs">UGX</span></p>
                </div>
                <div class="p-4 bg-slate-50 rounded-sm text-center">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ownership</p>
                    <p class="text-lg font-black text-primary">{count} <span class="text-[10px] font-bold">Units</span></p>
                </div>
            </div>
        </div>
    );
}

export function MemberDetailProfileForm({ id, member }) {
  return (
    <form 
      id={id}
      hx-put={`/dashboard/members/${member.id}`}
      hx-target={`#${id}`}
      hx-swap="outerHTML"
      class="rounded-sm border border-stroke bg-white shadow-default mt-8"
    >
        <div class="border-b border-stroke py-4 px-6 bg-gray-2/50">
           <h3 class="font-black text-black uppercase tracking-widest text-xs">Update Member Profile</h3>
        </div>
        <div class="p-6.5 flex flex-col gap-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4.5">
            <div>
                <label class="mb-2.5 block text-black font-bold uppercase tracking-widest text-[10px]">Full Legal Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={member.fullName} 
                  class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-bold outline-none transition focus:border-primary active:border-primary text-black" 
                  required 
                />
            </div>

            <div>
                <label class="mb-2.5 block text-black font-bold uppercase tracking-widest text-[10px]">Status</label>
                <div class="relative z-20 bg-transparent">
                  <select 
                    name="status" 
                    defaultValue={member.status}
                    class="relative z-20 w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-bold outline-none transition focus:border-primary active:border-primary text-black"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive / Suspended</option>
                  </select>
                  <span class="absolute top-1/2 right-4 z-30 -translate-y-1/2 text-body">
                    <Icon icon={ChevronDown} size={20} />
                  </span>
                </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4.5">
            <div>
                <label class="mb-2.5 block text-black font-bold uppercase tracking-widest text-[10px]">Phone Number</label>
                <div class="relative">
                  <input 
                      type="tel" 
                      name="phone" 
                      value={member.phone || ''} 
                      class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-12 font-bold outline-none transition focus:border-primary active:border-primary text-black"
                  />
                  <span class="absolute left-4 top-3.5 text-body">
                      <Icon icon={Phone} size={20} />
                  </span>
                </div>
            </div>
              
            <div>
                <label class="mb-2.5 block text-black font-bold uppercase tracking-widest text-[10px]">Residential Address</label>
                <div class="relative">
                  <input 
                      type="text" 
                      name="address" 
                      value={member.address || ''} 
                      class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-12 font-bold outline-none transition focus:border-primary active:border-primary text-black"
                  />
                  <span class="absolute left-4 top-3.5 text-body">
                      <Icon icon={MapPin} size={20} />
                  </span>
                </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4.5 p-4.5 bg-gray-2 rounded-sm border border-stroke">
             <div class="col-span-full border-b border-stroke pb-2 mb-2">
                <h4 class="text-[10px] font-black text-black uppercase tracking-[0.2em] opacity-60">Next of Kin Details</h4>
             </div>
             <div>
                <label class="mb-2.5 block text-black font-bold text-[10px] uppercase tracking-widest">Full Name</label>
                <input type="text" name="nextOfKinName" value={member.nextOfKinName || ''} class="w-full rounded border-[1.5px] border-stroke bg-white py-2.5 px-4 font-bold outline-none transition focus:border-primary active:border-primary text-black text-sm" />
             </div>
             <div>
                <label class="mb-2.5 block text-black font-bold text-[10px] uppercase tracking-widest">Contact Phone</label>
                <input type="tel" name="nextOfKinPhone" value={member.nextOfKinPhone || ''} class="w-full rounded border-[1.5px] border-stroke bg-white py-2.5 px-4 font-bold outline-none transition focus:border-primary active:border-primary text-black text-sm" />
             </div>
          </div>

          <div class="flex justify-end gap-4 border-t border-stroke pt-6">
            <button type="submit" class="flex justify-center rounded bg-primary py-3 px-10 font-black text-white hover:bg-opacity-90 shadow-default active:scale-95 transition-all uppercase tracking-widest">
                Save Profile Changes
            </button>
          </div>
      </div>
    </form>
  );
}


export default function MemberDetailPage({ member, stats, loans = [], savings = [], shares = [], trendData = [] }) {
  if (!member) return null;

  const chartOptions = {
// ...
  };

  return (
    <DashboardLayout title="Member Snapshot">
      <div class="mx-auto max-w-screen-2xl">
        <PageHeader 
          title={member.fullName}
          subtitle={`Reg No: ${member.memberNumber} • Joined: ${member.createdAt}`}
          backHref="/dashboard/members"
          breadcrumbs={[
            { label: 'Directory', href: '/dashboard/members' },
            { label: 'Profile', href: `/dashboard/members/${member.id}`, active: true }
          ]}
          actions={(
            <a 
              href={`/dashboard/reports/member-statement/${member.id}`} 
              class="inline-flex items-center justify-center gap-2.5 rounded-sm border border-stroke bg-white py-2 px-6 text-center font-black text-black hover:border-primary hover:text-primary lg:px-4 shadow-default transition-all uppercase tracking-widest text-xs"
            >
               <Icon icon={FileText} size={16} /> Statement
            </a>
          )}
        />

        <div class="flex flex-col gap-8">
            {/* 1. Global KPIs */}
            <MemberDetailStats stats={stats} />
            
            {/* 2. Operational Layer (Tri-Column) */}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SavingsSummary memberId={member.id} balance={stats.savingsBalance} history={savings} />
                <LoansSummary memberId={member.id} balance={stats.loanBalance} loans={loans} />
                <SharesSummary memberId={member.id} total={stats.totalShares} sharePrice={stats.sharePrice} />
            </div>

            {/* 3. Performance Layer */}
            <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
                <h4 class="text-[10px] font-black text-black uppercase tracking-widest mb-4 border-b border-stroke pb-2">Financial Flow (6 Months)</h4>
                <div id="chartMember" class="-ml-5">
                <ApexChart id="member-trend-chart" options={chartOptions} height={250} />
                </div>
            </div>

            {/* 4. Footer: Profile Management */}
            <MemberDetailProfileForm id="member-profile-form" member={member} />
        </div>
      </div>
    </DashboardLayout>
  );
}