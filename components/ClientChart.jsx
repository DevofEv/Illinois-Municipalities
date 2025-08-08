import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const loadChart = () => import('chart.js/auto');

export default function ClientChart({ config, height = 400 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let chartInstance;
    (async () => {
      const Chart = (await loadChart()).default;
      const ctx = canvasRef.current;
      if (!ctx) return;
      if (chartInstance) chartInstance.destroy();
      chartInstance = new Chart(ctx, config);
    })();
    return () => chartInstance?.destroy?.();
  }, [JSON.stringify(config)]);

  return (
    <div className="chart-container" style={{ height }}>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}