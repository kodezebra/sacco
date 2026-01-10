import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Plus } from 'lucide';

export default function SharesPage() {
  return (
    <DashboardLayout title="Shares">
       <div class="flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Shares</h1>
            <p class="text-slate-500">Manage member share capital and dividends.</p>
          </div>
          <button class="btn btn-primary gap-2">
            <Icon icon={Plus} size={20} />
            Buy Shares
          </button>
        </div>

        <div class="card bg-base-100 border border-base-200 shadow-sm p-12 text-center text-slate-400">
           <p>No share records found.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
