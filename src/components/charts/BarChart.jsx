import React from 'react';
import { Bar } from 'react-chartjs-2';
import './chartConfig';

export function BarChart() {
  const data = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Objectif (€)',
        data: [100000, 120000, 140000, 180000],
        backgroundColor: '#3b82f6', // Bleu
        borderRadius: 4,
      },
      {
        label: 'Réalisé (€)',
        data: [95000, 125000, 135000, 190000],
        backgroundColor: '#10b981', // Vert
        borderRadius: 4,
      },
    ],
  };

  const options = { responsive: true, maintainAspectRatio: false };

  return (
    <div className="w-full h-64 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase">2. Barres (Bar)</h4>
      <div className="h-[calc(100%-1.5rem)]"><Bar key={10} data={data} options={options} /></div>
    </div>
  );
}