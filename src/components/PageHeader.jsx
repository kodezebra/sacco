import Icon from './Icon.jsx';
import Breadcrumbs from './Breadcrumbs.jsx';
import { ArrowLeft } from 'lucide';

/**
 * Standardized Page Header for SACCO App
 */
export default function PageHeader({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  backHref,
  actions 
}) {
  return (
    <div class="mb-8">
      {/* Breadcrumbs at the very top */}
      <Breadcrumbs items={breadcrumbs} />

      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="flex items-center gap-4">
          {backHref && (
            <a 
              href={backHref} 
              class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:bg-primary hover:text-white shadow-default transition-all border border-stroke"
            >
              <Icon icon={ArrowLeft} size={20} />
            </a>
          )}
          <div>
            <h2 class="text-2xl md:text-3xl font-black text-black uppercase tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p class="text-sm text-body font-medium mt-1 italic">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div class="flex flex-wrap items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
