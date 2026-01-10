import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Plus } from 'lucide';

export default function PayrollPage() {
  return (
    <DashboardLayout title="Payroll">
       <div class="flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Payroll</h1>
            <p class="text-slate-500">Manage staff salaries and payments.</p>
          </div>
          <button class="btn btn-primary gap-2">
            <Icon icon={Plus} size={20} />
            Add Payroll Entry
          </button>
        </div>

        <div class="card bg-base-100 border border-base-200 shadow-sm p-12 text-center text-slate-400">
           <p>No payroll records found.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
