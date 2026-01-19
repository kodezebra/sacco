import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Badge from '../../components/Badge.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { 
  Wallet, CheckCircle, ArrowLeft, Info, Search, 
  Users, Building2, Plus, Trash2, Calculator, ArrowRight
} from 'lucide';

export default function RunPayrollPage({ staffList = [] }) {
  return (
    <DashboardLayout title="Run Payroll">
      <div class="mx-auto max-w-7xl">
        <PageHeader 
          title="Salary Disbursement"
          subtitle="Batch processing for employee compensation."
          backHref="/dashboard/payroll"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Payroll', href: '/dashboard/payroll' },
            { label: 'Run', href: '/dashboard/payroll/run', active: true }
          ]}
          actions={(
            <button type="button" onclick="loadAllStaff()" class="inline-flex items-center gap-2 rounded-sm border border-stroke bg-white px-4 py-2 text-sm font-bold text-black hover:text-primary transition-all shadow-sm">
                 <Icon icon={Plus} size={18} />
                 Add All Active Staff
            </button>
          )}
        />

        <form action="/dashboard/payroll/run" method="POST">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT: Entry Form */}
            <div class="lg:col-span-4">
              <div class="rounded-sm border border-stroke bg-white shadow-default h-fit sticky top-24">
                <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50">
                  <h3 class="font-bold text-black flex items-center gap-2 text-sm uppercase">
                    Selection & Adjustment
                  </h3>
                </div>
                
                <div class="p-6.5 flex flex-col gap-4.5">
                  <div>
                    <label class="mb-2 block text-black font-medium text-xs uppercase tracking-wide">Select Employee</label>
                    <div class="relative z-20 bg-transparent rounded border border-stroke focus-within:border-primary p-1">
                        <div class="flex items-center px-3 border-b border-stroke mb-1">
                            <Icon icon={Search} size={14} class="text-body mr-2" />
                            <input 
                                type="text" 
                                id="staff-search"
                                placeholder="Filter staff..."
                                class="w-full bg-transparent py-1 text-xs outline-none text-black"
                                onkeyup="
                                    const filter = this.value.toLowerCase();
                                    const options = document.querySelectorAll('#staff-select option');
                                    options.forEach(opt => {
                                        if(opt.value === '') return;
                                        const text = opt.text.toLowerCase();
                                        opt.style.display = text.includes(filter) ? '' : 'none';
                                    });
                                "
                            />
                        </div>
                        <select 
                            id="staff-select"
                            size="5"
                            class="relative z-20 w-full appearance-none bg-transparent py-1 px-3 outline-none transition text-black text-xs h-[150px]"
                            onchange="
                                const opt = this.options[this.selectedIndex];
                                document.getElementById('input-amount').value = opt.getAttribute('data-salary');
                            "
                        >
                            <option value="" disabled selected>Choose staff member...</option>
                            {staffList.map(s => (
                                <option 
                                    key={s.id} 
                                    value={s.id} 
                                    data-name={s.fullName} 
                                    data-role={s.role} 
                                    data-unit={s.unitName} 
                                    data-salary={s.salary}
                                >
                                    {s.fullName} — {s.role}
                                </option>
                            ))}
                        </select>
                    </div>
                  </div>

                  <div>
                    <label class="mb-2 block text-black font-medium text-xs uppercase tracking-wide">Amount to Disburse</label>
                    <div class="relative">
                      <span class="absolute left-4 top-2.5 text-black font-bold text-xs font-mono tracking-tighter">UGX</span>
                      <input 
                        type="number" 
                        id="input-amount" 
                        placeholder="0" 
                        class="w-full rounded border border-stroke bg-transparent py-2 pl-12 pr-4 text-sm font-black outline-none focus:border-primary text-black" 
                      />
                    </div>
                  </div>

                  <button type="button" onclick="addToBatch()" class="w-full flex justify-center items-center gap-2 rounded bg-primary py-3 font-bold text-white hover:bg-opacity-90 shadow-default active:scale-95 transition-all">
                    <Icon icon={Plus} size={20} />
                    Add to Batch
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: Staging Table */}
            <div class="lg:col-span-8 flex flex-col h-full">
              <div class="bg-white rounded-sm border border-stroke shadow-default flex flex-col h-full min-h-[600px]">
                <div class="p-6 border-b border-stroke flex justify-between items-center bg-gray-2/30">
                  <h3 class="font-bold text-black flex items-center gap-2 text-sm uppercase tracking-wider">
                    Payments Worksheet
                  </h3>
                  <div class="flex items-center gap-4">
                      <div class="text-right">
                          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Batch</p>
                          <p class="text-lg font-black text-primary font-mono" id="batch-total">0 UGX</p>
                      </div>
                      <button type="button" onclick="clearBatch()" class="text-xs text-error font-bold hover:underline">
                        Clear Batch
                      </button>
                  </div>
                </div>
                
                <div class="flex-1 overflow-y-auto max-h-[500px]">
                  <table class="w-full text-left border-collapse">
                    <thead class="sticky top-0 bg-gray-2 z-10">
                      <tr class="text-black text-[10px] uppercase font-bold border-b border-stroke">
                        <th class="py-3 px-6">Employee & Role</th>
                        <th class="py-3 px-4">Business Unit</th>
                        <th class="py-3 px-6 text-right">Amount</th>
                        <th class="py-3 px-4 w-[50px]"></th>
                      </tr>
                    </thead>
                    <tbody id="batch-body">
                      <tr id="empty-state">
                        <td colSpan="4" class="py-24 text-center text-body italic bg-gray-50/50 text-sm">
                          <div class="flex flex-col items-center gap-3">
                              <Icon icon={Wallet} size={48} class="opacity-10" />
                              <span>No employees added to the batch yet.</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div id="hidden-inputs-container"></div>

                <div class="p-6 border-t border-stroke bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div class="w-full md:w-64">
                      <label class="mb-2 block text-black font-black uppercase tracking-widest text-[10px]">Processing Date</label>
                      <input 
                        type="date" 
                        name="date" 
                        defaultValue={new Date().toISOString().split('T')[0]}
                        class="w-full rounded border border-stroke bg-white py-2 px-4 font-mono font-bold outline-none transition focus:border-primary text-black" 
                        required
                      />
                  </div>
                  <div class="flex gap-4 w-full md:w-auto">
                      <a href="/dashboard/payroll" class="rounded border border-stroke bg-white py-3 px-6 font-medium text-black hover:shadow-1 transition-all text-sm flex items-center flex-1 md:flex-none justify-center">
                        Cancel
                      </a>
                      <button type="submit" class="rounded bg-success py-3 px-12 font-black text-white hover:bg-opacity-90 shadow-default transition-all active:scale-95 text-lg uppercase tracking-widest flex-1 md:flex-none">
                        Process Batch
                      </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <script dangerouslySetInnerHTML={{ __html: `
          window.batchItems = [];
          window.itemCounter = 0;
          
          // Full list passed from server for "Load All"
          const allStaff = ${JSON.stringify(staffList)};

          const staffSelect = document.getElementById('staff-select');
          const amountInput = document.getElementById('input-amount');
          const batchBody = document.getElementById('batch-body');
          const hiddenDiv = document.getElementById('hidden-inputs-container');
          const emptyState = document.getElementById('empty-state');
          const batchTotalDisplay = document.getElementById('batch-total');

          window.addToBatch = function() {
            const staffId = staffSelect.value;
            const amount = parseFloat(amountInput.value);

            if (!staffId || isNaN(amount) || amount <= 0) {
              alert('Please select staff and enter valid amount');
              return;
            }

            const opt = staffSelect.options[staffSelect.selectedIndex];
            
            // Avoid duplicates in batch
            if (window.batchItems.find(i => i.staffId === staffId)) {
                alert('Employee is already in the batch');
                return;
            }

            window.batchItems.push({
              id: window.itemCounter++,
              staffId: staffId,
              name: opt.getAttribute('data-name'),
              role: opt.getAttribute('data-role'),
              unit: opt.getAttribute('data-unit'),
              amount: amount
            });

            renderUI();
            staffSelect.value = '';
            amountInput.value = '';
            document.getElementById('staff-search').value = '';
            // Reset visibility
            document.querySelectorAll('#staff-select option').forEach(o => o.style.display = '');
          };

          window.loadAllStaff = function() {
            if (window.batchItems.length > 0 && !confirm('This will replace current batch. Continue?')) return;
            
            window.batchItems = allStaff.map((s, idx) => ({
                id: idx,
                staffId: s.id,
                name: s.fullName,
                role: s.role,
                unit: s.unitName,
                amount: s.salary || 0
            }));
            window.itemCounter = allStaff.length;
            renderUI();
          };

          window.removeItem = function(id) {
            window.batchItems = window.batchItems.filter(i => i.id !== id);
            renderUI();
          };

          window.clearBatch = function() {
            if(confirm('Clear batch?')) {
              window.batchItems = [];
              renderUI();
            }
          };

          function renderUI() {
            if (window.batchItems.length === 0) {
              batchBody.innerHTML = '';
              batchBody.appendChild(emptyState);
              hiddenDiv.innerHTML = '';
              batchTotalDisplay.innerText = '0 UGX';
              return;
            }

            let html = '';
            let inputsHtml = '';
            let total = 0;

            [...window.batchItems].reverse().forEach((item, idx) => {
              total += item.amount;
              html += '<tr class="border-b border-stroke hover:bg-whiten">' +
                      '<td class="py-4 px-6">' +
                          '<div class="font-bold text-black text-sm">' + item.name + '</div>' +
                          '<div class="text-[10px] text-body uppercase tracking-widest font-bold">' + item.role + '</div>' +
                      '</td>' +
                      '<td class="py-4 px-4">' +
                          '<span class="py-1 px-2 rounded bg-gray-2 text-[10px] font-black text-black uppercase border border-stroke">' + item.unit + '</span>' +
                      '</td>' +
                      '<td class="py-4 px-6 text-right font-mono font-black text-sm text-black">' +
                          item.amount.toLocaleString() +
                      '</td>' +
                      '<td class="py-4 px-4 text-center">' +
                          '<button type="button" onclick="removeItem(' + item.id + ')" class="text-body hover:text-error transition-colors">' +
                              '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' +
                          '</button>' +
                      '</td>' +
                  '</tr>';

              const realIdx = window.batchItems.length - 1 - idx;
              inputsHtml += '<input type="hidden" name="staffIds" value="' + item.staffId + '" />' +
                           '<input type="hidden" name="amount_' + item.staffId + '" value="' + item.amount + '" />';
            });

            batchBody.innerHTML = html;
            hiddenDiv.innerHTML = inputsHtml;
            batchTotalDisplay.innerText = total.toLocaleString() + ' UGX';
          }

          amountInput.addEventListener('keypress', function (e) { if (e.key === 'Enter') { e.preventDefault(); addToBatch(); } });
        ` }} />
      </div>
    </DashboardLayout>
  );
}
