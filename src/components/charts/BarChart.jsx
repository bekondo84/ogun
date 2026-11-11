import React from 'react';
import { Bar } from 'react-chartjs-2';
import './chartConfig';

export function BarChart() {
  const data = {
    labels: ['Produit A', 'Produit B', 'Produit C', 'Produit D'],
    datasets: [
      {
        label: 'Unités vendues',
        data: [120, 190, 80, 150],
        backgroundColor: '#3b82f6', // Bleu
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