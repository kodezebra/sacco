import Icon from './Icon.jsx';
import { Plus, Users, ArrowRightLeft, Banknote } from 'lucide';

/**
 * Reusable Action Bar for high-frequency tasks
 */
export default function ActionCenter() {
  const actions = [
    { label: "Register Member", icon: Users, href: "/dashboard/members/new" },
    { label: "Record Transaction", icon: ArrowRightLeft, href: "/dashboard/transactions/new" },
    { label: "Issue New Loan", icon: Banknote, href: "/dashboard/loans/new" },
  ];

  return (
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {actions.map((action, i) => (
          <a
            key={i}
            href={action.href}
            class="flex flex-col items-center justify-center p-6 rounded-sm border border-stroke bg-gray-2 hover:bg-white hover:border-primary hover:text-primary hover:shadow-default transition-all group gap-3"
          >
            <div class="h-12 w-12 rounded-full bg-white flex items-center justify-center border border-stroke group-hover:border-primary transition-colors">
                <Icon icon={action.icon} size={24} />
            </div>
            <span class="text-xs font-black uppercase tracking-widest">{action.label}</span>
          </a>
      ))}
    </div>
  );
}
