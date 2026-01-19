import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { PieChart, ArrowLeft, Check, Calendar, Info, TrendingUp } from 'lucide';

export default function MemberSharePurchasePage({ member, defaults = {}, errors = {}, values = {} }) {
  const today = new Date().toISOString().split('T')[0];
  const sharePrice = defaults.sharePrice || 20000;

  return (
    <DashboardLayout title={`Shares: ${member.fullName}`}>
      <div class="mx-auto max-w-270">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-title-md2 font-bold text-black uppercase tracking-tight">Purchase Shares</h2>
          <nav>
            <ol class="flex items-center gap-2">
              <li><a class="font-medium" href={`/dashboard/members/${member.id}`}>{member.fullName} /</a></li>
              <li class="font-medium text-primary">Equity</li>
            </ol>
          </nav>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-9">
          <div class="lg:col-span-3">
            <div class="rounded-sm border border-stroke bg-white shadow-default">
              <div class="border-b border-stroke py-4 px-6.5 bg-primary/5">
                <h3 class="font-bold text-black flex items-center gap-2 text-sm uppercase">
                   <Icon icon={PieChart} size={18} class="text-primary" />
                   Capital Contribution
                </h3>
              </div>

              <form hx-post={`/dashboard/members/${member.id}/shares`} hx-push-url="true" hx-target="body" class="p-6.5">
                
                <div class="mb-6 p-4 bg-gray-2 border border-stroke rounded-sm flex justify-between items-center">
                    <span class="text-xs font-black uppercase tracking-widest text-body">Unit Share Price</span>
                    <span class="text-lg font-black text-black" id="price-display" data-price={sharePrice}>{sharePrice.toLocaleString()} <span class="text-xs">UGX</span></span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">Number of Shares</label>
                    <input 
                      type="number" 
                      id="share-count"
                      placeholder="1" 
                      min="1"
                      class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-black text-xl outline-none transition focus:border-primary active:border-primary text-black"
                      required
                      oninput="
                        const count = parseFloat(this.value) || 0;
                        const price = parseFloat(document.getElementById('price-display').dataset.price);
                        document.getElementById('total-amount').value = (count * price);
                        document.getElementById('display-total').innerText = (count * price).toLocaleString();
                      "
                    />
                  </div>

                  <div>
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">Total Amount (UGX)</label>
                    <div class="py-3 px-5 bg-slate-100 rounded border border-stroke text-right font-black text-xl text-primary" id="display-total">
                        0
                    </div>
                    <input type="hidden" name="amount" id="total-amount" />
                  </div>
                </div>

                <div class="mb-10">
                    <label class="mb-3 block text-black font-black text-[10px] uppercase tracking-widest">Transaction Date</label>
                    <div class="relative">
                      <input 
                        type="date" 
                        name="date" 
                        defaultValue={values.date || today}
                        class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pl-11 font-bold outline-none transition focus:border-primary active:border-primary text-black"
                        required 
                      />
                      <span class="absolute left-4 top-1/2 -translate-y-1/2">
                          <Icon icon={Calendar} size={18} class="text-bodydark2" />
                      </span>
                    </div>
                </div>

                <div class="flex justify-end gap-4 border-t border-stroke pt-6">
                    <a href={`/dashboard/members/${member.id}`} class="flex justify-center rounded border border-stroke py-3 px-8 font-medium text-black hover:shadow-1 transition">
                        Cancel
                    </a>
                    <button type="submit" class="flex justify-center rounded bg-primary py-3 px-10 font-bold text-white hover:bg-opacity-90 shadow-default uppercase tracking-widest flex items-center gap-2">
                        <Icon icon={Check} size={18} />
                        Purchase Shares
                    </button>
                </div>
              </form>
            </div>
          </div>

          <div class="lg:col-span-2">
             <div class="rounded-sm border border-stroke bg-white shadow-default">
                <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50">
                    <h3 class="font-bold text-black text-sm uppercase tracking-widest">Equity Guide</h3>
                </div>
                <div class="p-6.5">
                    <div class="bg-primary/5 p-4 rounded-sm border-l-4 border-primary mb-6">
                        <h4 class="font-bold text-primary text-xs uppercase mb-1">Permanent Capital</h4>
                        <p class="text-xs text-black font-medium leading-relaxed">
                            Shares represent ownership in the Sacco. Unlike savings, share capital is non-withdrawable but can be sold/transferred to other members.
                        </p>
                    </div>
                    
                    <ul class="text-xs text-body font-medium space-y-3">
                        <li class="flex gap-2">
                            <Icon icon={TrendingUp} size={14} class="text-success shrink-0" />
                            <span>Shares earn annual dividends based on Sacco performance.</span>
                        </li>
                        <li class="flex gap-2">
                            <Icon icon={Info} size={14} class="text-primary shrink-0" />
                            <span>This purchase will be recorded in the main Equity ledger.</span>
                        </li>
                    </ul>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}