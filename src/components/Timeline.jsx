import Icon from './Icon.jsx';
import { ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide';

/**
 * Modern Activity Timeline (TailAdmin Style)
 */
export default function Timeline({ items = [] }) {
  if (items.length === 0) {
    return (
      <div class="p-12 text-center text-body italic text-sm">
        No recent activities found.
      </div>
    );
  }

  return (
    <div class="flex flex-col">
      {items.map((item, i) => (
        <div key={item.id} class={`p-4 flex items-start gap-4 hover:bg-whiten transition-colors group ${i !== items.length - 1 ? 'border-b border-stroke' : ''}`}>
          <div class={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 ${
            item.type === 'income' 
            ? 'bg-success/10 text-success' 
            : 'bg-error/10 text-error'
          }`}>
            <Icon icon={item.type === 'income' ? ArrowDownLeft : ArrowUpRight} size={18} />
          </div>
          <div class="flex-grow min-w-0">
            <div class="flex justify-between items-start gap-2">
              <h4 class="text-sm font-bold text-black truncate group-hover:text-primary transition-colors">
                {item.category}
              </h4>
              <span class={`font-mono text-sm font-black shrink-0 ${item.type === 'income' ? 'text-success' : 'text-error'}`}>
                {item.type === 'income' ? '+' : '-'}{item.amount?.toLocaleString()}
              </span>
            </div>
            <p class="text-xs text-body truncate mt-0.5">{item.description}</p>
            <div class="flex items-center gap-1.5 text-[10px] font-bold text-bodydark2 uppercase tracking-widest mt-2">
               <Icon icon={Calendar} size={10} />
               {item.date}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
