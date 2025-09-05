import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function StatsWidget({ stats }) {
    const chartRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        // === THE FIX: Add a check here as well ===
        if (!stats || !canvasRef.current) return;

        if (chartRef.current) chartRef.current.destroy();

        const ctx = canvasRef.current.getContext('2d');
        chartRef.current = new Chart(ctx, {
            type: 'radar',
            // ... rest of the chart config is the same ...
            data: {
                labels: Object.keys(stats).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
                datasets: [{ label: 'Stats', data: Object.values(stats), backgroundColor: 'rgba(0, 132, 255, 0.2)', borderColor: 'rgba(0, 132, 255, 1)', borderWidth: 2 }]
            },
            options: { animation: false, responsive: true, maintainAspectRatio: false, scales: { r: { angleLines: { color: '#333' }, grid: { color: '#333' }, pointLabels: { color: '#e0e0e0', font: { size: 14 } }, ticks: { color: '#a0a0a0', backdropColor: 'transparent', stepSize: 5 }, suggestedMin: 0 } }, plugins: { legend: { display: false } } }
        });
    }, [stats]);

    return (
        <div id="stats-widget" className="widget">
            <h3>Character Stats</h3>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}
export default StatsWidget;