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
                <thead><tr><th>Date</th><th>Type</th><th class="text-right">Amount (UGX)</th></tr></thead>
                <tbody>
                    {savings.length > 0 ? savings.map(s => (
                        <tr key={s.id}>
                            <td>{s.date}</td>
                            <td><span class={`badge badge-xs badge-soft uppercase font-bold tracking-wider ${s.type === 'deposit' ? 'badge-success' : 'badge-error'}`}>{s.type}</span></td>
                            <td class="text-right font-medium">{(s.amount || 0).toLocaleString()}</td>
                        </tr>
                    )) : (
                        <tr><td colspan="3" class="text-center py-4 text-slate-400">No savings history</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

// Partial component for loans history (OOB Swap)
export function MemberDetailLoansTab({ id, loans = [] }) {
  return (
    <ul id={id} hx-swap-oob={id ? "true" : "false"} class="list bg-base-100 rounded-box shadow-sm border border-base-200">
      <li class="p-4 pb-2 text-xs opacity-60 tracking-wide uppercase font-bold border-b border-base-200">Loans History (UGX)</li>
      {loans.length > 0 ? loans.map(l => (
        <li key={l.id} class="list-row items-center">
          <div class="grow">
            <div class="font-bold text-lg">{(l.principal || 0).toLocaleString()}</div>
            <div class="text-xs uppercase font-semibold opacity-60">{l.durationMonths} Months • {l.interestRate}% Interest</div>
            <div class="text-xs opacity-40 italic">Issued: {l.issuedDate}</div>
          </div>
          <div class="min-w-24 text-center">
            <span class={`badge badge-sm badge-soft uppercase text-[10px] font-bold tracking-wider ${l.status === 'active' ? 'badge-info' : 'badge-success'}`}>{l.status}</span>
          </div>
          <div class="min-w-32 flex justify-end">
            {l.status === 'active' && (
              <button 
                class="btn btn-sm btn-success text-white gap-2 px-4"
                hx-get={`/dashboard/members/${l.memberId}/loans/${l.id}/pay`}
                hx-target="#htmx-modal-content"
                hx-swap="innerHTML"
                onClick="document.getElementById('htmx-modal').showModal()"
              >
                <Icon icon={Banknote} size={16} /> Pay
              </button>
            )}
          </div>
        </li>
      )) : (
        <li class="p-10 text-center text-slate-400 italic">No loans recorded</li>
      )}
    </ul>
  );
}

// Partial component for shares history (OOB Swap)
export function MemberDetailSharesTab({ id, shares = [] }) {
  return (
    <ul id={id} hx-swap-oob={id ? "true" : "false"} class="list bg-base-100 rounded-box shadow-sm border border-base-200">
      <li class="p-4 pb-2 text-xs opacity-60 tracking-wide uppercase font-bold border-b border-base-200">Investment History (UGX)</li>
      {shares.length > 0 ? shares.map(s => (
        <li key={s.id} class="list-row items-center">
          <div class="grow">
            <div class="font-bold text-lg">{(s.amount || 0).toLocaleString()}</div>
            <div class="text-xs opacity-40 italic">Date: {s.date}</div>
          </div>
          <div class="min-w-24 text-center">
             <span class="badge badge-sm badge-soft badge-primary uppercase text-[10px] font-bold tracking-wider">Equity</span>
          </div>
          <div class="min-w-32 flex justify-end">
             <div class="p-2 bg-primary/10 text-primary rounded-lg"><Icon icon={PieChart} size={16} /></div>
          </div>
        </li>
      )) : (
        <li class="p-10 text-center text-slate-400 italic">No shares history</li>
      )}
    </ul>
  );
}

export function MemberDetailProfileForm({ id, member }) {
  return (
    <form 
      id={id}
      hx-put={`/dashboard/members/${member.id}`}
      hx-target={`#${id}`}
      hx-swap="outerHTML"
    >
      <div class="card bg-base-100 border border-base-200 shadow-sm">
        <div class="card-body">
          <h3 class="font-bold text-lg border-b pb-2 mb-4">Personal Profile</h3>
          <div class="space-y-4 text-sm">
            <div class="form-control">
                <label class="label"><span class="label-text font-medium">Full Name</span></label>
                <input type="text" name="fullName" value={member.fullName} class="input input-bordered w-full input-sm" required />
            </div>
            <div class="form-control">
                <label class="label"><span class="label-text font-medium">Phone Number</span></label>
                <input type="tel" name="phone" value={member.phone || ''} class="input input-bordered w-full input-sm" />
            </div>
            <div class="form-control">
                <label class="label"><span class="label-text font-medium">Address</span></label>
                <input type="text" name="address" value={member.address || ''} class="input input-bordered w-full input-sm" />
            </div>
            <div class="divider my-1"></div>
            <div class="form-control">
                <label class="label"><span class="label-text font-medium">Next of Kin Name</span></label>
                <input type="text" name="nextOfKinName" value={member.nextOfKinName || ''} class="input input-bordered w-full input-sm" />
            </div>
            <div class="form-control">
                <label class="label"><span class="label-text font-medium">Next of Kin Phone</span></label>
                <input type="tel" name="nextOfKinPhone" value={member.nextOfKinPhone || ''} class="input input-bordered w-full input-sm" />
            </div>
          </div>
          <div class="card-actions justify-end mt-6">
            <button type="submit" class="btn btn-primary btn-sm">Save Profile</button>
          </div>
        </div>
      </div>
    </form>
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
                <span class="badge badge-primary badge-sm badge-soft">{member.memberNumber}</span> • <span>Joined {member.createdAt}</span> • <span class={`badge badge-sm badge-soft uppercase text-[10px] font-bold tracking-wider ${member.status === 'active' ? 'badge-success' : 'badge-error'}`}>{member.status}</span>
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <button 
              class="btn btn-outline btn-sm gap-2"
              hx-get={`/dashboard/members/${member.id}/deposit`}
              hx-target="#htmx-modal-content"
              hx-swap="innerHTML"
              onClick="document.getElementById('htmx-modal').showModal()"
            >
               <Icon icon={Plus} size={16} /> Deposit
            </button>
            <button 
              class="btn btn-outline btn-sm gap-2"
              hx-get={`/dashboard/members/${member.id}/shares/new`}
              hx-target="#htmx-modal-content"
              hx-swap="innerHTML"
              onClick="document.getElementById('htmx-modal').showModal()"
            >
               <Icon icon={PieChart} size={16} /> Buy Shares
            </button>
            {loans.some(l => l.status === 'active') ? (
              <div class="tooltip tooltip-bottom" data-tip="Member has an active loan">
                <button class="btn btn-primary btn-sm gap-2 btn-disabled">
                  <Icon icon={Banknote} size={16} /> New Loan
                </button>
              </div>
            ) : (
              <button 
                class="btn btn-primary btn-sm gap-2"
                hx-get={`/dashboard/members/${member.id}/loans/new`}
                hx-target="#htmx-modal-content"
                hx-swap="innerHTML"
                onClick="document.getElementById('htmx-modal').showModal()"
              >
                <Icon icon={Banknote} size={16} /> New Loan
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <MemberDetailStats id="member-stats-container" stats={stats} />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-1 space-y-6">
            <MemberDetailProfileForm id="member-profile-form" member={member} />
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
                    <MemberDetailLoansTab id="member-loans-history" loans={loans} />
                  </div>

                  {/* Shares Tab */}
                  <input type="radio" name="member_tabs" role="tab" class="tab" aria-label="Shares" />
                  <div role="tabpanel" class="tab-content bg-base-100 border-base-200 p-6">
                     <MemberDetailSharesTab id="member-shares-history" shares={shares} />
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