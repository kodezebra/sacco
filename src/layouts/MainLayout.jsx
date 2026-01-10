export default function MainLayout({ title = "kzApp", children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} | kzApp</title>
        <link href="/styles.css" rel="stylesheet" />
      </head>
      <body class="min-h-screen bg-base-100 font-sans text-slate-900">
        {children}
      </body>
    </html>
  );
}