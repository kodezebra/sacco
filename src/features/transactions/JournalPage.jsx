import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import JournalForm from './JournalForm.jsx';
import Icon from '../../components/Icon.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { ArrowLeft } from 'lucide';

export default function JournalPage({ associationId, associationName }) {
  return (
    <DashboardLayout title="Transaction Journal">
      <div class="flex flex-col gap-6">
        <PageHeader 
          title="Transaction Journal"
          subtitle={`Project: ${associationName}`}
          backHref={`/dashboard/associations/${associationId}`}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Projects', href: '/dashboard/associations' },
            { label: associationName, href: `/dashboard/associations/${associationId}` },
            { label: 'Journal', href: `/dashboard/associations/${associationId}/journal`, active: true }
          ]}
        />

        <div class="w-full">
            <JournalForm associationId={associationId} isModal={false} />
        </div>
      </div>
    </DashboardLayout>
  );
}
