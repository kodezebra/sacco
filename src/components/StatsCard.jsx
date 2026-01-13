import Icon from './Icon.jsx';
import { ArrowUp, ArrowDown } from 'lucide';

/**
 * Modern Financial Stats Card (TailAdmin Style)
 */
export default function StatsCard({ label, value, subtitle, icon, colorClass = "text-primary", trend }) {
  // Determine trend color and icon
  const isPositive = parseFloat(trend) >= 0;
  const TrendIcon = isPositive ? ArrowUp : ArrowDown;
  const trendColor = isPositive ? 'text-success' : 'text-error';

  return (
    <div class="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default">
      <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-whiten">
        <div class={colorClass}>
          <Icon icon={icon} size={22} />
        </div>
      </div>
      
      <div class="mt-4 flex items-end justify-between">
        <div>
          <h4 class="text-title-md font-bold text-black">
            {value}
          </h4>
          <span class="text-sm font-medium text-body">{label}</span>
        </div>
        
        {trend && (
          <span class={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
            {Math.abs(parseFloat(trend))}%
            <Icon icon={TrendIcon} size={14} />
          </span>
        )}

        {subtitle && !trend && (
          <span class="flex items-center gap-1 text-xs font-medium text-bodydark2">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
