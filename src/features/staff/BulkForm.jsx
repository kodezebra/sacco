import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { UserPlus, X, Briefcase, Building2, Plus, Users, Trash2, Check, Search } from 'lucide';

export default function BulkStaffHirePage({ associations = [], members = [] }) {
  return (
    <DashboardLayout title="Bulk Hiring">
      <div class="mx-auto max-w-7xl">
        <PageHeader 
          title="Mass Recruitment"
          subtitle="Hire multiple staff members at once."
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Staff', href: '/dashboard/staff' },
            { label: 'Bulk Hire', href: '/dashboard/staff/bulk', active: true }
          ]}
        />

        <form action="/dashboard/staff/bulk" method="POST">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT: Entry Form */}
            <div class="lg:col-span-4 flex flex-col gap-6">
              
              {/* Optional: Member Quick-Select */}
              <div class="rounded-sm border border-stroke bg-white shadow-default">
                <div class="border-b border-stroke py-3 px-6.5 bg-gray-2/30">
                  <h4 class="text-xs font-bold text-black uppercase">Import from Members</h4>
                </div>
                <div class="p-6.5">
                   <div class="relative z-20 bg-transparent rounded border border-stroke focus-within:border-primary p-1">
                      <div class="flex items-center px-3 border-b border-stroke mb-1">
                          <Icon icon={Search} size={14} class="text-body mr-2" />
                          <input 
                            type="text" 
                            id="member-search"
                            placeholder="Find existing member..."
                            class="w-full bg-transparent py-1 text-xs outline-none text-black"
                            onkeyup="
                                const filter = this.value.toLowerCase();
                                const options = document.querySelectorAll('#member-select option');
                                options.forEach(opt => {
                                    if(opt.value === '') return;
                                    const text = opt.text.toLowerCase();
                                    opt.style.display = text.includes(filter) ? '' : 'none';
                                });
                            "
                          />
                      </div>
                      <select 
                        id="member-select"
                        size="4"
                        class="relative z-20 w-full appearance-none bg-transparent py-1 px-3 outline-none transition text-black text-xs h-[100px]"
                        onchange="document.getElementById('staff-name').value = this.options[this.selectedIndex].getAttribute('data-name');"
                      >
                        <option value="" disabled selected>Select to auto-fill name...</option>
                        {members.map(m => (
                            <option key={m.id} value={m.id} data-name={m.fullName}>
                                {m.fullName} ({m.memberNumber})
                            </option>
                        ))}
                      </select>
                   </div>
                </div>
              </div>

              <div class="rounded-sm border border-stroke bg-white shadow-default h-fit">
                <div class="border-b border-stroke py-4 px-6.5 bg-gray-2/50">
                  <h3 class="font-bold text-black flex items-center gap-2 text-sm uppercase">
                    New Employee Info
                  </h3>
                </div>
                
                <div class="p-6.5 flex flex-col gap-4.5">
                  <div>
                    <label class="mb-2 block text-black font-medium text-xs uppercase tracking-wide">Full Name</label>
                    <input 
                      type="text" 
                      id="staff-name" 
                      placeholder="e.g. John Doe" 
                      class="w-full rounded border border-stroke bg-transparent py-2 px-4 text-sm outline-none focus:border-primary text-black font-medium" 
                    />
                  </div>

                  <div>
                    <label class="mb-2 block text-black font-medium text-xs uppercase">Role</label>
                    <input 
                      type="text" 
                      id="staff-role" 
                      placeholder="e.g. Accountant" 
                      class="w-full rounded border border-stroke bg-transparent py-2 px-4 text-sm outline-none focus:border-primary text-black" 
                    />
                  </div>

                  <div>
                    <label class="mb-2 block text-black font-medium text-xs uppercase">Unit / Association</label>
                    <select id="staff-unit" class="w-full rounded border border-stroke bg-transparent py-2 px-4 text-sm outline-none focus:border-primary text-black">
                      <option value="" disabled selected>Select Unit...</option>
                      {/* Administrative Units */}
                      <optgroup label="Administrative (Sacco HQ)">
                        {associations.filter(a => a.type === 'department').map(assoc => (
                          <option key={assoc.id} value={assoc.id} data-name={assoc.name}>{assoc.name}</option>
                        ))}
                      </optgroup>
                      {/* Associations / Projects */}
                      <optgroup label="Associations (Projects)">
                        {associations.filter(a => a.type !== 'department').map(assoc => (
                          <option key={assoc.id} value={assoc.id} data-name={assoc.name}>{assoc.name}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div class="mb-2">
                    <label class="mb-2 block text-black font-medium text-xs uppercase">Monthly Salary</label>
                    <div class="relative">
                      <span class="absolute left-4 top-2.5 text-black font-bold text-xs">UGX</span>
                      <input 
                        type="number" 
                        id="staff-salary" 
                        placeholder="0" 
                        class="w-full rounded border border-stroke bg-transparent py-2 pl-12 pr-4 text-sm font-bold outline-none focus:border-primary text-black" 
                      />
                    </div>
                  </div>

                  <button type="button" onclick="addHire()" class="w-full flex justify-center items-center gap-2 rounded bg-primary py-3 font-bold text-white hover:bg-opacity-90 shadow-default active:scale-95 transition-all">
                    <Icon icon={Plus} size={20} />
                    Add to List
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: Table */}
            <div class="lg:col-span-8 flex flex-col h-full">
              <div class="bg-white rounded-sm border border-stroke shadow-default flex flex-col h-full min-h-[500px]">
                <div class="p-6 border-b border-stroke flex justify-between items-center bg-gray-2/30">
                  <h3 class="font-bold text-black flex items-center gap-2 text-sm uppercase tracking-wider">
                    Candidates to Hire
                  </h3>
                  <button type="button" onclick="clearHires()" class="text-xs text-error font-bold hover:underline">
                    Clear List
                  </button>
                </div>
                
                <div class="flex-1 overflow-y-auto max-h-[500px]">
                  <table class="w-full text-left border-collapse">
                    <thead class="sticky top-0 bg-gray-2 z-10">
                      <tr class="text-black text-[10px] uppercase font-bold border-b border-stroke">
                        <th class="py-3 px-6">Name & Role</th>
                        <th class="py-3 px-4">Unit</th>
                        <th class="py-3 px-6 text-right">Salary</th>
                        <th class="py-3 px-4 w-[50px]"></th>
                      </tr>
                    </thead>
                    <tbody id="hire-list-body">
                      <tr id="empty-state">
                        <td colSpan="4" class="py-20 text-center text-body italic bg-gray-50 text-sm">
                          No candidates added to the list yet.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div id="hidden-inputs-container"></div>

                <div class="p-6 border-t border-stroke bg-gray-50 flex justify-end gap-4">
                  <a href="/dashboard/staff" class="rounded border border-stroke bg-white py-3 px-6 font-medium text-black hover:shadow-1 transition-all text-sm flex items-center">
                    Cancel
                  </a>
                  <button type="submit" class="rounded bg-success py-3 px-12 font-black text-white hover:bg-opacity-90 shadow-default transition-all active:scale-95 text-lg uppercase tracking-widest flex items-center gap-2">
                    <Icon icon={Check} size={24} />
                    Complete Bulk Hire
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <script dangerouslySetInnerHTML={{ __html: `
          window.pendingHires = [];
          window.hireCounter = 0;

          const nameInput = document.getElementById('staff-name');
          const roleInput = document.getElementById('staff-role');
          const unitSelect = document.getElementById('staff-unit');
          const salaryInput = document.getElementById('staff-salary');
          const listBody = document.getElementById('hire-list-body');
          const hiddenDiv = document.getElementById('hidden-inputs-container');
          const emptyState = document.getElementById('empty-state');

          window.addHire = function() {
            const name = nameInput.value.trim();
            const role = roleInput.value.trim();
            const unitId = unitSelect.value;
            const salary = parseFloat(salaryInput.value);

            if (!name || !role || !unitId || isNaN(salary)) {
              alert('Please fill all fields');
              return;
            }

            const unitName = unitSelect.options[unitSelect.selectedIndex].text;

            window.pendingHires.push({
              id: window.hireCounter++,
              name,
              role,
              unitId,
              unitName,
              salary
            });

            renderUI();
            nameInput.value = '';
            roleInput.value = '';
            salaryInput.value = '';
            nameInput.focus();
          };

          window.removeHire = function(id) {
            window.pendingHires = window.pendingHires.filter(i => i.id !== id);
            renderUI();
          };

          window.clearHires = function() {
            if(confirm('Clear list?')) {
              window.pendingHires = [];
              renderUI();
            }
          };

          function renderUI() {
            if (window.pendingHires.length === 0) {
              listBody.innerHTML = '';
              listBody.appendChild(emptyState);
              hiddenDiv.innerHTML = '';
              return;
            }

            let html = '';
            let inputsHtml = '';

            [...window.pendingHires].reverse().forEach((item, idx) => {
              html += '<tr class="border-b border-stroke hover:bg-whiten">' +
                      '<td class="py-4 px-6">' +
                          '<div class="font-bold text-black text-sm">' + item.name + '</div>' +
                          '<div class="text-[10px] text-body uppercase tracking-widest">' + item.role + '</div>' +
                      '</td>' +
                      '<td class="py-4 px-4">' +
                          '<span class="py-1 px-2 rounded bg-gray-2 text-[10px] font-bold text-black uppercase">' + item.unitName + '</span>' +
                      '</td>' +
                      '<td class="py-4 px-6 text-right font-mono font-bold text-sm text-black">' +
                          item.salary.toLocaleString() +
                      '</td>' +
                      '<td class="py-4 px-4 text-center">' +
                          '<button type="button" onclick="removeHire(' + item.id + ')" class="text-body hover:text-error transition-colors">' +
                              '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' +
                          '</button>' +
                      '</td>' +
                  '</tr>';

              const realIdx = window.pendingHires.length - 1 - idx;
              inputsHtml += '<input type="hidden" name="hires[' + realIdx + '][fullName]" value="' + item.name + '" />' +
                           '<input type="hidden" name="hires[' + realIdx + '][role]" value="' + item.role + '" />' +
                           '<input type="hidden" name="hires[' + realIdx + '][associationId]" value="' + item.unitId + '" />' +
                           '<input type="hidden" name="hires[' + realIdx + '][salary]" value="' + item.salary + '" />';
            });

            listBody.innerHTML = html;
            hiddenDiv.innerHTML = inputsHtml;
          }

          salaryInput.addEventListener('keypress', function (e) { if (e.key === 'Enter') { e.preventDefault(); addHire(); } });
        ` }} />
      </div>
    </DashboardLayout>
  );
}
