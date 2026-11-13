import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import './chartConfig'; // Importe l'enregistrement des composants
import { executedPostMethod } from '@/axios/DataService';
import { useInterval } from '@/hooks/useInterval';

export default function LineChart({
    lineChart
}) {
  
  const [data, setData] = useState(null)
  const [title, setTitle] = useState(null)
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
      setTitle(lineChart.label)
        fetchData()
    }
  }, [lineChart]);

  useInterval(() => {
      if (lineChart) {
          fetchData();
      }
  }, lineChart?.refresh || 3600000);
  

  const fetchData= async() => {
     const response = await executedPostMethod(lineChart.action, lineChart.method, {
          data: lineChart,
     });
     const result = response.data;
     const resultdatasets = result?.datasets;
     const datasets = [];

     if (resultdatasets && Array.isArray(resultdatasets)) {
          resultdatasets.forEach(dataset => {
               datasets.push({
                    label: dataset.label,
                    data : [...dataset.values],
                    borderColor: dataset.borderColor || '#9333ea',
                    backgroundColor: dataset.bgColor || '#9333ea',
                    pointBackgroundColor: dataset.pointColor || '#9333ea',
                    fill: true,
                    tension:0.3,
                    borderWidth:2,
               })
          });
     }

    // console.log('LineChart.fetchData ------------------ '+JSON.stringify(result))
     setData({
        labels: [...result.labels],
        datasets: [...datasets]
     });
  }

  const isValid = () => {
     if (data) {
        const datasets = data.datasets;
        const labels = data.labels;

        if (labels == null || !Array.isArray(labels))
          return false

        if (datasets== null || !Array.isArray(datasets))
          return false;

        for (var i in datasets) {
           var dataset = datasets [i];
           if ( dataset == null || Object.keys(dataset).length <= 0)
            return false;
          var values = dataset?.data;
          if (values == null || !Array.isArray(values) || values.length != labels.length)
            return false
        }

        return true
     }
     return false;
  }

  return (
    <div className="w-full h-72 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{title}</h3>
      <div className="w-full h-[calc(100%-2rem)]">
        {isValid() ? (<Line key={lineChart.id} data={data} options={options} />) : null}
      </div>
    </div>
  );
}