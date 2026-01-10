import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { ArrowLeft, Phone, Mail } from 'lucide';

export default function MemberDetailPage({ member }) {
  if (!member) {
    return (
      <DashboardLayout title="Member Not Found">
        <div class="text-center py-20">
          <h2 class="text-2xl font-bold">Member not found</h2>
          <a href="/dashboard/members" class="btn btn-ghost mt-4">Back to list</a>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`${member.fullName} | Profile`}>
      <div class="flex flex-col gap-8">
        <div class="flex items-center gap-4">
          <a href="/dashboard/members" class="btn btn-ghost btn-circle">
            <Icon icon={ArrowLeft} size={24} />
          </a>
          <div>
            <h1 class="text-3xl font-bold tracking-tight">{member.fullName}</h1>
            <p class="text-slate-500">{member.memberNumber} • Joined {member.createdAt}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-1 space-y-6">
            <div class="card bg-base-100 border border-base-200 shadow-sm">
              <div class="card-body">
                <h3 class="font-bold text-lg mb-4">Contact Information</h3>
                <div class="space-y-4">
                  <div class="flex items-center gap-3">
                    <Icon icon={Phone} size={18} class="text-slate-400" />
                    <span>{member.phone || 'No phone'}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <Icon icon={Mail} size={18} class="text-slate-400" />
                    <span>{member.email || 'No email'}</span>
                  </div>
                </div>
                <div class="divider"></div>
                <button class="btn btn-outline btn-sm w-full">Edit Profile</button>
              </div>
            </div>
          </div>

          <div class="lg:col-span-2 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="stats shadow border border-base-200">
                <div class="stat">
                  <div class="stat-title">Total Shares</div>
                  <div class="stat-value text-primary">0</div>
                </div>
              </div>
              <div class="stats shadow border border-base-200">
                <div class="stat">
                  <div class="stat-title">Loan Balance</div>
                  <div class="stat-value text-secondary">0</div>
                </div>
              </div>
            </div>
            
            <div class="card bg-base-100 border border-base-200 shadow-sm">
              <div class="card-body">
                <h3 class="font-bold text-lg">Recent Activity</h3>
                <div class="py-4 text-center text-slate-400 italic">
                  No recent activity recorded
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}