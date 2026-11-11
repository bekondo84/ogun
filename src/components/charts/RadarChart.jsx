import React from 'react';
import { Radar } from 'react-chartjs-2';
import './chartConfig';

export function RadarChart() {
  const data = {
    labels: ['Prix', 'Délai', 'Qualité', 'Support', 'Flexibilité'],
    datasets: [
      {
        label: 'Fournisseur A',
        data: [85, 90, 75, 80, 95],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3b82f6',
      },
    ],
  };

  const options = { responsive: true, maintainAspectRatio: false };

  return (
    <div className="w-full h-64 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase">5. Radar (Radar)</h4>
      <div className="h-[calc(100%-1.5rem)] flex justify-center"><Radar key={13} data={data} options={options} /></div>
    </div>
  );
}