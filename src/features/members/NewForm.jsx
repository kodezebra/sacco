import Icon from '../../components/Icon.jsx';
import { UserPlus } from 'lucide';

export default function NewMemberForm() {
  return (
    <form
      hx-post="/dashboard/members"
      hx-target="#members-table-body"
      hx-swap="afterbegin"
    >
      <div class="flex items-center gap-2 mb-6">
        <Icon icon={UserPlus} size={24} class="text-primary" />
        <h3 class="font-bold text-lg">New Member Registration</h3>
      </div>

      <div class="space-y-4">
        <div class="form-control w-full">
            <label class="label"><span class="label-text font-medium">Full Name</span></label>
            <input type="text" name="fullName" class="input input-bordered w-full" required />
        </div>
        <div class="form-control w-full">
            <label class="label"><span class="label-text font-medium">Phone Number</span></label>
            <input type="tel" name="phone" class="input input-bordered w-full" />
        </div>
        <div class="form-control w-full">
            <label class="label"><span class="label-text font-medium">Address</span></label>
            <input type="text" name="address" class="input input-bordered w-full" />
        </div>
        <div class="form-control w-full">
            <label class="label"><span class="label-text font-medium">Next of Kin</span></label>
            <input type="text" name="nextOfKinName" class="input input-bordered w-full" />
        </div>
      </div>

      <div class="modal-action mt-8">
        <button type="button" class="btn" onclick="document.getElementById('htmx-modal').close()">Cancel</button>
        <button type="submit" class="btn btn-primary">
          Register Member
        </button>
      </div>
    </form>
  );
}
