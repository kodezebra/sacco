export default function MainLayout({ title = "kzApp", children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} | kzApp</title>
        <link href="/styles.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
        <script src="https://unpkg.com/htmx.org@2.0.4"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          document.body.addEventListener('closeModal', function() {
            const modal = document.getElementById('htmx-modal');
            if (modal) modal.close();
          });

          document.body.addEventListener('refreshPage', function() {
             // We can use HTMX to refresh specific parts, 
             // but for simplicity and full data consistency, reload the window.
             window.location.reload();
          });
        `}}></script>
      </head>
      <body class="min-h-screen bg-whiten font-sans text-body">
        {children}
      </body>
    </html>
  );
}