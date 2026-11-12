import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import './chartConfig';
import { executedPostMethod } from '@/axios/DataService';

export default function DoughnutChart({
  doughnut
}) {
  /* const data = {
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
  }; */
  const [data, setData] = useState(null)
  const [titre, setTitre] = useState(null)

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

  useEffect(() => {
      if (doughnut) {
          setTitre(doughnut.label);
          fetchData();
      }
  }, [doughnut]);

  const fetchData = async() => {
          const response = await executedPostMethod(doughnut.action, doughnut.method, {
                 data: doughnut,
          });
          const data = response.data;
          const labels = [];
          const values = [];
          const bgColors = [];
          const items = data.data;
  
         items?.forEach(d => {
            labels.push(d.label);
               values.push(d.value);
               bgColors.push(d.bgColor)
          });
  
          setData({
              labels: labels,
              datasets: [
                {
                   data: values,
                   backgroundColor: bgColors
                }
              ],
          });
    }
  
    const isValid = () => {
       if (data) {
           const labels = data.labels;
           const datasets = data?.datasets;
           var values = null;
           var bgColors = null;
  
           if (datasets && Array.isArray(datasets) && datasets.length > 0) {
               values = datasets[0].data;
               bgColors = datasets[0].backgroundColor;
           }
           
           if (!labels || !Array.isArray(labels) || !values || !Array.isArray(values) || !bgColors || !Array.isArray(bgColors)) {
               return false;
           }
           
           if (labels.length != values.length || labels.length != bgColors.length) {
               return false;
           }
           return true;
  
       }
  
        return false;
    }
  

  return (
    <div className="w-full h-72 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{titre}</h3>
      <div className="w-full h-[calc(100%-2rem)] flex items-center justify-center">
        {isValid() ? (
          <Doughnut key={doughnut.id} data={data} options={options} />
        ) : null}
      </div>
    </div>
  );
}