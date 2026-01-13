import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import { Plus, Users, TrendingUp, TrendingDown, ArrowRight, Layers } from 'lucide';

export default function AssociationsPage({ associations = [] }) {
  return (
    <DashboardLayout title="Business Units">
       <div class="flex flex-col gap-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 class="text-title-md font-bold text-black">Projects & Associations</h2>
          </div>
          <button 
            class="inline-flex items-center justify-center gap-2.5 rounded-sm bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 shadow-default"
            hx-get="/dashboard/associations/new"
            hx-target="#htmx-modal-content"
            hx-swap="innerHTML"
            onClick="document.getElementById('htmx-modal').showModal()"
          >
            <Icon icon={Plus} size={20} />
            Add Unit
          </button>
        </div>

        {associations.length === 0 ? (
          <div class="rounded-sm border border-stroke bg-white shadow-default p-12 text-center">
             <div class="flex justify-center mb-4 opacity-20">
                <Icon icon={Layers} size={64} />
             </div>
             <p class="text-body">No business units found. Create one to start tracking performance.</p>
          </div>
        ) : (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {associations.map((assoc) => {
              const netProfit = assoc.income - assoc.expense;
              const isProfitable = netProfit >= 0;
              
              return (
                <div key={assoc.id} class="rounded-sm border border-stroke bg-white shadow-default hover:shadow-md transition-all">
                  <div class="p-6">
                    <div class="flex justify-between items-start mb-4">
                      <Badge type="ghost">{assoc.type}</Badge>
                      <Badge type={assoc.status === 'active' ? 'success' : 'ghost'}>
                        {assoc.status}
                      </Badge>
                    </div>
                    
                    <h3 class="text-xl font-bold text-black mb-4">{assoc.name}</h3>
                    
                    <div class="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-stroke">
                      <div class="flex flex-col">
                        <span class="text-[10px] text-bodydark2 uppercase font-bold tracking-widest">Staff</span>
                        <div class="flex items-center gap-2 mt-1">
                          <Icon icon={Users} size={16} class="text-body" />
                          <span class="font-bold text-black">{assoc.staffCount}</span>
                        </div>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-[10px] text-bodydark2 uppercase font-bold tracking-widest">Performance</span>
                        <div class={`flex items-center gap-2 mt-1 font-bold ${isProfitable ? 'text-success' : 'text-error'}`}>
                          <Icon icon={isProfitable ? TrendingUp : TrendingDown} size={16} />
                          <span>{isProfitable ? '+' : ''}{(netProfit / 1000).toFixed(1)}k</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex justify-end">
                      <a href={`/dashboard/associations/${assoc.id}`} class="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
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