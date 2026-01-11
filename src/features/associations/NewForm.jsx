import Icon from '../../components/Icon.jsx';
import { Layers, X } from 'lucide';

export default function NewAssociationForm() {
  return (
    <div class="p-0">
      <div class="bg-primary p-8 text-primary-content flex justify-between items-start">
        <div>
          <h2 class="text-2xl font-bold flex items-center gap-2">
            <Icon icon={Layers} size={24} />
            New Business Unit
          </h2>
          <p class="text-primary-content/70 text-sm mt-1">Initialize a new project or profit center</p>
        </div>
        <form method="dialog">
          <button class="btn btn-circle btn-ghost btn-sm">
             <Icon icon={X} size={20} />
          </button>
        </form>
      </div>

      <form 
        action="/dashboard/associations" 
        method="POST" 
        class="p-8 flex flex-col gap-6"
      >
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text font-bold uppercase tracking-wider text-xs">Unit Name</span>
          </label>
          <input 
            type="text" 
            name="name" 
            placeholder="e.g. Poultry Farm, Kampala Branch" 
            class="input input-bordered focus:input-primary w-full" 
            required 
            autofocus
          />
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text font-bold uppercase tracking-wider text-xs">Unit Category</span>
          </label>
          <select name="type" class="select select-bordered focus:select-primary w-full">
            <option value="project">Investment Project</option>
            <option value="department">Administrative Department</option>
            <option value="fleet">Asset/Fleet Management</option>
          </select>
          <label class="label">
            <span class="label-text-alt text-slate-400 italic">This helps in categorizing financial reports</span>
          </label>
        </div>

        <div class="alert alert-info shadow-sm py-3 px-4 rounded-lg bg-info/10 border-info/20 text-info text-xs">
          <Icon icon={Layers} size={14} class="mr-1" />
          New units will start with 0 staff and 0 transactions.
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <form method="dialog">
            <button class="btn btn-ghost">Cancel</button>
          </form>
          <button type="submit" class="btn btn-primary px-8">
            Create Unit
          </button>
        </div>
      </form>
    </div>
  );
}