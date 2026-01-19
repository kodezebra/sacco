import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import ApexChart from '../../components/ApexChart.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import ActionCenter from '../../components/ActionCenter.jsx';
import Timeline from '../../components/Timeline.jsx';
import Badge from '../../components/Badge.jsx';
import { 
  Users, Banknote, PieChart, TrendingUp, 
  ArrowUpRight, History, LayoutDashboard, Wallet, 
  Briefcase, ArrowUp, ArrowDown, ShieldCheck
} from 'lucide';

const formatCompact = (val) => {
  if (!val) return '0';
  const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
  if (isNaN(num)) return val;
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toLocaleString();
};

export default function DashboardHome({ stats, recentActivity = [], sacco, trendData = [], currentUser }) {
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 18 ? 'Good Afternoon' : 'Good Evening';
  
  const profitRate = stats.thisMonthIncome > 0 
    ? Math.round((stats.thisMonthNet / stats.thisMonthIncome) * 100) 
    : 0;

    const trendChartOptions = {
      series: [
        { name: 'Income', data: trendData.map(d => d.income) },
        { name: 'Expense', data: trendData.map(d => d.expense) }
      ],
      chart: {
        type: 'bar',
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif'
      },
      colors: ['#3C50E0', '#10B981'], // Corporate Primary & Accent
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 2,
        }
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ['transparent'] },
      xaxis: {
        categories: trendData.map(d => d.month),
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      fill: { opacity: 1 },
      grid: {
        yaxis: { lines: { show: true } },
        xaxis: { lines: { show: false } },
        borderColor: '#E2E8F0'
      },
      tooltip: {
        y: { formatter: (val) => val.toLocaleString() + " UGX" }
      }
    };

  const liquidityOptions = {
    series: [Math.max(0, stats.totalAssets - stats.loanPortfolio), stats.loanPortfolio],
    chart: { type: 'donut', fontFamily: 'Inter, sans-serif' },
    labels: ['Available Cash', 'Active Loans'],
    colors: ['#3C50E0', '#10B981'],
    legend: { position: 'bottom', horizontalAlign: 'center' },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: { 
              show: true, 
              label: 'Total Assets', 
              fontSize: '12px',
              fontWeight: 600,
              formatter: () => formatCompact(stats.totalAssets) 
            }
          }
        }
      }
    },
    dataLabels: { enabled: false }
  };

  return (
    <DashboardLayout title="Analytics Dashboard">
      <div class="flex flex-col gap-6">
        
        {/* Welcome Section */}
        <div class="mb-2">
           <h3 class="text-2xl font-black text-black">{greeting}, {currentUser?.fullName || 'Administrator'}</h3>
           <p class="text-sm text-body font-medium mt-1">Here is what is happening with {sacco.name} today.</p>
        </div>

        {/* KPI Stats Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatsCard 
            label="Total Members" 
            value={stats?.totalMembers || 0} 
            icon={Users} 
            colorClass="text-primary" 
          />
          <StatsCard 
            label="Loan Portfolio" 
            value={formatCompact(stats?.loanPortfolio)} 
            icon={Banknote} 
            colorClass="text-secondary" 
          />
          <StatsCard 
            label="Total Assets" 
            value={formatCompact(stats?.totalAssets)} 
            icon={Wallet} 
            colorClass="text-accent" 
          />
          <StatsCard 
            label="Cash Position" 
            value={formatCompact(stats?.cashOnHand)} 
            icon={TrendingUp} 
            colorClass="text-primary" 
          />
        </div>

        {/* Charts Row */}
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Main Chart */}
          <div class="lg:col-span-8 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default sm:px-7.5">
            <div class="mb-4 justify-between gap-4 sm:flex">
              <div>
                <h4 class="text-xl font-bold text-black">Revenue Analytics</h4>
              </div>
              <div class="flex items-center gap-3">
                 <Badge type="success">Profit Margin: {profitRate}%</Badge>
              </div>
            </div>
            <div>
              <div id="chartOne" class="-ml-5">
                <ApexChart id="global-trend-chart" options={trendChartOptions} height={350} />
              </div>
            </div>
          </div>

          {/* Donut Chart */}
          <div class="lg:col-span-4 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default sm:px-7.5">
            <div class="mb-3 justify-between gap-4 sm:flex">
              <h4 class="text-xl font-bold text-black">Asset Allocation</h4>
            </div>
            <div class="mb-2">
              <div id="chartTwo" class="flex items-center justify-center">
                <ApexChart id="liquidity-chart" options={liquidityOptions} height={340} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
           <div class="lg:col-span-7 rounded-sm border border-stroke bg-white shadow-default">
              <div class="px-6 py-6 border-b border-stroke flex justify-between items-center">
                 <h3 class="font-bold text-black text-lg">Recent Transactions</h3>
                 <a href="/dashboard/transactions" class="text-sm font-medium text-primary hover:underline">View All</a>
              </div>
              <Timeline items={recentActivity} />
           </div>

           <div class="lg:col-span-5 flex flex-col gap-6">
              <div class="rounded-sm border border-stroke bg-white p-6 shadow-default">
                <h3 class="font-bold text-black mb-4">Quick Actions</h3>
                <ActionCenter />
              </div>

              <div class="rounded-sm border border-stroke bg-white p-6 shadow-default flex-grow">
                 <h3 class="font-bold text-black mb-4">System Status</h3>
                 <div class="space-y-4">
                    <div class="flex items-center justify-between">
                       <span class="text-sm text-body">Database</span>
                       <Badge type="success">Online</Badge>
                    </div>
                    <div class="flex items-center justify-between">
                       <span class="text-sm text-body">Authentication</span>
                       <Badge type="success">Active</Badge>
                    </div>
                    <div class="flex items-center justify-between">
                       <span class="text-sm text-body">Backups</span>
                       <Badge type="info">Daily</Badge>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
}