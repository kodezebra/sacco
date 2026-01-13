import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import { Plus, Users, TrendingUp, TrendingDown, ArrowRight, Layers } from 'lucide';

export default function AssociationsPage({ associations = [] }) {
  return (
    <DashboardLayout title="Associations">
       <div class="flex flex-col gap-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Business Units</h1>
            <p class="text-slate-500">Manage projects, branches, and strategic associations.</p>
          </div>
          <button 
            class="btn btn-primary gap-2"
            hx-get="/dashboard/associations/new"
            hx-target="#htmx-modal-content"
            hx-swap="innerHTML"
            onClick="document.getElementById('htmx-modal').showModal()"
          >
            <Icon icon={Plus} size={20} />
            New
          </button>
        </div>

        {associations.length === 0 ? (
          <div class="card bg-base-100 border border-base-200 shadow-sm p-12 text-center text-slate-400">
             <div class="flex justify-center mb-4 opacity-20">
                <Icon icon={Layers} size={64} />
             </div>
             <p>No business units found. Create one to start tracking performance.</p>
          </div>
        ) : (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {associations.map(assoc => {
              const netProfit = assoc.income - assoc.expense;
              const isProfitable = netProfit >= 0;
              
              return (
                <div key={assoc.id} class="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
                  <div class="card-body">
                    <div class="flex justify-between items-start mb-2">
                      <Badge type="ghost">{assoc.type}</Badge>
                      <Badge type={assoc.status === 'active' ? 'success' : 'ghost'}>
                        {assoc.status}
                      </Badge>
                    </div>
                    
                    <h2 class="card-title text-xl mb-4">{assoc.name}</h2>
                    
                    <div class="grid grid-cols-2 gap-4 mb-6">
                      <div class="flex flex-col">
                        <span class="text-xs text-slate-400 uppercase font-semibold">Staff</span>
                        <div class="flex items-center gap-2 mt-1">
                          <Icon icon={Users} size={16} class="text-slate-400" />
                          <span class="font-bold">{assoc.staffCount}</span>
                        </div>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-xs text-slate-400 uppercase font-semibold">Performance</span>
                        <div class={`flex items-center gap-2 mt-1 font-bold ${isProfitable ? 'text-success' : 'text-error'}`}>
                          <Icon icon={isProfitable ? TrendingUp : TrendingDown} size={16} />
                          <span>{isProfitable ? '+' : ''}{(netProfit / 1000).toFixed(1)}k</span>
                        </div>
                      </div>
                    </div>

                    <div class="card-actions justify-end pt-4 border-t border-base-100">
                      <a href={`/dashboard/associations/${assoc.id}`} class="btn btn-ghost btn-sm gap-2">
                        View Details
                        <Icon icon={ArrowRight} size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}