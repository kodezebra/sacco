import Icon from './Icon.jsx';

/**
 * Standardized Table Row Action Component (TailAdmin/TailBank style)
 */
export default function TableAction({ 
  label, 
  href, 
  icon, 
  onClick, 
  className = '', 
  variant = 'default',
  ...props 
}) {
  const baseClasses = "group inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 shadow-xs transition-all hover:border-primary hover:text-primary active:scale-95";
  const dangerClasses = "hover:border-error hover:text-error";
  
  const finalClass = `${baseClasses} ${variant === 'danger' ? dangerClasses : ''} ${className}`;

  const content = (
    <>
      {label && <span>{label}</span>}
      {icon && (
        <span class={`${label ? 'text-slate-400 group-hover:text-current' : ''}`}>
          <Icon icon={icon} size={14} />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} class={finalClass} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} class={finalClass} {...props}>
      {content}
    </button>
  );
}
