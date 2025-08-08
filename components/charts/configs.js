export function buildPopulationTrendConfig(labels, data) {
  return {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Population',
          data,
          borderColor: '#3B82F6',
          tension: 0.2,
          fill: true,
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Population Growth' },
        tooltip: { callbacks: { label: (ctx) => `Population: ${Number(ctx.parsed.y).toLocaleString()}` } }
      },
      scales: {
        y: { beginAtZero: false, ticks: { callback: (v) => Number(v).toLocaleString() } }
      }
    }
  };
}

export function buildRacialDonutConfig(labels, data) {
  return {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6']
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'right' },
        tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${(ctx.parsed * 100).toFixed(1)}%` } }
      }
    }
  };
}

export function buildEconomicRadarConfig(labels, current, stateAvg) {
  return {
    type: 'radar',
    data: {
      labels,
      datasets: [
        { label: 'Municipality', data: current, borderColor: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.2)' },
        { label: 'Illinois Avg', data: stateAvg, borderColor: '#9CA3AF', backgroundColor: 'rgba(156,163,175,0.1)' }
      ]
    },
    options: { responsive: true }
  };
}