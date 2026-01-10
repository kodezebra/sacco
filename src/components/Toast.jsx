export function Toast({ message, type = 'success' }) {
  const alertType = type === 'success' ? 'alert-success' : 'alert-error';
  return (
    <div 
      id="htmx-toast-container" 
      hx-swap-oob="true"
      class="toast toast-top toast-end"
    >
      <div class={`alert ${alertType} text-sm py-2`}>
        <span>{message}</span>
      </div>
    </div>
  );
}
