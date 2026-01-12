import Icon from './Icon.jsx';

/**
 * Modern Financial Stats Card
 * @param {string} label - The metric name
 * @param {string|number} value - The primary value
 * @param {string} subtitle - Optional description
 * @param {object} icon - Lucide icon
 * @param {string} colorClass - Tailwind text color (e.g. text-primary)
 */
export default function StatsCard({ label, value, subtitle, icon, colorClass = "text-primary" }) {
  return (
    <div class="stats shadow border border-base-200 overflow-hidden">
      <div class="stat">
        <div class={`stat-figure ${colorClass} opacity-30`}>
          <Icon icon={icon} size={24} />
        </div>
        <div class="stat-title text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </div>
        <div class={`stat-value ${colorClass} text-2xl truncate`}>
          {value}
        </div>
        {subtitle && (
          <div class="stat-desc font-medium text-slate-500 truncate">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
