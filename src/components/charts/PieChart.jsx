import React from 'react';
import { Pie } from 'react-chartjs-2';
import './chartConfig';

export function PieChart() {
  const data = {
    labels: ['Administration', 'Production', 'Logistique', 'Ventes'],
    datasets: [
      {
        data: [15, 40, 25, 20],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#6366f1'],
      },
    ],
  };

  const options = { responsive: true, maintainAspectRatio: false };

  return (
    <div className="w-full h-64 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase">3. Camembert (Pie)</h4>
      <div className="h-[calc(100%-1.5rem)] flex justify-center"><Pie key={11} data={data} options={options} /></div>
    </div>
  );
}