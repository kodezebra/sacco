import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { 
  FileText, TrendingUp, Users, Banknote, 
  Building2, Calendar, Download, PieChart, Search
} from 'lucide';

export function MemberSearchList({ members = [] }) {
  if (members.length === 0) {
    return <div class="p-4 text-center text-sm text-slate-400">No members found.</div>;
  }

  return (
    <ul class="menu bg-base-100 w-full p-0">
      {members.map(m => (
        <li key={m.id} class="border-b border-base-200 last:border-0">
          <a href={`/dashboard/reports/member-statement/${m.id}`} class="flex justify-between items-center py-3">
            <div>
              <div class="font-bold">{m.fullName}</div>
              <div class="text-xs opacity-50">{m.memberNumber}</div>
            </div>
            <button class="btn btn-xs btn-primary">Statement</button>
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
      color: "text-primary",
      reports: [
        { name: "Cash Flow Statement", url: "/dashboard/reports/cash-flow" },
      ]
    },
    {
      title: "Loan Portfolio",
      description: "Loan performance and risk analysis.",
      icon: Banknote,
      color: "text-secondary",
      reports: [
        { name: "Active Loans Portfolio", url: "/dashboard/reports/loans-active" },
      ]
    }
  ];

  return (
    <DashboardLayout title="Reports">
      <div class="flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Reports Center</h1>
            <p class="text-slate-500">Generate and export financial and operational reports.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Standard Reports */}
          <div class="space-y-6">
            <div class="grid grid-cols-1 gap-6">
              {reportGroups.map((group, idx) => (
                <div key={idx} class="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
                  <div class="card-body">
                    <div class="flex items-center gap-3 mb-4">
                      <div class={`p-3 rounded-lg bg-base-200 ${group.color}`}>
                        <Icon icon={group.icon} size={24} />
                      </div>
                      <div>
                        <h2 class="card-title text-lg">{group.title}</h2>
                        <p class="text-xs text-slate-500">{group.description}</p>
                      </div>
                    </div>

                    <div class="divider my-0"></div>

                    <ul class="menu w-full p-0">
                      {group.reports.map((report, rIdx) => (
                        <li key={rIdx}>
                          <a href={report.url} class="flex justify-between items-center group">
                            <span class="text-slate-700 group-hover:text-primary transition-colors">
                              {report.name}
                            </span>
                            <Icon icon={Download} size={16} class="opacity-0 group-hover:opacity-50 transition-opacity" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Member Quick Search */}
          <div>
            <div class="card bg-base-100 border border-base-200 shadow-sm sticky top-24">
              <div class="card-body p-0">
                <div class="p-4 border-b border-base-200">
                  <h3 class="font-bold flex items-center gap-2">
                    <Icon icon={Users} size={18} class="text-accent" />
                    Member Statement
                  </h3>
                  <p class="text-xs text-slate-500 mt-1">Search for a member to generate their full statement.</p>
                </div>
                
                <div class="p-4">
                  <label class="input input-sm w-full">
                    <Icon icon={Search} size={14} class="opacity-50" />
                    <input 
                      type="search" 
                      name="search"
                      placeholder="Search member name..." 
                      hx-get="/dashboard/reports"
                      hx-trigger="keyup changed delay:300ms, search"
                      hx-target="#report-member-search-results"
                      hx-swap="innerHTML"
                    />
                  </label>
                </div>

                <div id="report-member-search-results" class="min-h-[100px]">
                  {search ? (
                    <MemberSearchList members={searchedMembers} />
                  ) : (
                    <div class="p-8 text-center text-xs text-slate-400 italic">
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
