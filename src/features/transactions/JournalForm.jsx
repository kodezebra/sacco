import Icon from '../../components/Icon.jsx';
import { 
  ArrowRightLeft, X, Plus, Trash2, Calendar, 
  Wallet, TrendingUp, TrendingDown, DollarSign,
  Briefcase, ShoppingCart
} from 'lucide';

export default function JournalForm({ associationId, errors = {}, values = {}, isModal = true }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={`w-full ${isModal ? 'max-w-6xl' : ''} mx-auto bg-gray-2 min-h-screen md:min-h-0 md:bg-transparent`} id="journal-form-container">
      
      {isModal && (
        <div className="flex justify-end mb-4">
          <button type="button" className="hover:text-primary transition-colors bg-white p-2 rounded-full shadow-sm border border-stroke" onclick="document.getElementById('htmx-modal').classList.remove('modal-open')">
             <Icon icon={X} size={20} />
          </button>
        </div>
      )}

      <form 
        hx-post={`/dashboard/transactions/journal?isModal=${isModal}`}
        hx-target="#journal-form-container"
        hx-swap="outerHTML"
        id="journal-form"
      >
        <input type="hidden" name="associationId" value={associationId} />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-5 rounded-sm border border-stroke shadow-default flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-body uppercase tracking-wider">Total Income</p>
                   <h3 className="text-2xl font-black text-success mt-1" id="total-income">0</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-success/10 text-success flex items-center justify-center">
                   <Icon icon={TrendingUp} size={20} />
                </div>
            </div>
            <div className="bg-white p-5 rounded-sm border border-stroke shadow-default flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-body uppercase tracking-wider">Total Expenses</p>
                   <h3 className="text-2xl font-black text-error mt-1" id="total-expense">0</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-error/10 text-error flex items-center justify-center">
                   <Icon icon={TrendingDown} size={20} />
                </div>
            </div>
            <div className="bg-primary text-white p-5 rounded-sm shadow-default flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Total</p>
                   <h3 className="text-2xl font-black mt-1" id="grand-total">0</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/20 text-white flex items-center justify-center">
                   <Icon icon={Wallet} size={20} />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT: Input */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white rounded-sm border border-stroke shadow-default p-6">
                    <h3 className="font-bold text-black mb-4 flex items-center gap-2 border-b border-stroke pb-2 text-sm uppercase tracking-wider">
                        Entry Details
                    </h3>

                    <div className="mb-4">
                        <label className="mb-2 block text-black font-medium text-xs uppercase">Date</label>
                        <input 
                            type="date" 
                            name="date" 
                            defaultValue={today}
                            className="w-full rounded border border-stroke bg-gray-2 py-2 px-4 text-sm font-medium outline-none focus:border-primary text-black"
                            required 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-black font-medium text-xs uppercase">Type</label>
                        <div className="flex bg-gray-2 rounded p-1">
                            <button type="button" id="btn-income" className="flex-1 py-2 rounded text-sm font-bold text-body hover:text-black transition-all" onclick="setType('income')">Income</button>
                            <button type="button" id="btn-expense" className="flex-1 py-2 rounded text-sm font-bold bg-error text-white shadow-sm transition-all" onclick="setType('expense')">Expense</button>
                        </div>
                        <input type="hidden" id="input-type" value="expense" />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-black font-medium text-xs uppercase">Category</label>
                        <select id="input-category" className="w-full rounded border border-stroke bg-transparent py-2 px-4 text-sm outline-none focus:border-primary text-black">
                            <option value="Supplies">Supplies</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Fuel">Fuel</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Salary">Salary</option>
                            <option value="Sales">Sales</option>
                            <option value="Service Fee">Service Fee</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-black font-medium text-xs uppercase">Description</label>
                        <input type="text" id="input-desc" placeholder="Details..." className="w-full rounded border border-stroke bg-transparent py-2 px-4 text-sm outline-none focus:border-primary text-black" />
                    </div>

                    <div className="mb-6">
                        <label className="mb-2 block text-black font-medium text-xs uppercase">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-2.5 text-black font-bold text-sm">UGX</span>
                            <input type="number" id="input-amount" placeholder="0" className="w-full rounded border border-stroke bg-transparent py-2 pl-14 pr-4 text-lg font-bold outline-none focus:border-primary text-black" />
                        </div>
                    </div>

                    <button type="button" onclick="addItem()" className="w-full flex justify-center items-center gap-2 rounded bg-primary py-3 font-bold text-white hover:bg-opacity-90 shadow-default active:scale-95 transition-all">
                        <Icon icon={Plus} size={20} />
                        Add Line Item
                    </button>
                </div>
            </div>

            {/* RIGHT: Table */}
            <div className="lg:col-span-8 flex flex-col h-full">
                <div className="bg-white rounded-sm border border-stroke shadow-default flex flex-col h-full min-h-[500px]">
                    <div className="p-6 border-b border-stroke flex justify-between items-center bg-gray-2/30">
                        <h3 className="font-bold text-black flex items-center gap-2 text-sm uppercase tracking-wider">
                            Journal Entries
                        </h3>
                        <button type="button" onclick="clearAll()" className="text-xs text-error font-bold hover:underline">
                            Clear All
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto max-h-[500px]">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-gray-2 z-10">
                                <tr className="text-black text-[10px] uppercase font-bold border-b border-stroke">
                                    <th className="py-3 px-6">Description</th>
                                    <th className="py-3 px-4">Category</th>
                                    <th className="py-3 px-6 text-right">Amount</th>
                                    <th className="py-3 px-4 w-[50px]"></th>
                                </tr>
                            </thead>
                            <tbody id="entry-list-body">
                                <tr id="empty-state">
                                    <td colSpan="4" className="py-20 text-center text-body italic bg-gray-50 text-sm">
                                        No items recorded.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div id="hidden-inputs-container"></div>

                    <div className="p-6 border-t border-stroke bg-gray-50 flex justify-end gap-4">
                        {isModal ? (
                            <button type="button" className="rounded border border-stroke bg-white py-3 px-6 font-medium text-black hover:shadow-1 transition-all text-sm" onclick="document.getElementById('htmx-modal').classList.remove('modal-open')">
                                Cancel
                            </button>
                        ) : (
                            <a href={`/dashboard/associations/${associationId}`} className="rounded border border-stroke bg-white py-3 px-6 font-medium text-black hover:shadow-1 transition-all text-sm flex items-center">
                                Cancel
                            </a>
                        )}
                        <button type="submit" className="rounded bg-success py-3 px-12 font-black text-white hover:bg-opacity-90 shadow-default transition-all active:scale-95 text-lg uppercase tracking-widest">
                            Save Journal
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </form>

      <script dangerouslySetInnerHTML={{ __html: `
        window.entryItems = [];
        window.itemCounter = 0;

        const typeInput = document.getElementById('input-type');
        const btnIncome = document.getElementById('btn-income');
        const btnExpense = document.getElementById('btn-expense');
        const catSelect = document.getElementById('input-category');
        const descInput = document.getElementById('input-desc');
        const amtInput = document.getElementById('input-amount');
        const listBody = document.getElementById('entry-list-body');
        const hiddenDiv = document.getElementById('hidden-inputs-container');
        const emptyState = document.getElementById('empty-state');

        const expenseCats = ['Supplies', 'Maintenance', 'Fuel', 'Utilities', 'Salary', 'Other'];
        const incomeCats = ['Sales', 'Service Fee', 'Consulting', 'Other'];

        window.setType = function(type) {
            typeInput.value = type;
            if (type === 'income') {
                btnIncome.className = "flex-1 py-2 rounded text-sm font-bold bg-success text-white shadow-sm transition-all";
                btnExpense.className = "flex-1 py-2 rounded text-sm font-bold text-body hover:text-black transition-all";
                renderCategories(incomeCats);
            } else {
                btnExpense.className = "flex-1 py-2 rounded text-sm font-bold bg-error text-white shadow-sm transition-all";
                btnIncome.className = "flex-1 py-2 rounded text-sm font-bold text-body hover:text-black transition-all";
                renderCategories(expenseCats);
            }
        };

        function renderCategories(cats) {
            catSelect.innerHTML = cats.map(function(c) { 
                return '<option value="' + c + '">' + c + '</option>';
            }).join('');
        }

        window.addItem = function() {
            const desc = descInput.value.trim();
            const amount = parseFloat(amtInput.value);
            if (!desc || isNaN(amount) || amount <= 0) return;

            window.entryItems.push({
                id: window.itemCounter++,
                type: typeInput.value,
                category: catSelect.value,
                description: desc,
                amount: amount
            });

            renderUI();
            descInput.value = '';
            amtInput.value = '';
            descInput.focus();
        };

        window.removeItem = function(id) {
            window.entryItems = window.entryItems.filter(i => i.id !== id);
            renderUI();
        };

        window.clearAll = function() {
            if(confirm('Clear all?')) {
                window.entryItems = [];
                renderUI();
            }
        };

        function renderUI() {
            let inc = 0, exp = 0;
            window.entryItems.forEach(i => {
                if (i.type === 'income') inc += i.amount;
                else exp += i.amount;
            });
            document.getElementById('total-income').innerText = inc.toLocaleString();
            document.getElementById('total-expense').innerText = exp.toLocaleString();
            document.getElementById('grand-total').innerText = (inc - exp).toLocaleString();

            if (window.entryItems.length === 0) {
                listBody.innerHTML = '';
                listBody.appendChild(emptyState);
                hiddenDiv.innerHTML = '';
                return;
            }

            let html = '';
            let inputsHtml = '';

            [...window.entryItems].reverse().forEach((item, idx) => {
                const isInc = item.type === 'income';
                const color = isInc ? 'text-success' : 'text-error';
                const border = isInc ? 'border-l-4 border-l-success' : 'border-l-4 border-l-error';

                html += '<tr class="border-b border-stroke hover:bg-whiten group">' +
                        '<td class="py-4 px-6 ' + border + '">' +
                            '<div class="font-bold text-black text-sm">' + item.description + '</div>' +
                            '<div class="text-[10px] text-body uppercase tracking-widest">' + item.type + '</div>' +
                        '</td>' +
                        '<td class="py-4 px-4">' +
                            '<span class="py-1 px-2 rounded bg-gray-2 text-[10px] font-bold text-black uppercase">' + item.category + '</span>' +
                        '</td>' +
                        '<td class="py-4 px-6 text-right font-mono font-bold text-sm ' + color + '">' +
                            (isInc ? '+' : '-') + item.amount.toLocaleString() +
                        '</td>' +
                        '<td class="py-4 px-4 text-center">' +
                            '<button type="button" onclick="removeItem(' + item.id + ')" class="text-body hover:text-error transition-colors">' +
                                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' +
                            '</button>' +
                        '</td>' +
                    '</tr>';

                const realIdx = window.entryItems.length - 1 - idx;
                inputsHtml += '<input type="hidden" name="items[' + realIdx + '][type]" value="' + item.type + '" />' +
                             '<input type="hidden" name="items[' + realIdx + '][category]" value="' + item.category + '" />' +
                             '<input type="hidden" name="items[' + realIdx + '][description]" value="' + item.description + '" />' +
                             '<input type="hidden" name="items[' + realIdx + '][amount]" value="' + item.amount + '" />';
            });

            listBody.innerHTML = html;
            hiddenDiv.innerHTML = inputsHtml;
        }

        amtInput.addEventListener('keypress', function (e) { if (e.key === 'Enter') { e.preventDefault(); addItem(); } });
        setType('expense');
      ` }} />
    </div>
  );
}
