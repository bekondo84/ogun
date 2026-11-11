import React from 'react';
import { Scatter } from 'react-chartjs-2';
import './chartConfig';

export function ScatterChart() {
  const data = {
    datasets: [
      {
        label: 'Données de test',
        data: [
          { x: 10, y: 20 },
          { x: 15, y: 50 },
          { x: 26, y: 40 },
          { x: 32, y: 80 },
        ],
        backgroundColor: '#9333ea',
      },
    ],
  };

  const options = { responsive: true, maintainAspectRatio: false };

  return (
    <div className="w-full h-64 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase">6. Nuage de points (Scatter)</h4>
      <div className="h-[calc(100%-1.5rem)]"><Scatter key={14} data={data} options={options} /></div>
    </div>
  );
}