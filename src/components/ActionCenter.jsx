import Icon from './Icon.jsx';
import { Plus, Users, ArrowRightLeft, Banknote } from 'lucide';

/**
 * Reusable Action Bar for high-frequency tasks
 */
export default function ActionCenter() {
  const actions = [
    { label: "Register Member", icon: Users, href: "/dashboard/members/new", isModal: true },
    { label: "New Transaction", icon: ArrowRightLeft, href: "/dashboard/transactions/new", isModal: true },
    { label: "Issue Loan", icon: Banknote, href: "/dashboard/loans", isModal: false },
  ];

  return (
    <div class="flex flex-wrap items-center gap-3">
      {actions.map((action, i) => (
        <button
          key={i}
          class="btn btn-sm btn-ghost bg-base-100 border border-base-200 hover:border-primary hover:text-primary transition-all gap-2 rounded-xl px-4 h-10 shadow-sm"
          hx-get={action.isModal ? action.href : undefined}
          hx-target={action.isModal ? "#htmx-modal-content" : undefined}
          hx-swap={action.isModal ? "innerHTML" : undefined}
          onClick={action.isModal ? () => document.getElementById('htmx-modal').showModal() : () => window.location.href = action.href}
        >
          <Icon icon={action.icon} size={16} />
          <span class="text-xs font-bold uppercase tracking-tight">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
