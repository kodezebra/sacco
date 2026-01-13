import Icon from './Icon.jsx';
import { ArrowUp, ArrowDown } from 'lucide';

/**
 * Modern Financial Stats Card (TailAdmin Style)
 * @param {string} label - The metric name
 * @param {string|number} value - The primary value
 * @param {string} subtitle - Optional description
 * @param {object} icon - Lucide icon
 * @param {string} colorClass - Tailwind text color (e.g. text-primary)
 * @param {number|string} trend - Percentage change (e.g. 12.5 or "12.5")
 */
export default function StatsCard({ label, value, subtitle, icon, colorClass = "text-primary", trend }) {
  // Determine trend color and icon
  const isPositive = parseFloat(trend) >= 0;
  const TrendIcon = isPositive ? ArrowUp : ArrowDown;
  const trendColor = isPositive ? 'text-success' : 'text-error';

  return (
    <div class="rounded-sm border border-slate-200 bg-white px-6 py-6 shadow-sm hover:shadow-md transition-shadow p-6 rounded-xl">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 border border-slate-100 mb-4 h-12 w-12">
        <div class={colorClass}>
          <Icon icon={icon} size={22} />
        </div>
      </div>
      
      <div class="mt-4 flex items-end justify-between">
        <div>
          <h4 class="text-2xl font-bold text-slate-800 flex items-end gap-2">
            {value}
            {trend && (
              <span class={`flex items-center gap-1 text-sm font-medium ${trendColor} mb-1`}>
                <span class="text-xs">
                    <Icon icon={TrendIcon} size={14} />
                </span>
                {Math.abs(parseFloat(trend))}%
              </span>
            )}
          </h4>
          <span class="text-sm font-medium text-slate-500 block mt-1">{label}</span>
        </div>
        
        {subtitle && (
          <span class="flex items-center gap-1 text-xs font-medium text-slate-400">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
