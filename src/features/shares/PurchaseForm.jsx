import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { ArrowLeft, Check, Search, User } from 'lucide';

export default function SharePurchasePage({ members = [], sharePrice = 20000 }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <DashboardLayout title="New Share Purchase">
      <div class="mx-auto max-w-270">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-title-md2 font-bold text-black">Record Purchase</h2>
          <nav>
            <ol class="flex items-center gap-2">
              <li><a class="font-medium" href="/dashboard/shares">Shares /</a></li>
              <li class="font-medium text-primary">New Purchase</li>
            </ol>
          </nav>
        </div>

        <div class="grid grid-cols-1 gap-9 lg:grid-cols-5">
          <div class="flex flex-col gap-9 lg:col-span-3">
            {/* Purchase Form */}
            <div class="rounded-sm border border-stroke bg-white shadow-default">
              <div class="border-b border-stroke py-4 px-6.5">
                <h3 class="font-medium text-black">Purchase Details</h3>
              </div>
              
              <form 
                hx-post="/dashboard/shares" 
                hx-push-url="true"
                hx-target="body"
                class="p-6.5"
              >
                
                <div class="mb-4.5">
                  <label class="mb-2.5 block text-black font-medium">Select Member</label>
                  
                  {/* Searchable Select Wrapper */}
                  <div class="relative z-20 bg-transparent rounded border border-stroke focus-within:border-primary p-1">
                      <div class="flex items-center px-3 border-b border-stroke mb-1">
                          <Icon icon={Search} size={18} class="text-body mr-2" />
                          <input 
                            type="text" 
                            id="member-search"
                            placeholder="Type to filter members..."
                            class="w-full bg-transparent py-2 text-sm outline-none text-black"
                            onkeyup="
                                const filter = this.value.toLowerCase();
                                const options = document.querySelectorAll('#member-select option');
                                options.forEach(opt => {
                                    if(opt.value === '') return;
                                    const text = opt.text.toLowerCase();
                                    opt.style.display = text.includes(filter) ? '' : 'none';
                                });
                                // Auto-select first visible if current is hidden? No, native behavior is fine.
                            "
                          />
                      </div>
                      <select 
                        name="memberId" 
                        id="member-select"
                        size="5" // Show multiple lines
                        class="relative z-20 w-full appearance-none bg-transparent py-2 px-3 outline-none transition text-black text-sm h-[150px]"
                        required
                      >
                        {members.map(m => (
                            <option key={m.id} value={m.id} class="py-1 px-2 hover:bg-primary/10 cursor-pointer rounded-sm">
                                {m.fullName} — {m.memberNumber}
                            </option>
                        ))}
                      </select>
                  </div>
                  <p class="text-xs text-body mt-2">Use the search box to find a member, then click to select.</p>
                </div>

                <div class="mb-4.5">
                   <label class="mb-2.5 block text-black font-medium">Date of Purchase</label>
                   <input 
                     type="date" 
                     name="date"
                     defaultValue={today}
                     class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary text-black"
                     required
                   />
                </div>

                <div class="grid grid-cols-2 gap-6 mb-4.5">
                    <div>
                        <label class="mb-2.5 block text-black font-medium">Number of Shares</label>
                        <input 
                            type="number" 
                            name="shareCount" 
                            placeholder="0" 
                            min="1"
                            class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-bold outline-none transition focus:border-primary active:border-primary text-black"
                            required
                            oninput="
                                const count = parseFloat(this.value) || 0;
                                const price = parseFloat(document.getElementById('share-price-val').dataset.price);
                                document.getElementById('total-cost-display').innerText = (count * price).toLocaleString();
                                document.getElementById('amount-input').value = (count * price);
                            "
                        />
                    </div>
                    <div>
                        <label class="mb-2.5 block text-black font-medium">Total Cost</label>
                        <div class="w-full rounded bg-gray-2 py-3 px-5 font-bold text-black border border-stroke text-right">
                            <span id="total-cost-display">0</span> <span class="text-xs font-normal text-body">UGX</span>
                        </div>
                        <input type="hidden" name="amount" id="amount-input" />
                    </div>
                </div>

                <div class="flex justify-end gap-4.5">
                    <a href="/dashboard/shares" class="flex justify-center rounded border border-stroke py-3 px-6 font-medium text-black hover:shadow-1 transition">
                        Cancel
                    </a>
                    <button type="submit" class="flex justify-center rounded bg-primary py-3 px-6 font-medium text-white hover:bg-opacity-90 shadow-default">
                        Save Purchase
                    </button>
                </div>

              </form>
            </div>
          </div>

          <div class="flex flex-col gap-9 lg:col-span-2">
             {/* Info Card */}
             <div class="rounded-sm border border-stroke bg-white shadow-default">
                <div class="border-b border-stroke py-4 px-6.5">
                    <h3 class="font-medium text-black">Settings</h3>
                </div>
                <div class="p-6.5">
                    <div class="mb-4">
                        <span class="block text-sm text-body">Current Share Price</span>
                        <h4 class="text-xl font-bold text-black mt-1" id="share-price-val" data-price={sharePrice}>
                            {sharePrice.toLocaleString()} UGX
                        </h4>
                    </div>
                    <div>
                        <span class="block text-sm text-body">Instructions</span>
                        <p class="text-sm text-body mt-2 leading-relaxed">
                            Select a member from the list. If they are not found, ensure they are registered and active. 
                            The total cost is calculated automatically based on the current share price.
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