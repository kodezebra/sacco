import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import ApexChart from '../../components/ApexChart.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import Badge from '../../components/Badge.jsx';
import { 
  ArrowLeft, Phone, MapPin, User, 
  Wallet, Banknote, PieChart, History, Plus, Minus, FileText,
  TrendingUp, TrendingDown, ArrowUpRight, ShieldCheck
} from 'lucide';

const formatUGX = (val) => (val || 0).toLocaleString() + ' UGX';

// Partial component for stats (OOB Swap)
export function MemberDetailStats({ id, stats }) {
  return (
    <div id={id} hx-swap-oob={id ? "true" : "false"} class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
      <StatsCard 
        label="Total Shares" 
        value={formatUGX(stats.totalShares)} 
        icon={PieChart} 
        colorClass="text-primary" 
      />
      <StatsCard 
        label="Savings Balance" 
        value={formatUGX(stats.savingsBalance)} 
        icon={Wallet} 
        colorClass="text-success" 
      />
      <StatsCard 
        label="Loan Balance" 
        value={formatUGX(stats.loanBalance)} 
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
            <div class="flex justify-between items-center py-4 border-b border-stroke">
                <h4 class="text-xl font-semibold text-black">Savings History</h4>
                <div class="flex gap-2">
                    <button 
                      class="inline-flex items-center justify-center gap-2.5 rounded-sm bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-4"
                      hx-get={`/dashboard/members/${memberId}/deposit`}
                      hx-target="#htmx-modal-content"
                      hx-swap="innerHTML"
                      onClick="document.getElementById('htmx-modal').showModal()"
                    >
                       <Icon icon={Plus} size={16} /> Deposit
                    </button>
                    <button 
                      class="inline-flex items-center justify-center gap-2.5 rounded-sm border border-stroke bg-gray py-2 px-6 text-center font-medium text-black hover:border-primary hover:text-primary lg:px-4"
                      hx-get={`/dashboard/members/${memberId}/withdraw`}
                      hx-target="#htmx-modal-content"
                      hx-swap="innerHTML"
                      onClick="document.getElementById('htmx-modal').showModal()"
                    >
                       <Icon icon={Minus} size={16} /> Withdraw
                    </button>
                </div>
            </div>

            <div class="max-w-full overflow-x-auto rounded-sm border border-stroke bg-white shadow-default">
                <table class="w-full table-auto">
                    <thead>
                        <tr class="bg-gray-2 text-left">
                            <th class="py-4 px-4 font-medium text-black uppercase">Date</th>
                            <th class="py-4 px-4 font-medium text-black uppercase">Type</th>
                            <th class="py-4 px-4 text-right font-medium text-black uppercase">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {savings.length > 0 ? savings.map(s => (
                            <tr key={s.id} class="border-b border-stroke hover:bg-whiten transition-colors">
                                <td class="py-4 px-4 text-black">{s.date}</td>
                                <td class="py-4 px-4"><Badge type={s.type === 'deposit' ? 'success' : 'error'}>{s.type}</Badge></td>
                                <td class={`py-4 px-4 text-right font-bold ${s.type === 'deposit' ? 'text-success' : 'text-error'}`}>
                                  {s.type === 'deposit' ? '+' : '-'}{(s.amount || 0).toLocaleString()}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colspan="3" class="text-center py-10 text-body italic">No savings history recorded</td></tr>
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
        <div class="flex justify-between items-center py-4 border-b border-stroke">
            <h4 class="text-xl font-semibold text-black">Loans Portfolio</h4>
            <button 
                class={`inline-flex items-center justify-center gap-2.5 rounded-sm bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 ${loans.some(l => l.status === 'active') ? 'opacity-50 cursor-not-allowed' : ''}`}
                hx-get={!loans.some(l => l.status === 'active') ? `/dashboard/members/${memberId}/loans/new` : undefined}
                hx-target="#htmx-modal-content"
                hx-swap="innerHTML"
                onClick={!loans.some(l => l.status === 'active') ? "document.getElementById('htmx-modal').showModal()" : undefined}
            >
                <Icon icon={Plus} size={16} /> New Loan
            </button>
        </div>

        <div class="border border-stroke rounded-sm bg-white shadow-default">
          {loans.length > 0 ? loans.map((l, idx) => (
            <div key={l.id} class={`p-4 hover:bg-whiten transition-colors flex justify-between items-center group ${idx !== loans.length - 1 ? 'border-b border-stroke' : ''}`}>
              <div class="grow">
                <h5 class="font-bold text-black">{(l.principal || 0).toLocaleString()} <span class="text-xs text-body font-medium">UGX</span></h5>
                <p class="text-xs font-bold text-body uppercase">{l.durationMonths} Months • {l.interestRate}% Interest</p>
                <p class="text-xs text-bodydark2 italic">Issued: {l.issuedDate}</p>
              </div>
              <div class="flex items-center gap-4">
                <Badge type={l.status === 'active' ? 'info' : 'success'}>{l.status}</Badge>
                {l.status === 'active' && (
                  <button  
                    class="inline-flex items-center justify-center gap-2 rounded-sm bg-success py-1 px-3 text-center text-xs font-medium text-white hover:bg-opacity-90"
                    hx-get={`/dashboard/members/${l.memberId}/loans/${l.id}/pay`}
                    hx-target="#htmx-modal-content"
                    hx-swap="innerHTML"
                    onClick="document.getElementById('htmx-modal').showModal()"
                  >
                    <Icon icon={Banknote} size={14} /> Pay
                  </button>
                )}
              </div>
            </div>
          )) : (
            <div class="p-10 text-center text-body italic text-sm">No active or past loans found</div>
          )}
        </div>
    </div>
  );
}

// Partial component for shares history (OOB Swap)
export function MemberDetailSharesTab({ id, memberId, shares = [] }) {
  return (
    <div id={id} hx-swap-oob={id ? "true" : "false"} class="flex flex-col gap-4">
        <div class="flex justify-between items-center py-4 border-b border-stroke">
            <h4 class="text-xl font-semibold text-black">Equity & Shares</h4>
            <button 
              class="inline-flex items-center justify-center gap-2.5 rounded-sm bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-4"
              hx-get={`/dashboard/members/${memberId}/shares/new`}
              hx-target="#htmx-modal-content"
              hx-swap="innerHTML"
              onClick="document.getElementById('htmx-modal').showModal()"
            >
               <Icon icon={Plus} size={16} /> Buy Shares
            </button>
        </div>

        <div class="border border-stroke rounded-sm bg-white shadow-default">
          {shares.length > 0 ? shares.map((s, idx) => (
            <div key={s.id} class={`p-4 hover:bg-whiten transition-colors flex justify-between items-center group ${idx !== shares.length - 1 ? 'border-b border-stroke' : ''}`}>
              <div class="grow">
                <h5 class="font-bold text-black">{(s.amount || 0).toLocaleString()} <span class="text-xs text-body font-medium">UGX</span></h5>
                <p class="text-xs text-bodydark2 italic">Purchased: {s.date}</p>
              </div>
              <Badge type="primary">Verified</Badge>
            </div>
          )) : (
            <div class="p-10 text-center text-body italic text-sm">No shares history found</div>
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
      class="rounded-sm border border-stroke bg-white shadow-default"
    >
        <div class="border-b border-stroke py-4 px-6">
           <h3 class="font-semibold text-black">Personal Profile</h3>
        </div>
        <div class="p-6">
          <div class="mb-4">
              <label class="mb-2.5 block text-black font-medium text-sm">Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                value={member.fullName} 
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-black" 
                required 
              />
          </div>
          
          <div class="mb-4">
              <label class="mb-2.5 block text-black font-medium text-sm">Phone Number</label>
              <div class="relative">
                <input 
                    type="tel" 
                    name="phone" 
                    value={member.phone || ''} 
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-12 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-black"
                />
                <span class="absolute left-4 top-3.5 text-body">
                    <Icon icon={Phone} size={20} />
                </span>
              </div>
          </div>
            
          <div class="mb-6">
              <label class="mb-2.5 block text-black font-medium text-sm">Address</label>
              <div class="relative">
                <input 
                    type="text" 
                    name="address" 
                    value={member.address || ''} 
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-12 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-black"
                />
                <span class="absolute left-4 top-3.5 text-body">
                    <Icon icon={MapPin} size={20} />
                </span>
              </div>
          </div>
          
          <div class="mb-4">
              <h4 class="mb-2.5 block text-black font-semibold text-sm uppercase opacity-50">Next of Kin</h4>
              <div class="grid grid-cols-1 gap-4">
                 <div>
                    <label class="mb-2.5 block text-black font-medium text-xs">Name</label>
                    <input type="text" name="nextOfKinName" value={member.nextOfKinName || ''} class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary text-black text-sm" />
                 </div>
                 <div>
                    <label class="mb-2.5 block text-black font-medium text-xs">Contact</label>
                    <input type="tel" name="nextOfKinPhone" value={member.nextOfKinPhone || ''} class="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary text-black text-sm" />
                 </div>
              </div>
          </div>

          <div class="flex justify-end gap-4">
            <button type="submit" class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90">
                Save
            </button>
          </div>
      </div>
    </form>
  );
}


export default function MemberDetailPage({ member, stats, loans = [], savings = [], shares = [], trendData = [] }) {
  if (!member) {
    return (
      <DashboardLayout title="Member Not Found">
        <div class="text-center py-20"><h2 class="text-2xl font-bold text-body">Member not found</h2><a href="/dashboard/members" class="btn btn-ghost mt-4 underline text-primary">Back to Directory</a></div>
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
      height: 310,
      toolbar: { show: false }
    },
    colors: ['#10B981', '#F59E0B'],
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { 
      categories: trendData.map(d => d.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    fill: { 
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.55, opacityTo: 0.05, stops: [0, 100] }
    },
    grid: { strokeDashArray: 4, yaxis: { lines: { show: true } } },
    dataLabels: { enabled: false },
  };

  return (
    <DashboardLayout title="Member Profile">
      <div class="mx-auto max-w-screen-2xl">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-4">
            <a href="/dashboard/members" class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:bg-opacity-90 shadow-default">
                <Icon icon={ArrowLeft} size={20} />
            </a>
            <h2 class="text-title-md font-bold text-black">
                {member.fullName}
            </h2>
             <Badge type={member.status === 'active' ? 'success' : 'error'}>{member.status}</Badge>
          </div>

          <div class="flex gap-2">
              <a 
                href={`/dashboard/reports/member-statement/${member.id}`} 
                class="inline-flex items-center justify-center gap-2.5 rounded-sm border border-stroke bg-white py-2 px-6 text-center font-medium text-black hover:border-primary hover:text-primary lg:px-4 shadow-default"
              >
                 <Icon icon={FileText} size={16} /> Statement
              </a>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5">
            {/* KPI Stats */}
            <MemberDetailStats id="member-stats-container" stats={stats} />
            
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                 {/* Chart Section */}
                 <div class="col-span-12 xl:col-span-8 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default sm:px-7.5">
                     <div class="mb-3 justify-between gap-4 sm:flex">
                         <div>
                             <h4 class="text-xl font-bold text-black">Financial Overview</h4>
                             <p class="text-sm font-medium text-body">6 Month Trend</p>
                         </div>
                     </div>
                     <div class="mb-2">
                        <div id="chartMember" class="-ml-5">
                            <ApexChart id="member-trend-chart" options={chartOptions} height={310} />
                        </div>
                     </div>
                 </div>

                 {/* Profile Section */}
                 <div class="col-span-12 xl:col-span-4 flex flex-col gap-4">
                    <MemberDetailProfileForm id="member-profile-form" member={member} />
                    
                    <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
                         <h4 class="mb-4 text-xl font-bold text-black">KYC Status</h4>
                         <div class="flex items-center gap-3 p-4 bg-success/10 rounded-sm">
                             <div class="text-success"><Icon icon={ShieldCheck} size={24} /></div>
                             <div>
                                 <h5 class="font-bold text-black text-sm">Verified</h5>
                                 <p class="text-xs text-body">Member since {member.createdAt}</p>
                             </div>
                         </div>
                    </div>
                 </div>
            </div>

            {/* Tabs Section */}
            <div class="rounded-sm border border-stroke bg-white shadow-default">
                <div role="tablist" class="tabs tabs-bordered w-full border-b border-stroke">
                    <input type="radio" name="member_tabs" role="tab" class="tab h-14 font-bold text-sm text-body checked:!text-primary checked:!border-primary" aria-label="Savings History" checked />
                    <div role="tabpanel" class="tab-content bg-transparent p-6 border-none">
                       <MemberDetailSavingsTab id="member-savings-history" memberId={member.id} savings={savings} />
                    </div>

                    <input type="radio" name="member_tabs" role="tab" class="tab h-14 font-bold text-sm text-body checked:!text-primary checked:!border-primary" aria-label="Loans Portfolio" />
                    <div role="tabpanel" class="tab-content bg-transparent p-6 border-none">
                       <MemberDetailLoansTab id="member-loans-history" memberId={member.id} loans={loans} />
                    </div>

                    <input type="radio" name="member_tabs" role="tab" class="tab h-14 font-bold text-sm text-body checked:!text-primary checked:!border-primary" aria-label="Equity & Shares" />
                    <div role="tabpanel" class="tab-content bg-transparent p-6 border-none">
                       <MemberDetailSharesTab id="member-shares-history" memberId={member.id} shares={shares} />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}