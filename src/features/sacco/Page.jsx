import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Settings } from 'lucide';

export default function SettingsPage() {
  return (
    <DashboardLayout title="Settings">
       <div class="flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Settings</h1>
            <p class="text-slate-500">Configure SACCO settings and parameters.</p>
          </div>
        </div>

        <div class="card bg-base-100 border border-base-200 shadow-sm p-12 text-center text-slate-400">
           <p>Settings configuration coming soon.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
