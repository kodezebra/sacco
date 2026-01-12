/**
 * Reusable ApexChart component for SSR
 * Injects client-side ApexCharts logic into the page.
 */
export default function ApexChart({ id, options, height = 300 }) {
  // Ensure basic chart settings
  const chartOptions = {
    ...options,
    chart: {
      ...options.chart,
      height: height,
      width: '100%',
    }
  };

  return (
    <>
      <div id={id} style={{ width: '100%', minHeight: `${height}px` }}></div>
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const options = ${JSON.stringify(chartOptions)};
          
          // Apply standard financial formatters if not present
          // (JSON.stringify strips functions, so we re-attach common ones here)
          if (!options.tooltip) options.tooltip = {};
          if (!options.tooltip.y) {
            options.tooltip.y = {
              formatter: function(val) {
                return val.toLocaleString() + " UGX";
              }
            };
          }

          if (options.yaxis && !options.yaxis.labels) {
             options.yaxis.labels = {
                formatter: function(val) {
                   return val >= 1000 ? (val/1000) + 'K' : val;
                }
             };
          }

          const chart = new ApexCharts(document.querySelector("#${id}"), options);
          chart.render();
          
          // Ensure responsiveness
          setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 100);
        })();
      `}} />
    </>
  );
}
