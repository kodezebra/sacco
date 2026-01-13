import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { 
  TrendingUp, Users, Banknote, 
  Download, Search
} from 'lucide';

export function MemberSearchList({ members = [] }) {
  if (members.length === 0) {
    return <div class="p-4 text-center text-sm text-body">No members found.</div>;
  }

  return (
    <ul class="flex flex-col">
      {members.map((m) => (
        <li key={m.id} class="border-b border-stroke last:border-0 hover:bg-whiten">
          <a href={`/dashboard/reports/member-statement/${m.id}`} class="flex justify-between items-center py-3 px-4">
            <div>
              <div class="font-bold text-black text-sm">{m.fullName}</div>
              <div class="text-[10px] text-body">{m.memberNumber}</div>
            </div>
            <button class="text-xs font-bold text-primary hover:underline">Statement</button>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function ReportsPage({ searchedMembers = [], search = "" }) {
  const reportGroups = [
    {
      title: "Financial Reports",
      description: "Income, expenses, and cash flow.",
      icon: TrendingUp,
      color: "bg-primary",
      reports: [
        { name: "Cash Flow Statement", url: "/dashboard/reports/cash-flow" },
      ]
    },
    {
      title: "Loan Portfolio",
      description: "Loan performance and risk analysis.",
      icon: Banknote,
      color: "bg-secondary",
      reports: [
        { name: "Active Loans Portfolio", url: "/dashboard/reports/loans-active" },
      ]
    }
  ];

  return (
    <DashboardLayout title="Reports Center">
      <div class="flex flex-col gap-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left Column: Standard Reports */}
          <div class="lg:col-span-8 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {reportGroups.map((group, idx) => (
                <div key={idx} class="rounded-sm border border-stroke bg-white shadow-default">
                  <div class="p-6">
                    <div class="flex items-center gap-3 mb-4">
                      <div class={`h-12 w-12 rounded-sm flex items-center justify-center ${group.color} text-white`}>
                        <Icon icon={group.icon} size={24} />
                      </div>
                      <div>
                        <h3 class="font-bold text-black">{group.title}</h3>
                        <p class="text-[10px] text-body uppercase font-bold tracking-widest">{group.description}</p>
                      </div>
                    </div>

                    <div class="border-t border-stroke pt-4">
                      <ul class="flex flex-col gap-2">
                        {group.reports.map((report, rIdx) => (
                          <li key={rIdx}>
                            <a href={report.url} class="flex justify-between items-center group py-2 hover:bg-whiten px-2 rounded-sm">
                              <span class="text-sm font-medium text-black group-hover:text-primary transition-colors">
                                {report.name}
                              </span>
                              <Icon icon={Download} size={16} class="text-body opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Member Quick Search */}
          <div class="lg:col-span-4">
            <div class="rounded-sm border border-stroke bg-white shadow-default sticky top-24">
                <div class="border-b border-stroke py-4 px-6.5">
                  <h3 class="font-bold text-black flex items-center gap-2">
                    <Icon icon={Users} size={18} class="text-primary" />
                    Member Statement
                  </h3>
                </div>
                
                <div class="p-6.5">
                  <div class="relative">
                    <input 
                      type="search" 
                      name="search"
                      placeholder="Search member name..." 
                      class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-11 font-medium outline-none transition focus:border-primary active:border-primary text-black"
                      hx-get="/dashboard/reports"
                      hx-trigger="keyup changed delay:300ms, search"
                      hx-target="#report-member-search-results"
                      hx-swap="innerHTML"
                    />
                    <span class="absolute left-4 top-3.5 text-body">
                        <Icon icon={Search} size={18} />
                    </span>
                  </div>

                  <div id="report-member-search-results" class="mt-4 border border-stroke rounded-sm overflow-hidden min-h-[100px]">
                    {search ? (
                      <MemberSearchList members={searchedMembers} />
                    ) : (
                      <div class="p-8 text-center text-xs text-body italic">
                        Type above to find members...
                      </div>
                    )}
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
