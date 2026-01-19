import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import { ArrowLeft, Banknote, Plus, CheckCircle2, History, AlertCircle, TrendingUp } from 'lucide';

export default function MemberLoansPage({ member, loans = [], loanLimit = 0 }) {
  const activeLoans = loans.filter(l => l.status === 'active');
  const totalPrincipal = loans.reduce((sum, l) => sum + l.principal, 0);
  const totalPaid = loans.reduce((sum, l) => sum + (l.totalPaid || 0), 0);

  return (
    <DashboardLayout title={`Loans: ${member.fullName}`}>
      <div class="mx-auto max-w-screen-xl flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-4">
            <a href={`/dashboard/members/${member.id}`} class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:bg-opacity-90 shadow-default transition-all">
               <Icon icon={ArrowLeft} size={20} />
            </a>
            <div>
              <h2 class="text-2xl font-black text-black uppercase tracking-tight">Credit Portfolio</h2>
              <p class="text-sm text-body font-medium">Loan history and active obligations for {member.fullName}</p>
            </div>
          </div>
          <a 
            href={loanLimit > 0 && activeLoans.length === 0 ? `/dashboard/members/${member.id}/loans/new` : '#'} 
            class={`btn btn-primary gap-2 uppercase tracking-widest text-xs font-black px-6 shadow-md ${loanLimit <= 0 || activeLoans.length > 0 ? 'btn-disabled opacity-50' : ''}`}
            onclick={activeLoans.length > 0 ? "alert('Clear active loan first')" : undefined}
          >
             <Icon icon={Plus} size={16} /> New Loan Application
          </a>
        </div>

        {/* Loan Stats */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Max Borrowing Limit</p>
                <h3 class="text-2xl font-black text-primary font-mono">{loanLimit.toLocaleString()} <span class="text-xs">UGX</span></h3>
            </div>
            <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Principle Issued</p>
                <h3 class="text-2xl font-black text-black font-mono">{totalPrincipal.toLocaleString()} <span class="text-xs">UGX</span></h3>
            </div>
            <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Historical Settlement</p>
                <h3 class="text-2xl font-black text-success font-mono">{totalPaid.toLocaleString()} <span class="text-xs">UGX</span></h3>
            </div>
        </div>

        <div class="flex flex-col gap-6">
            <div class="bg-gray-2/50 py-2 px-4 rounded-sm border-l-4 border-primary">
                <h4 class="font-black text-black text-[10px] uppercase tracking-[0.2em]">Application History</h4>
            </div>

            {loans.length > 0 ? loans.map((l) => {
                const totalInterest = l.principal * (l.interestRate / 100) * l.durationMonths;
                const totalDue = l.principal + totalInterest;
                const progress = Math.min(100, Math.round(((l.totalPaid || 0) / totalDue) * 100));
                const balance = totalDue - (l.totalPaid || 0);

                return (
                    <div key={l.id} class="rounded-sm border border-stroke bg-white shadow-default overflow-hidden">
                        <div class="p-6">
                            <div class="flex flex-col md:flex-row justify-between gap-6">
                                <div class="flex-grow space-y-4">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <h5 class="text-lg font-black text-black">{l.principal.toLocaleString()} <span class="text-xs font-bold text-body">UGX Principal</span></h5>
                                            <p class="text-[10px] font-black text-body uppercase tracking-[0.2em] mt-1">ID: {l.id} • Issued: {l.issuedDate}</p>
                                        </div>
                                        <Badge type={l.status === 'active' ? 'info' : 'success'}>{l.status.toUpperCase()}</Badge>
                                    </div>

                                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-stroke border-dashed">
                                        <div>
                                            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rate</p>
                                            <p class="text-xs font-black text-black">{l.interestRate}%</p>
                                        </div>
                                        <div>
                                            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Term</p>
                                            <p class="text-xs font-black text-black">{l.durationMonths} Months</p>
                                        </div>
                                        <div>
                                            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Interest</p>
                                            <p class="text-xs font-black text-black">{totalInterest.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Payable</p>
                                            <p class="text-xs font-black text-primary">{totalDue.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div class="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                            <span class="text-slate-400">Repayment Status</span>
                                            <span class="text-success">{progress}% Settled</span>
                                        </div>
                                        <div class="relative h-2 w-full rounded-full bg-slate-100">
                                            <div class="absolute left-0 top-0 h-full rounded-full bg-success transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="md:w-64 bg-slate-50 p-6 rounded-sm flex flex-col justify-between border-l border-stroke">
                                    <div class="text-center md:text-right">
                                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Balance</p>
                                        <p class="text-xl font-black text-black font-mono">{balance.toLocaleString()} <span class="text-[10px]">UGX</span></p>
                                    </div>
                                    {l.status === 'active' && (
                                        <a href={`/dashboard/members/${l.memberId}/loans/${l.id}/pay`} class="btn btn-success w-full mt-6 gap-2 font-black uppercase tracking-widest text-xs">
                                            <Icon icon={CheckCircle2} size={16} /> Make Payment
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }) : (
                <div class="p-20 text-center bg-white border border-stroke rounded-sm italic text-body">
                    No active or historical loans recorded for this member.
                </div>
            )}
        </div>
      </div>
    </DashboardLayout>
  );
}