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
      </head>
      <body class="min-h-screen bg-base-100 font-sans text-slate-900">
        {children}
      </body>
    </html>
  );
}