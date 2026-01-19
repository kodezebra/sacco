import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import JournalForm from './JournalForm.jsx';
import Icon from '../../components/Icon.jsx';
import { ArrowLeft } from 'lucide';

export default function JournalPage({ associationId, associationName }) {
  return (
    <DashboardLayout title="Transaction Journal">
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-4 mb-2">
            <a href={`/dashboard/associations/${associationId}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:bg-opacity-90 shadow-default transition-all">
                <Icon icon={ArrowLeft} size={20} />
            </a>
            <div>
              <h2 className="text-title-md font-bold text-black uppercase tracking-tight">Transaction Journal</h2>
              <p className="text-body text-sm font-medium opacity-70">Project: {associationName}</p>
            </div>
        </div>

        <div class="w-full">
            <JournalForm associationId={associationId} isModal={false} />
        </div>
      </div>
    </DashboardLayout>
  );
}
