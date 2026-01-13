import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import ApexChart from '../../components/ApexChart.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import { 
  ArrowLeft, Phone, MapPin, User, 
  Wallet, Banknote, PieChart, History, Plus, Minus, FileText,
  TrendingUp, TrendingDown, ArrowUpRight, ShieldCheck
} from 'lucide';

const formatUGX = (val) => (val || 0).toLocaleString() + ' UGX';

// Partial component for stats (OOB Swap)
export function MemberDetailStats({ id, stats }) {
  return (
    <div id={id} hx-swap-oob={id ? "true" : "false"} class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      <StatsCard 
        label="Total Shares" 
        value={formatUGX(stats.totalShares)} 
        subtitle="Equity investment" 
        icon={PieChart} 
        colorClass="text-primary" 
      />
      <StatsCard 
        label="Savings Balance" 
        value={formatUGX(stats.savingsBalance)} 
        subtitle="Liquid capital" 
        icon={Wallet} 
        colorClass="text-success" 
      />
      <StatsCard 
        label="Loan Balance" 
        value={formatUGX(stats.loanBalance)} 
        subtitle="Outstanding credit" 
        icon={Banknote} 
        colorClass="text-error" 
      />
    </div>
  );
}

// Partial component for savings history (OOB Swap)
export function MemberDetailSavingsTab({ id, memberId, savings = [] }) {
    return (
        <div id={id} hx-swap-oob={id ? "true" : "false"} class="flex flex-col gap-4">
            <div class="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div class="font-bold text-slate-700">Savings History</div>
                <div class="flex gap-2">
                    <button 
                      class="btn btn-xs btn-outline gap-1"
                      hx-get={`/dashboard/members/${memberId}/deposit`}
                      hx-target="#htmx-modal-content"
                      hx-swap="innerHTML"
                      onClick="document.getElementById('htmx-modal').showModal()"
                    >
                       <Icon icon={Plus} size={12} /> Deposit
                    </button>
                    <button 
                      class="btn btn-xs btn-outline gap-1"
                      hx-get={`/dashboard/members/${memberId}/withdraw`}
                      hx-target="#htmx-modal-content"
                      hx-swap="innerHTML"
                      onClick="document.getElementById('htmx-modal').showModal()"
                    >
                       <Icon icon={Minus} size={12} /> Withdraw
                    </button>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="table table-sm w-full table-zebra">
                    <thead><tr class="text-slate-400 uppercase text-[10px] tracking-widest border-b border-slate-100"><th>Date</th><th>Type</th><th class="text-right">Amount</th></tr></thead>
                    <tbody>
                        {savings.length > 0 ? savings.map(s => (
                            <tr key={s.id} class="hover group">
                                <td class="font-mono text-xs text-slate-400">{s.date}</td>
                                <td><span class={`badge badge-xs badge-outline uppercase font-black text-[9px] tracking-tighter ${s.type === 'deposit' ? 'badge-success text-success' : 'badge-error text-error'}`}>{s.type}</span></td>
                                <td class={`text-right font-mono font-bold ${s.type === 'deposit' ? 'text-success' : 'text-error'}`}>
                                  {s.type === 'deposit' ? '+' : '-'}{(s.amount || 0).toLocaleString()}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colspan="3" class="text-center py-16 text-slate-400 italic">No savings history recorded</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Partial component for loans history (OOB Swap)
export function MemberDetailLoansTab({ id, memberId, loans = [] }) {
  return (
    <div id={id} hx-swap-oob={id ? "true" : "false"} class="flex flex-col gap-4">
        <div class="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <div class="font-bold text-slate-700">Loans Portfolio</div>
            <button 
                class={`btn btn-xs btn-primary gap-1 ${loans.some(l => l.status === 'active') ? 'btn-disabled' : ''}`}
                hx-get={!loans.some(l => l.status === 'active') ? `/dashboard/members/${memberId}/loans/new` : undefined}
                hx-target="#htmx-modal-content"
                hx-swap="innerHTML"
                onClick={!loans.some(l => l.status === 'active') ? "document.getElementById('htmx-modal').showModal()" : undefined}
            >
                <Icon icon={Plus} size={12} /> New Loan
            </button>
        </div>

        <div class="divide-y divide-slate-50 border border-slate-100 rounded-xl overflow-hidden bg-base-100">
          {loans.length > 0 ? loans.map(l => (
            <div key={l.id} class="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center group">
              <div class="grow">
                <div class="font-black text-slate-700">{(l.principal || 0).toLocaleString()} <span class="text-[10px] text-slate-400 font-medium">UGX</span></div>
                <div class="text-[10px] uppercase font-bold opacity-40">{l.durationMonths} Months • {l.interestRate}% Interest</div>
                <div class="text-[9px] text-slate-400 italic">Issued: {l.issuedDate}</div>
              </div>
              <div class="flex items-center gap-4">
                <span class={`badge badge-sm badge-outline uppercase text-[9px] font-black tracking-tighter ${l.status === 'active' ? 'badge-info text-info' : 'badge-success text-success'}`}>{l.status}</span>
                {l.status === 'active' && (
                  <button 
                    class="btn btn-xs btn-success text-white gap-1 px-3 shadow-sm shadow-success/20"
                    hx-get={`/dashboard/members/${l.memberId}/loans/${l.id}/pay`}
                    hx-target="#htmx-modal-content"
                    hx-swap="innerHTML"
                    onClick="document.getElementById('htmx-modal').showModal()"
                  >
                    <Icon icon={Banknote} size={12} /> Pay
                  </button>
                )}
              </div>
            </div>
          )) : (
            <div class="p-16 text-center text-slate-400 italic text-sm">No active or past loans found</div>
          )}
        </div>
    </div>
  );
}

// Partial component for shares history (OOB Swap)
export function MemberDetailSharesTab({ id, memberId, shares = [] }) {
  return (
    <div id={id} hx-swap-oob={id ? "true" : "false"} class="flex flex-col gap-4">
        <div class="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <div class="font-bold text-slate-700">Equity & Shares</div>
            <button 
              class="btn btn-xs btn-primary gap-1"
              hx-get={`/dashboard/members/${memberId}/shares/new`}
              hx-target="#htmx-modal-content"
              hx-swap="innerHTML"
              onClick="document.getElementById('htmx-modal').showModal()"
            >
               <Icon icon={Plus} size={12} /> Buy Shares
            </button>
        </div>

        <div class="divide-y divide-slate-50 border border-slate-100 rounded-xl overflow-hidden bg-base-100">
          {shares.length > 0 ? shares.map(s => (
            <div key={s.id} class="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center group">
              <div class="grow">
                <div class="font-black text-slate-700">{(s.amount || 0).toLocaleString()} <span class="text-[10px] text-slate-400 font-medium">UGX</span></div>
                <div class="text-[9px] text-slate-400 italic">Purchased: {s.date}</div>
              </div>
              <div class="badge badge-sm badge-outline badge-primary uppercase text-[9px] font-black tracking-tighter">Verified</div>
            </div>
          )) : (
            <div class="p-16 text-center text-slate-400 italic text-sm">No shares history found</div>
          )}
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
      class="card bg-base-100 border border-base-200 shadow-sm overflow-hidden"
    >
      <div class="card-body p-0">
        <div class="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center gap-3">
           <Icon icon={User} size={18} class="text-slate-400" />
           <h3 class="font-bold text-slate-900">Personal Profile</h3>
        </div>
        <div class="p-6 space-y-5">
          <div class="form-control">
              <label class="label pt-0"><span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</span></label>
              <input type="text" name="fullName" value={member.fullName} class="input input-bordered focus:input-primary w-full input-sm font-bold" required />
          </div>
          <div class="grid grid-cols-1 gap-4">
            <div class="form-control">
                <label class="label pt-0"><span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone Number</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Icon icon={Phone} size={12} /></div>
                  <input type="tel" name="phone" value={member.phone || ''} class="input input-bordered focus:input-primary w-full input-sm pl-8 font-mono" />
                </div>
            </div>
            <div class="form-control">
                <label class="label pt-0"><span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Address</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Icon icon={MapPin} size={12} /></div>
                  <input type="text" name="address" value={member.address || ''} class="input input-bordered focus:input-primary w-full input-sm pl-8" />
                </div>
            </div>
          </div>
          
          <div class="divider text-[10px] uppercase font-bold tracking-widest opacity-30">Next of Kin</div>
          
          <div class="space-y-4">
            <div class="form-control">
                <label class="label pt-0"><span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Name</span></label>
                <input type="text" name="nextOfKinName" value={member.nextOfKinName || ''} class="input input-bordered focus:input-primary w-full input-sm" />
            </div>
            <div class="form-control">
                <label class="label pt-0"><span class="label-text text-[10px] font-bold uppercase tracking-widest text-slate-400">Contact</span></label>
                <input type="tel" name="nextOfKinPhone" value={member.nextOfKinPhone || ''} class="input input-bordered focus:input-primary w-full input-sm font-mono" />
            </div>
          </div>
        </div>
        <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button type="submit" class="btn btn-primary btn-sm px-6 rounded-lg">Save Profile</button>
        </div>
      </div>
    </form>
  );
}


export default function MemberDetailPage({ member, stats, loans = [], savings = [], shares = [], trendData = [] }) {
  if (!member) {
    return (
      <DashboardLayout title="Member Not Found">
        <div class="text-center py-20"><h2 class="text-2xl font-bold text-slate-400">Member not found</h2><a href="/dashboard/members" class="btn btn-ghost mt-4 underline text-primary">Back to Directory</a></div>
      </DashboardLayout>
    );
  }

  const chartOptions = {
    series: [
      { name: 'Savings Flow', data: trendData.map(d => d.savings) },
      { name: 'Loan Issuance', data: trendData.map(d => d.loans) }
    ],
    chart: { 
      type: 'area', 
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
      sparkline: { enabled: false }
    },
    grid: { show: false },
    colors: ['#10B981', '#F59E0B'], // Success Green and Warning Amber
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { 
      categories: trendData.map(d => d.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#94a3b8', fontWeight: 600 } }
    },
    yaxis: { show: false },
    fill: { 
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [20, 100] }
    },
    legend: { show: false },
    tooltip: { theme: 'light' }
  };

  return (
    <DashboardLayout title={`${member.fullName} | Profile`}>
      <div class="max-w-full overflow-x-hidden">
        <div class="flex flex-col gap-8 pb-12">
          
          {/* Header */}
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div class="flex items-center gap-4">
              <a href="/dashboard/members" class="btn btn-ghost btn-sm p-0 hover:bg-transparent"><Icon icon={ArrowLeft} size={20} /></a>
              <div>
                <h1 class="text-3xl font-black tracking-tight text-slate-900">{member.fullName}</h1>
                <div class="flex items-center gap-3 text-slate-500 text-xs mt-1 font-medium">
                  <div class="badge badge-primary badge-sm gap-1 font-bold h-6 px-3">
                     <Icon icon={ShieldCheck} size={12} />
                     {member.memberNumber}
                  </div>
                  <span>Joined {member.createdAt}</span>
                  <span class={`badge badge-sm badge-outline uppercase text-[10px] font-black tracking-tighter ${member.status === 'active' ? 'badge-success text-success' : 'badge-error text-error'}`}>{member.status}</span>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <a 
                href={`/dashboard/reports/member-statement/${member.id}`} 
                class="btn btn-outline btn-sm gap-2 rounded-xl h-10 px-5"
              >
                 <Icon icon={FileText} size={16} /> Member Statement
              </a>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* FEATURED: Financial Profile Card */}
            <div class="lg:col-span-2">
              <div class="card bg-base-100 border border-base-200 shadow-sm overflow-hidden h-full">
                <div class="card-body p-6 md:p-8">
                  <div class="flex justify-between items-start border-b border-slate-100 pb-6 mb-6">
                    <dl>
                      <dt class="text-sm font-medium text-slate-500 mb-1">Savings Balance</dt>
                      <dd class="text-4xl font-black text-slate-900 tracking-tight">
                        {stats.savingsBalance.toLocaleString()}
                        <span class="text-lg font-medium text-slate-400 ml-2">UGX</span>
                      </dd>
                    </dl>
                    <div class="flex flex-col items-end gap-1">
                       <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Credit</span>
                       <div class="text-lg font-bold text-error">-{stats.loanBalance.toLocaleString()}</div>
                    </div>
                  </div>

                  <div class="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 mb-6">
                    <div class="flex justify-between items-center mb-4 px-2">
                       <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest">Financial Trend (6mo)</h3>
                       <div class="flex gap-4">
                          <div class="flex items-center gap-2 text-[10px] font-bold text-success uppercase"><div class="w-2 h-2 rounded-full bg-success"></div> Savings</div>
                          <div class="flex items-center gap-2 text-[10px] font-bold text-warning uppercase"><div class="w-2 h-2 rounded-full bg-warning"></div> Loans</div>
                       </div>
                    </div>
                    <ApexChart 
                      id="member-trend-chart" 
                      options={chartOptions} 
                      height={220} 
                    />
                  </div>

                  {/* Stat Grid using StatsCard */}
                  <MemberDetailStats id="member-stats-container" stats={stats} />
                </div>
              </div>
            </div>

            {/* SIDEBAR: Profile & Actions */}
            <div class="flex flex-col gap-6">
              <MemberDetailProfileForm id="member-profile-form" member={member} />
              
              <div class="alert alert-info/10 border-info/20 text-xs font-medium text-info leading-relaxed">
                 <Icon icon={History} size={16} class="shrink-0" />
                 <div>
                    KYC record verified on {member.createdAt}. 
                    Changes to primary ID require administrative approval.
                 </div>
              </div>
            </div>
          </div>

          {/* SECONDARY ROW: History Ledger Tabs */}
          <div class="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
            <div class="card-body p-0">
              <div role="tablist" class="tabs tabs-bordered w-full bg-slate-50/30">
                
                {/* Savings Tab */}
                <input type="radio" name="member_tabs" role="tab" class="tab h-14 font-bold text-xs uppercase tracking-widest text-slate-400 checked:!text-primary checked:!border-primary" aria-label="Savings History" checked />
                <div role="tabpanel" class="tab-content bg-base-100 p-6 border-t border-slate-100">
                  <MemberDetailSavingsTab id="member-savings-history" memberId={member.id} savings={savings} />
                </div>

                {/* Loans Tab */}
                <input type="radio" name="member_tabs" role="tab" class="tab h-14 font-bold text-xs uppercase tracking-widest text-slate-400 checked:!text-primary checked:!border-primary" aria-label="Loans Portfolio" />
                 <div role="tabpanel" class="tab-content bg-base-100 p-6 border-t border-slate-100">
                  <MemberDetailLoansTab id="member-loans-history" memberId={member.id} loans={loans} />
                </div>

                {/* Shares Tab */}
                <input type="radio" name="member_tabs" role="tab" class="tab h-14 font-bold text-xs uppercase tracking-widest text-slate-400 checked:!text-primary checked:!border-primary" aria-label="Equity & Shares" />
                <div role="tabpanel" class="tab-content bg-base-100 p-6 border-t border-slate-100">
                   <MemberDetailSharesTab id="member-shares-history" memberId={member.id} shares={shares} />
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}