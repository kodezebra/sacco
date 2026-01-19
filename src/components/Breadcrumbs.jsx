import Icon from './Icon.jsx';
import { ChevronRight, Home } from 'lucide';

/**
 * Modern Fintech Breadcrumbs
 * @param {Array} items - [{ label: string, href: string, active: boolean }]
 */
export default function Breadcrumbs({ items = [] }) {
  return (
    <nav class="mb-4">
      <ol class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <li class="flex items-center">
          <a href="/dashboard" class="hover:text-primary transition-colors flex items-center gap-1.5">
            <Icon icon={Home} size={12} />
            <span>HQ</span>
          </a>
        </li>
        
        {items.map((item, idx) => (
          <li key={idx} class="flex items-center gap-2">
            <Icon icon={ChevronRight} size={10} class="opacity-50" />
            {item.active ? (
              <span class="text-primary">{item.label}</span>
            ) : (
              <a href={item.href} class="hover:text-primary transition-colors">
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
