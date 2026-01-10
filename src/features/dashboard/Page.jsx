import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Users, Banknote, PieChart, TrendingUp } from 'lucide';

export default function DashboardHome() {
  return (
    <DashboardLayout title="Overview">
      <div class="flex flex-col gap-8">
        <div>
           <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
           <p class="text-slate-500">Welcome back, Administrator.</p>
        </div>

        {/* Stats Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="stats shadow border border-base-200">
            <div class="stat">
              <div class="stat-figure text-primary">
                <Icon icon={Users} size={32} />
              </div>
              <div class="stat-title">Total Members</div>
              <div class="stat-value text-primary">1,204</div>
              <div class="stat-desc">↗︎ 12 (1%)</div>
            </div>
          </div>
          
          <div class="stats shadow border border-base-200">
            <div class="stat">
              <div class="stat-figure text-secondary">
                <Icon icon={Banknote} size={32} />
              </div>
              <div class="stat-title">Loans Active</div>
              <div class="stat-value text-secondary">85</div>
              <div class="stat-desc">↘︎ 2 (5%)</div>
            </div>
          </div>
          
          <div class="stats shadow border border-base-200">
             <div class="stat">
              <div class="stat-figure text-accent">
                <Icon icon={PieChart} size={32} />
              </div>
              <div class="stat-title">Share Capital</div>
              <div class="stat-value text-accent">2.4M</div>
              <div class="stat-desc">↗︎ 100k (4%)</div>
            </div>
          </div>

          <div class="stats shadow border border-base-200">
             <div class="stat">
              <div class="stat-figure text-info">
                <Icon icon={TrendingUp} size={32} />
              </div>
              <div class="stat-title">Monthly Revenue</div>
              <div class="stat-value text-info">45k</div>
              <div class="stat-desc">↗︎ 5k (12%)</div>
            </div>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div class="card bg-base-100 border border-base-200 shadow-sm">
          <div class="card-body">
             <h3 class="card-title text-lg">Recent Activity</h3>
             <div class="py-8 text-center text-slate-400">
               No recent activity to display.
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
