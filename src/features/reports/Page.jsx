import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { 
  FileText, TrendingUp, Users, Banknote, 
  Building2, Calendar, Download, PieChart 
} from 'lucide';

export default function ReportsPage() {
  const reportGroups = [
    {
      title: "Financial Reports",
      description: "Income, expenses, and balance sheets.",
      icon: TrendingUp,
      color: "text-primary",
      reports: [
        { name: "Income Statement (P&L)", url: "/reports/income" },
        { name: "Balance Sheet", url: "/reports/balance-sheet" },
        { name: "Cash Flow Statement", url: "/reports/cash-flow" },
      ]
    },
    {
      title: "Loan Portfolio",
      description: "Loan performance and risk analysis.",
      icon: Banknote,
      color: "text-secondary",
      reports: [
        { name: "Active Loans Portfolio", url: "/reports/loans-active" },
        { name: "Defaulters List (PAR)", url: "/reports/loans-risk" },
        { name: "Interest Earnings", url: "/reports/loans-interest" },
      ]
    },
    {
      title: "Member Reports",
      description: "Membership stats and individual statements.",
      icon: Users,
      color: "text-accent",
      reports: [
        { name: "Share Capital Registry", url: "/reports/shares" },
        { name: "Member Statements", url: "/reports/member-statements" },
        { name: "New Registrations", url: "/reports/member-growth" },
      ]
    },
    {
      title: "Associations",
      description: "Project performance and payroll.",
      icon: Building2,
      color: "text-info",
      reports: [
        { name: "Project Profitability", url: "/reports/project-performance" },
        { name: "Payroll Summary", url: "/reports/payroll" },
        { name: "Expense Breakdown", url: "/reports/expenses" },
      ]
    }
  ];

  return (
    <DashboardLayout title="Reports">
      <div class="flex flex-col gap-8">
        <div>
           <h1 class="text-3xl font-bold tracking-tight">Reports Center</h1>
           <p class="text-slate-500">Generate and export financial and operational reports.</p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
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
    </DashboardLayout>
  );
}
