export default function Badge({ children, type = 'primary', size = 'sm', className = '' }) {
  const colors = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info',
    ghost: 'bg-slate-100 text-slate-500',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[9px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const colorClass = colors[type] || colors.primary;
  const sizeClass = sizes[size] || sizes.sm;

  return (
    <span class={`inline-flex items-center justify-center rounded-full font-semibold ${sizeClass} ${colorClass} ${className}`}>
      {children}
    </span>
  );
}
