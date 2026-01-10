import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { 
  ArrowLeft, Phone, MapPin, User, 
  Wallet, Banknote, PieChart, History, Plus
} from 'lucide';

const formatUGX = (val) => (val || 0).toLocaleString() + ' UGX';

// Partial component for stats (OOB Swap)
export function MemberDetailStats({ id, stats }) {
  return (
    <div id={id} hx-swap-oob={id ? "true" : "false"} class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="stats shadow border border-base-200">
        <div class="stat">
          <div class="stat-figure text-primary"><Icon icon={PieChart} size={24} /></div>
          <div class="stat-title">Total Shares</div>
          <div class="stat-value text-primary text-2xl">{formatUGX(stats.totalShares)}</div>
        </div>
      </div>
      <div class="stats shadow border border-base-200">
        <div class="stat">
          <div class="stat-figure text-success"><Icon icon={Wallet} size={24} /></div>
          <div class="stat-title">Savings Balance</div>
          <div class="stat-value text-success text-2xl">{formatUGX(stats.savingsBalance)}</div>
        </div>
      </div>
      <div class="stats shadow border border-base-200">
        <div class="stat">
          <div class="stat-figure text-error"><Icon icon={Banknote} size={24} /></div>
          <div class="stat-title">Loan Balance</div>
          <div class="stat-value text-error text-2xl">{formatUGX(stats.loanBalance)}</div>
        </div>
      </div>
    </div>
  );
}

// Partial component for savings history (OOB Swap)
export function MemberDetailSavingsTab({ id, savings = [] }) {
    return (
        <div id={id} hx-swap-oob={id ? "true" : "false"} class="overflow-x-auto">
            <table class="table table-sm">
                <thead><tr><th>Date</th><th>Type</th><th class="text-right">Amount</th></tr></thead>
                <tbody>
                    {savings.length > 0 ? savings.map(s => (
                        <tr key={s.id}>
                            <td>{s.date}</td>
                            <td><span class={`badge badge-xs ${s.type === 'deposit' ? 'badge-success' : 'badge-error'}`}>{s.type}</span></td>
                            <td class="text-right font-medium">{formatUGX(s.amount)}</td>
                        </tr>
                    )) : (
                        <tr><td colspan="3" class="text-center py-4 text-slate-400">No savings history</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}


export default function MemberDetailPage({ member, stats, loans = [], savings = [], shares = [] }) {
  if (!member) {
    return (
      <DashboardLayout title="Member Not Found">
        <div class="text-center py-20"><h2 class="text-2xl font-bold">Member not found</h2><a href="/dashboard/members" class="btn btn-ghost mt-4">Back to list</a></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`${member.fullName} | Profile`}>
      <div class="flex flex-col gap-6">
        
        {/* Header */}
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-4">
            <a href="/dashboard/members" class="btn btn-ghost btn-circle"><Icon icon={ArrowLeft} size={24} /></a>
            <div>
              <h1 class="text-3xl font-bold tracking-tight">{member.fullName}</h1>
              <div class="flex items-center gap-2 text-slate-500 text-sm">
                <span class="badge badge-primary badge-sm">{member.memberNumber}</span> • <span>Joined {member.createdAt}</span> • <span class={`capitalize ${member.status === 'active' ? 'text-success' : 'text-error'}`}>{member.status}</span>
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <button 
              class="btn btn-outline btn-sm gap-2"
              hx-get={`/dashboard/members/${member.id}/deposit`}
              hx-target="#htmx-modal-content"
              hx-swap="innerHTML"
              onClick="htmx-modal.showModal()"
            >
               <Icon icon={Plus} size={16} /> Deposit
            </button>
            <button class="btn btn-primary btn-sm gap-2">
               <Icon icon={Banknote} size={16} /> New Loan
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <MemberDetailStats id="member-stats-container" stats={stats} />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Personal Info */}
          <div class="lg:col-span-1 space-y-6">
             <div class="card bg-base-100 border border-base-200 shadow-sm">
              <div class="card-body">
                <h3 class="font-bold text-lg border-b pb-2 mb-4">Personal Profile</h3>
                <div class="space-y-4 text-sm">
                  <div class="flex items-start gap-3"><Icon icon={Phone} size={18} class="text-slate-400 mt-0.5" /><div><div class="font-semibold">Phone</div><div class="text-slate-600">{member.phone}</div></div></div>
                  <div class="flex items-start gap-3"><Icon icon={MapPin} size={18} class="text-slate-400 mt-0.5" /><div><div class="font-semibold">Address</div><div class="text-slate-600">{member.address || 'N/A'}</div></div></div>
                  <div class="divider my-1"></div>
                  <div class="flex items-start gap-3"><Icon icon={User} size={18} class="text-slate-400 mt-0.5" /><div><div class="font-semibold text-xs uppercase tracking-wider opacity-60">Next of Kin</div><div class="font-medium">{member.nextOfKinName || 'N/A'}</div><div class="text-slate-600 text-xs">{member.nextOfKinPhone || ''}</div></div></div>
                </div>
                <div class="card-actions mt-6"><button class="btn btn-outline btn-block btn-sm">Edit Profile</button></div>
              </div>
            </div>
          </div>

          {/* Main Content - History Tabs */}
          <div class="lg:col-span-2">
            <div class="card bg-base-100 border border-base-200 shadow-sm">
              <div class="card-body p-0">
                <div role="tablist" class="tabs tabs-lifted tabs-lg w-full">
                  
                  {/* Savings Tab */}
                  <input type="radio" name="member_tabs" role="tab" class="tab" aria-label="Savings" checked />
                  <div role="tabpanel" class="tab-content bg-base-100 border-base-200 p-6">
                    <MemberDetailSavingsTab id="member-savings-history" savings={savings} />
                  </div>

                  {/* Loans Tab */}
                  <input type="radio" name="member_tabs" role="tab" class="tab" aria-label="Loans" />
                   <div role="tabpanel" class="tab-content bg-base-100 border-base-200 p-6">
                    <div class="space-y-4">
                       {loans.length > 0 ? loans.map(l => (
                         <div key={l.id} class="p-4 border rounded-lg flex justify-between items-center">
                            <div><div class="font-bold">{formatUGX(l.principal)}</div><div class="text-xs text-slate-500">Issued: {l.issuedDate} • {l.interestRate}% Interest</div></div>
                            <div class="text-right"><span class={`badge ${l.status === 'active' ? 'badge-info' : 'badge-success'}`}>{l.status}</span><div class="text-xs mt-1">Months: {l.durationMonths}</div></div>
                         </div>
                       )) : <div class="text-center py-10 text-slate-400 italic">No loans recorded</div>}
                    </div>
                  </div>

                  {/* Shares Tab */}
                  <input type="radio" name="member_tabs" role="tab" class="tab" aria-label="Shares" />
                  <div role="tabpanel" class="tab-content bg-base-100 border-base-200 p-6">
                     <div class="overflow-x-auto">
                      <table class="table table-sm">
                        <thead><tr><th>Date</th><th class="text-right">Investment</th></tr></thead>
                        <tbody>
                          {shares.length > 0 ? shares.map(s => (
                            <tr key={s.id}><td>{s.date}</td><td class="text-right font-medium">{formatUGX(s.amount)}</td></tr>
                          )) : <tr><td colspan="2" class="text-center py-4 text-slate-400">No shares history</td></tr>}
                        </tbody>
                      </table>
                    </div>
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