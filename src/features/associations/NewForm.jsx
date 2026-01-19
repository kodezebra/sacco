import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Layers, X, Calendar, Info, ArrowLeft, Check } from 'lucide';

export default function NewAssociationPage({ errors = {}, values = {} }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <DashboardLayout title="Create Business Unit">
      <div class="mx-auto max-w-270">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-title-md2 font-bold text-black uppercase tracking-tight">New Business Unit</h2>
          <nav>
            <ol class="flex items-center gap-2">
              <li><a class="font-medium" href="/dashboard/associations">Units /</a></li>
              <li class="font-medium text-primary">Create</li>
            </ol>
          </nav>
        </div>

        <div class="grid grid-cols-1 gap-9 lg:grid-cols-5">
          <div class="lg:col-span-3">
            <div class="rounded-sm border border-stroke bg-white shadow-default">
              <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50">
                <h3 class="font-bold text-black flex items-center gap-2 text-sm uppercase">
                   <Icon icon={Layers} size={18} />
                   Unit Configuration
                </h3>
              </div>

              <form action="/dashboard/associations" method="POST" class="p-6.5">
                {errors.general && (
                  <div class="p-4 mb-6 bg-error/10 text-error text-sm rounded-sm border border-error/20 font-bold">
                    {errors.general}
                  </div>
                )}

                <div class="mb-6">
                    <label class="mb-3 block text-black font-medium text-sm uppercase tracking-wide">Unit Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      defaultValue={values.name}
                      placeholder="e.g. Poultry Farm, Logistics Dept" 
                      class={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black ${errors.name ? 'border-error focus:border-error' : 'border-stroke'}`}
                      required 
                      autofocus
                    />
                    {errors.name && <p class="text-error text-xs mt-1 font-bold italic">{errors.name}</p>}
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label class="mb-3 block text-black font-medium text-sm uppercase tracking-wide">Category</label>
                    <div class="relative z-20 bg-transparent">
                      <select 
                        name="type" 
                        defaultValue={values.type || 'project'}
                        class={`relative z-20 w-full appearance-none rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black ${errors.type ? 'border-error focus:border-error' : 'border-stroke'}`}
                      >
                        <option value="project">Business/Investment Unit</option>
                        <option value="department">Administrative (Sacco HQ)</option>
                      </select>
                      <span class="absolute top-1/2 right-4 z-30 -translate-y-1/2 text-body">
                        <Icon icon={Layers} size={18} />
                      </span>
                    </div>
                    {errors.type && <p class="text-error text-xs mt-1 font-bold italic">{errors.type}</p>}
                  </div>

                  <div>
                      <label class="mb-3 block text-black font-medium text-sm uppercase tracking-wide">Registration Date</label>
                      <input 
                          type="date" 
                          name="createdAt" 
                          defaultValue={values.createdAt || today} 
                          class={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black ${errors.createdAt ? 'border-error focus:border-error' : 'border-stroke'}`}
                          required
                      />
                      {errors.createdAt && <p class="text-error text-xs mt-1 font-bold italic">{errors.createdAt}</p>}
                  </div>
                </div>

                <div class="flex justify-end gap-4 border-t border-stroke pt-6">
                  <a href="/dashboard/associations" class="flex justify-center rounded border border-stroke py-3 px-8 font-medium text-black hover:shadow-1 transition">
                      Cancel
                  </a>
                  <button type="submit" class="flex justify-center rounded bg-primary py-3 px-10 font-bold text-white hover:bg-opacity-90 shadow-default uppercase tracking-widest flex items-center gap-2">
                    <Icon icon={Check} size={18} />
                    Create Unit
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="lg:col-span-2">
             <div class="rounded-sm border border-stroke bg-white shadow-default">
                <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50">
                    <h3 class="font-bold text-black text-sm uppercase tracking-widest">About Units</h3>
                </div>
                <div class="p-6.5">
                    <div class="flex gap-3 mb-6">
                        <div class="text-primary mt-1"><Icon icon={Info} size={20} /></div>
                        <div>
                            <h4 class="font-bold text-black text-sm uppercase tracking-wide">Independent Tracking</h4>
                            <p class="text-xs text-body mt-1 leading-relaxed">
                                Business units operate with their own income and expense ledgers. This allows the SACCO to monitor performance per project.
                            </p>
                        </div>
                    </div>
                    
                    <div class="bg-primary/5 p-4 rounded-sm border-l-4 border-primary">
                        <p class="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">PRO TIP</p>
                        <p class="text-xs text-black font-medium leading-relaxed">
                            Use "Administrative" for departments that don't generate direct revenue, like HR or HQ.
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