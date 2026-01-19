import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import {
  TrendingUp, Users, Banknote, 
  Download, Search, Layers, ArrowRight, FileText
} from 'lucide';

export function MemberSearchList({ members = [] }) {
  if (members.length === 0) {
    return (
      <div class="p-8 text-center text-xs text-body italic">
        No members found.
      </div>
    );
  }

  return (
    <div class="flex flex-col">
      {members.map(m => (
        <a 
          href={`/dashboard/reports/member-statement/${m.id}`} 
          class="flex items-center justify-between p-4 hover:bg-whiten transition-colors border-b border-stroke last:border-none group"
        >
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-body">
              {m.fullName.charAt(0)}
            </div>
            <div>
              <p class="text-sm font-bold text-black group-hover:text-primary transition-colors">{m.fullName}</p>
              <p class="text-[10px] font-medium text-body uppercase">{m.memberNumber}</p>
            </div>
          </div>
          <Icon icon={ArrowRight} size={14} class="text-slate-300 group-hover:text-primary transition-colors" />
        </a>
      ))}
    </div>
  );
}

export default function ReportsPage({ searchedMembers = [], search = "", associations = [] }) {
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
    },
    {
      title: "Business Units",
      description: "Performance reports per unit.",
      icon: Layers,
      color: "bg-warning",
      reports: associations.map(a => ({
        name: `${a.name} Report`,
        url: `/dashboard/reports/projects/${a.id}`
      }))
    }
  ];

  return (
    <DashboardLayout title="Reports Center">
      <PageHeader 
        title="Reports Center" 
        subtitle="Financial statements and operational reports."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reports', href: '/dashboard/reports', active: true }
        ]}
      />
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
                        {group.reports.length === 0 ? (
                          <li class="text-xs text-body italic py-2">No units configured.</li>
                        ) : group.reports.map((report, rIdx) => (
                          <li key={rIdx}>
                            <a href={report.url} class="flex justify-between items-center group py-2.5 hover:bg-whiten px-2 rounded-sm transition-all">
                              <span class="text-sm font-medium text-black group-hover:text-primary transition-colors">
                                {report.name}
                              </span>
                              <Icon icon={ArrowRight} size={16} class="text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
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
                <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50">
                  <h3 class="font-bold text-black flex items-center gap-2 text-sm uppercase tracking-widest">
                    <Icon icon={FileText} size={18} class="text-primary" />
                    Member Statement
                  </h3>
                </div>
                
                <div class="p-6.5">
                  <div class="relative">
                    <input 
                      type="search" 
                      name="search"
                      placeholder="Search member name..." 
                      class="w-full rounded border-[1.5px] border-stroke bg-slate-50 py-3 px-5 pl-11 font-medium outline-none transition focus:border-primary active:border-primary text-black"
                      hx-get="/dashboard/reports"
                      hx-trigger="keyup changed delay:300ms, search"
                      hx-target="#report-member-search-results"
                      hx-swap="innerHTML"
                    />
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-body">
                        <Icon icon={Search} size={18} />
                    </span>
                  </div>

                  <div id="report-member-search-results" class="mt-4 border border-stroke rounded-sm overflow-hidden min-h-[100px]">
                    {search ? (
                      <MemberSearchList members={searchedMembers} />
                    ) : (
                      <div class="p-12 text-center text-xs text-body font-medium italic opacity-50 flex flex-col items-center gap-3">
                        <Icon icon={Users} size={32} class="opacity-20" />
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
