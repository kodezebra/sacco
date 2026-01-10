export default function Icon({ icon, size = 24, color = "currentColor", strokeWidth = 2, class: className = "", ...props }) {
  if (!icon) return null;
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-linejoin="round"
      class={className}
      {...props}
    >
      {icon.map(([tag, attrs], index) => {
        const Tag = tag;
        return <Tag key={index} {...attrs} />;
      })}
    </svg>
  );
}
