/**
 * Reusable ApexChart component for SSR
 * Injects client-side ApexCharts logic into the page.
 */
export default function ApexChart({ id, options, height = 300 }) {
  // TailAdmin inspired default theme
  const defaultOptions = {
    chart: {
      fontFamily: "'Inter', sans-serif",
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#3C50E0', '#80CAEE', '#10B981', '#FFBA00'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    grid: {
      strokeDashArray: 5,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      borderColor: '#f1f5f9'
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px',
          fontWeight: 500
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px',
          fontWeight: 500
        }
      }
    },
    tooltip: {
      theme: 'light',
      style: { fontSize: '12px', fontFamily: "'Inter', sans-serif" },
      x: { show: true },
      marker: { show: true },
    },
    markers: { size: 0, hover: { size: 5 } },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      markers: { radius: 12 },
      itemMargin: { horizontal: 10 }
    }
  };

  // Merge defaults with provided options (shallow merge for top-level, deeper for specific needs if we had a library)
  // For simplicity, we'll manually overlay key properties
  const chartOptions = {
    ...defaultOptions,
    ...options,
    chart: {
      ...defaultOptions.chart,
      ...options.chart,
      height: height,
      width: '100%',
    },
    xaxis: {
      ...defaultOptions.xaxis,
      ...options.xaxis,
      labels: { ...defaultOptions.xaxis.labels, ...(options.xaxis?.labels || {}) }
    },
    yaxis: {
      ...defaultOptions.yaxis,
      ...options.yaxis,
      labels: { ...defaultOptions.yaxis.labels, ...(options.yaxis?.labels || {}) }
    }
  };

  if (options.colors) chartOptions.colors = options.colors;
  if (options.grid) chartOptions.grid = { ...defaultOptions.grid, ...options.grid };
  if (options.legend) chartOptions.legend = { ...defaultOptions.legend, ...options.legend };

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
                return val.toLocaleString();
              }
            };
          }

          // Restore y-axis label formatter if generic
          if (options.yaxis && !options.yaxis.labels.formatter) {
             options.yaxis.labels.formatter = function(val) {
                return val >= 1000 ? (val/1000).toFixed(0) + 'K' : val;
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