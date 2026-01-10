import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Plus } from 'lucide';

export default function FleetsPage() {
  return (
    <DashboardLayout title="Fleets">
       <div class="flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Fleets</h1>
            <p class="text-slate-500">Manage vehicle fleets and assignments.</p>
          </div>
          <button class="btn btn-primary gap-2">
            <Icon icon={Plus} size={20} />
            Add Vehicle
          </button>
        </div>

        <div class="card bg-base-100 border border-base-200 shadow-sm p-12 text-center text-slate-400">
           <p>No vehicles found.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
