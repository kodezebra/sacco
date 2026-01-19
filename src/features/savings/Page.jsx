import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import TableAction from '../../components/TableAction.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { 
  Search, Eye, ChevronLeft, ChevronRight, 
  ArrowDownLeft, ArrowUpRight, Wallet, TrendingUp, 
  Plus, Minus 
} from 'lucide';

export function Pagination({ page, totalPages, search }) {
  if (totalPages <= 1) return null;

  return (
    <div class="flex justify-between items-center p-6 border-t border-stroke bg-gray-2">
      <div class="text-[10px] font-bold text-bodydark2 uppercase tracking-widest">
        Page {page} of {totalPages}
      </div>
      <div class="join border border-stroke overflow-hidden rounded-sm">
        <button 
          class="join-item btn btn-xs h-9 px-4 bg-white hover:bg-gray-2 text-black border-none" 
          disabled={page <= 1}
          hx-get={`/dashboard/savings?page=${page - 1}&search=${search}`}
          hx-target="#savings-list-container"
          hx-swap="outerHTML"
        >
          <Icon icon={ChevronLeft} size={16} />
        </button>
        <button 
          class="join-item btn btn-xs h-9 px-4 bg-white hover:bg-gray-2 text-black border-none"
          disabled={page >= totalPages}
          hx-get={`/dashboard/savings?page=${page + 1}&search=${search}`}
          hx-target="#savings-list-container"
          hx-swap="outerHTML"
        >
          <Icon icon={ChevronRight} size={16} />
        </button>
      </div>
    </div>
  );
}

export function SavingsList({ savings = [], page = 1, totalPages = 1, search = "" }) {
  return (
    <div id="savings-list-container" class="rounded-sm border border-stroke bg-white shadow-default">
      {/* Card Header */}
      <div class="flex flex-col gap-4 border-b border-stroke px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="text-xl font-bold text-black">Savings Ledger</h3>
        </div>
        
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative">
            <button class="absolute left-3 top-1/2 -translate-y-1/2 text-bodydark2">
              <Icon icon={Search} size={18} />
            </button>
            <input 
              type="search" 
              name="search"
              placeholder="Search by member..." 
              class="w-full rounded-sm border border-stroke bg-whiten py-2 pl-10 pr-4 text-sm font-medium text-black focus:border-primary focus:outline-none xl:w-64"
              value={search}
              hx-get="/dashboard/savings"
              hx-trigger="keyup changed delay:500ms, search"
              hx-target="#savings-list-container"
              hx-swap="outerHTML"
              hx-indicator=".htmx-indicator"
              hx-include="[name='page']"
            />
            <input type="hidden" name="page" value="1" />
          </div>
        </div>
      </div>

      <div class="max-w-full overflow-x-auto min-h-[400px]">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-2 text-left">
              <th class="min-w-[220px] py-4 px-4 font-bold text-black text-sm uppercase">Member</th>
              <th class="min-w-[120px] py-4 px-4 font-bold text-black text-sm uppercase">Type</th>
              <th class="min-w-[150px] py-4 px-4 text-right font-bold text-black text-sm uppercase">Amount</th>
              <th class="py-4 px-4 font-bold text-black text-sm uppercase">Date</th>
              <th class="py-4 px-4 text-right font-bold text-black text-sm uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {savings.length === 0 ? (
              <tr>
                <td colspan="5" class="text-center py-10 text-body italic">
                  No savings records found.
                </td>
              </tr>
            ) : (
              savings.map((s) => (
                <tr key={s.id} class="border-b border-stroke hover:bg-whiten transition-colors">
                  <td class="py-5 px-4">
                    <h5 class="font-medium text-black">{s.memberName}</h5>
                    <p class="text-xs font-bold text-bodydark2 uppercase tracking-widest">ID: {s.id.substring(0,8)}</p>
                  </td>
                  <td class="py-5 px-4">
                    <Badge type={s.type === 'deposit' ? 'success' : 'error'}>
                       {s.type === 'deposit' ? <Icon icon={ArrowDownLeft} size={12} class="mr-1" /> : <Icon icon={ArrowUpRight} size={12} class="mr-1" />}
                       {s.type}
                    </Badge>
                  </td>
                  <td class="py-5 px-4 text-right">
                    <p class="text-sm font-bold text-black">{(s.amount || 0).toLocaleString()} <span class="text-xs text-body font-normal">UGX</span></p>
                  </td>
                  <td class="py-5 px-4 text-sm text-black">{s.date}</td>
                  <td class="py-5 px-4">
                    <div class="flex items-center justify-end space-x-3.5">
                      <TableAction 
                        icon={Eye}
                        href={`/dashboard/members/${s.memberId}`}
                        title="View Profile"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} search={search} />
    </div>
  );
}

export default function SavingsPage({ savings = [], page = 1, totalPages = 1, search = "", stats = {} }) {
  return (
    <DashboardLayout title="Savings">
       <PageHeader 
          title="Savings Accounts"
          subtitle="Manage member deposits and withdrawals."
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Savings', href: '/dashboard/savings', active: true }
          ]}
          actions={(
            <div class="flex items-center gap-2">
              <a 
                href="/dashboard/savings/new?type=deposit"
                class="inline-flex items-center gap-2 rounded-sm bg-success px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 shadow-default"
              >
                <Icon icon={Plus} size={18} />
                Deposit
              </a>
              <a 
                href="/dashboard/savings/new?type=withdrawal"
                class="inline-flex items-center gap-2 rounded-sm bg-error px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 shadow-default"
              >
                <Icon icon={Minus} size={18} />
                Withdraw
              </a>
            </div>
          )}
        />
       <div class="flex flex-col gap-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <StatsCard 
              label="Total Savings Balance" 
              value={(stats.totalBalance || 0).toLocaleString() + " UGX"} 
              icon={Wallet} 
              colorClass="text-primary" 
            />
            <StatsCard 
              label="Total Deposits" 
              value={(stats.totalDeposits || 0).toLocaleString() + " UGX"} 
              icon={TrendingUp} 
              colorClass="text-success" 
            />
            <StatsCard 
              label="Total Withdrawals" 
              value={(stats.totalWithdrawals || 0).toLocaleString() + " UGX"} 
              icon={ArrowUpRight} 
              colorClass="text-error" 
            />
          </div>

          <SavingsList savings={savings} page={page} totalPages={totalPages} search={search} />
       </div>
    </DashboardLayout>
  );
}
