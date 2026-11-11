import React from 'react';
import { Line } from 'react-chartjs-2';
import './chartConfig'; // Importe l'enregistrement des composants

export default function LineChart() {
  // 1. Les données du graphique
  const data = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
    datasets: [
      {
        label: 'Chiffre d’affaires 2026 (€)',
        data: [12000, 19000, 15500, 24000, 22500, 31000, 29000],
        borderColor: '#9333ea', // Violet (aux couleurs de ton ERP)
        backgroundColor: 'rgba(147, 51, 234, 0.08)', // Effet de transparence léger
        fill: true,
        tension: 0.35, // Arrondi des courbes
        borderWidth: 2,
        pointBackgroundColor: '#9333ea',
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

  return (
    <div className="w-full h-72 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Performance Commerciale</h3>
      <div className="w-full h-[calc(100%-2rem)]">
        <Line key={16} data={data} options={options} />
      </div>
    </div>
  );
}