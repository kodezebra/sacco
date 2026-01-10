import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Plus } from 'lucide';

export default function LoansPage() {
  return (
    <DashboardLayout title="Loans">
       <div class="flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Loans</h1>
            <p class="text-slate-500">Manage member loans and repayment schedules.</p>
          </div>
          <button class="btn btn-primary gap-2">
            <Icon icon={Plus} size={20} />
            Add Loan
          </button>
        </div>

        <div class="card bg-base-100 border border-base-200 shadow-sm p-12 text-center text-slate-400">
           <p>No loans found. Create one to get started.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
