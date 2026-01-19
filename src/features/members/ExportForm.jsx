import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Download, Calendar, ArrowLeft, FileText, Info } from 'lucide';

export default function MemberExportPage() {
  const today = new Date().toISOString().split('T')[0];
  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  return (
    <DashboardLayout title="Export Members">
      <div class="mx-auto max-w-270">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-title-md2 font-bold text-black uppercase tracking-tight">Directory Export</h2>
          <nav>
            <ol class="flex items-center gap-2">
              <li><a class="font-medium" href="/dashboard/members">Directory /</a></li>
              <li class="font-medium text-primary">Export</li>
            </ol>
          </nav>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-9">
          <div class="lg:col-span-3">
            <div class="rounded-sm border border-stroke bg-white shadow-default">
              <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50">
                <h3 class="font-bold text-black flex items-center gap-2 text-sm uppercase">
                   <Icon icon={FileText} size={18} />
                   Filter & Download
                </h3>
              </div>

              <form action="/dashboard/members/export" method="GET" class="p-6.5">
                
                {/* Quick Selection Helpers */}
                <div class="mb-6 flex flex-wrap gap-2">
                    <button type="button" onclick="setDateRange('today')" class="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border border-stroke rounded-sm hover:bg-slate-100 transition-colors">Today</button>
                    <button type="button" onclick="setDateRange('week')" class="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border border-stroke rounded-sm hover:bg-slate-100 transition-colors">This Week</button>
                    <button type="button" onclick="setDateRange('month')" class="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border border-stroke rounded-sm hover:bg-slate-100 transition-colors">This Month</button>
                    <button type="button" onclick="setDateRange('lastMonth')" class="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border border-stroke rounded-sm hover:bg-slate-100 transition-colors">Last Month</button>
                    <button type="button" onclick="setDateRange('year')" class="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border border-stroke rounded-sm hover:bg-slate-100 transition-colors">This Year</button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label class="mb-3 block text-black font-medium text-sm uppercase tracking-wide">Start Date</label>
                    <div class="relative">
                        <input 
                          type="date" 
                          id="startDate"
                          name="startDate" 
                          defaultValue={firstDay}
                          class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black" 
                          required 
                        />
                    </div>
                  </div>

                  <div>
                    <label class="mb-3 block text-black font-medium text-sm uppercase tracking-wide">End Date</label>
                    <div class="relative">
                        <input 
                          type="date" 
                          id="endDate"
                          name="endDate" 
                          defaultValue={today}
                          class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black" 
                          required 
                        />
                    </div>
                  </div>
                </div>

                <script dangerouslySetInnerHTML={{ __html: `
                    function setDateRange(range) {
                        const startInput = document.getElementById('startDate');
                        const endInput = document.getElementById('endDate');
                        const now = new Date();
                        const todayStr = now.toISOString().split('T')[0];
                        
                        let startStr = todayStr;
                        let endStr = todayStr;

                        switch(range) {
                            case 'today':
                                break;
                            case 'week':
                                const first = now.getDate() - now.getDay();
                                const firstday = new Date(now.setDate(first));
                                startStr = firstday.toISOString().split('T')[0];
                                break;
                            case 'month':
                                startStr = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                                break;
                            case 'lastMonth':
                                startStr = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
                                endStr = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
                                break;
                            case 'year':
                                startStr = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
                                break;
                        }

                        startInput.value = startStr;
                        endInput.value = endStr;
                    }
                ` }} />

                <div class="flex justify-end gap-4 border-t border-stroke pt-6">
                  <a href="/dashboard/members" class="flex justify-center rounded border border-stroke py-3 px-8 font-medium text-black hover:shadow-1 transition">
                      Cancel
                  </a>
                  <button type="submit" class="flex justify-center rounded bg-primary py-3 px-10 font-bold text-white hover:bg-opacity-90 shadow-default uppercase tracking-widest flex items-center gap-2">
                    <Icon icon={Download} size={18} />
                    Download CSV
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="lg:col-span-2">
             <div class="rounded-sm border border-stroke bg-white shadow-default">
                <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50">
                    <h3 class="font-bold text-black text-sm uppercase tracking-widest">Export Guide</h3>
                </div>
                <div class="p-6.5">
                    <div class="flex gap-3 mb-6">
                        <div class="text-primary mt-1"><Icon icon={Info} size={20} /></div>
                        <div>
                            <h4 class="font-bold text-black text-sm uppercase tracking-wide">Data Fields</h4>
                            <p class="text-xs text-body mt-1 leading-relaxed">
                                The export includes all personal information, contact details, status, and registration dates for selected members.
                            </p>
                        </div>
                    </div>
                    
                    <div class="bg-primary/5 p-4 rounded-sm border-l-4 border-primary">
                        <p class="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Large Datasets</p>
                        <p class="text-xs text-black font-medium leading-relaxed">
                            For registries with thousands of members, please use monthly ranges to keep file sizes manageable.
                        </p>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}