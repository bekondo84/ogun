import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import './chartConfig';
import { executedPostMethod } from '@/axios/DataService';

export function PieChart({
    pieData
}) {
   /* const data = {
    labels: ['Administration', 'Production', 'Logistique', 'Ventes'],
    datasets: [
      {
        data: [15, 40, 25, 20],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#6366f1'],
      },
    ],
  };  */

  const options = { responsive: true, maintainAspectRatio: false };
  const [data, setData] = useState(null)
  const [titre, setTitre] = useState(null)

  useEffect(() => {
    if (pieData) {
        setTitre (pieData.label);
        fetchData()
    }      
  }, [pieData])



  const fetchData = async() => {
        const response = await executedPostMethod(pieData.action, pieData.method, {
               data: pieData,
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
    <div className="w-full h-64 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase">{titre}</h4>
      {isValid() ? (
        <div className="h-[calc(100%-1.5rem)] flex justify-center"><Pie key={pieData.id} data={data} options={options} /></div>
      ): null}
    </div>
  );
}