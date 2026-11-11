import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import './chartConfig';

export default function DoughnutChart() {
  const data = {
    labels: ['En stock', 'En rupture', 'En commande', 'Réservé'],
    datasets: [
      {
        data: [65, 10, 15, 10],
        backgroundColor: [
          '#10b981', // Vert
          '#ef4444', // Rouge
          '#f59e0b', // Orange
          '#6366f1', // Indigo
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: { size: 11 },
          color: '#64748b',
        },
      },
    },
    cutout: '70%_size_or_percentage', // Crée l'effet anneau (donut)
  };

  // Correction de la syntaxe du cutout pour Chart.js
  options.cutout = '70%';

  return (
    <div className="w-full h-72 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">État Global des Stocks</h3>
      <div className="w-full h-[calc(100%-2rem)] flex items-center justify-center">
        <Doughnut key={15} data={data} options={options} />
      </div>
    </div>
  );
}