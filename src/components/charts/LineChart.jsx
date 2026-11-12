import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import './chartConfig'; // Importe l'enregistrement des composants
import { executedPostMethod } from '@/axios/DataService';

export default function LineChart({
    lineChart
}) {
  // 1. Les données du graphique
  const data = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Année 2026 (€)',
        data: [30000, 45000, 28000, 60000, 75000, 90000],
        borderColor: '#9333ea', // Violet (Principal)
        backgroundColor: 'rgba(147, 51, 234, 0.05)',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
      },
      {
        label: 'Année 2025 (€)',
        data: [25000, 38000, 30000, 52000, 68000, 81000],
        borderColor: '#cbd5e1', // Gris clair (Secondaire)
        backgroundColor: 'transparent',
        fill: true,
        //borderDash: [5, 5], // Ligne en pointillés pour la différencier
        tension: 0.3,
        borderWidth: 2,
      },
    ],
  };
  

  // 2. Les options de style et de comportement
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permet de respecter la hauteur du conteneur CSS
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 11 },
          color: '#64748b', // Couleur du texte (slate-500)
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 6,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(100, 116, 139, 0.1)' },
        ticks: { font: { size: 10 }, color: '#64748b' },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, color: '#64748b' },
      },
    },
  };

  useEffect(() => {
       if (lineChart) {
           fetchData()
       }
  }, [lineChart])

  const fetchData= async() => {
     const response = await executedPostMethod(lineChart.action, lineChart.method, {
          data: lineChart,
     });
     const result = response.data;
     console.log('LineChart.fetchData ------------------ '+JSON.stringify(result))
  }

  return (
    <div className="w-full h-72 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Performance Commerciale</h3>
      <div className="w-full h-[calc(100%-2rem)]">
        <Line key={16} data={data} options={options} />
      </div>
    </div>
  );
}