import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import './chartConfig';
import { executedPostMethod } from '@/axios/DataService';
import { useInterval } from '@/hooks/useInterval';


export function BarChart({
    chartdata,
}) {
 
  const [data, setData] = useState(null);
  const [title, setTitle] = useState(null);
  const options = { responsive: true, maintainAspectRatio: false };

  useEffect(() => {
     if (chartdata) {
        fetchData();
        setTitle(chartdata.label);
     }
  }, [chartdata]);

  useInterval(() => {
        if (chartdata) {
            fetchData();
        }
    }, chartdata?.refresh || 3600000);

   const fetchData= async() => {
       const response = await executedPostMethod(chartdata.action, chartdata.method, {
            data: chartdata,
       });
       const result = response.data;
       const resultdatasets = result?.dataSets;
       const datasets = [];
  
       if (resultdatasets && Array.isArray(resultdatasets)) {
            resultdatasets.forEach(dataset => {
                 datasets.push({
                      label: dataset.label,
                      data : [...dataset.values],
                      backgroundColor: dataset.bgColor || "#9333ea",
                      borderRadius: 4,
                 })
            });
       }
  
      // console.log('BarChart.fetchData ------------------ '+JSON.stringify(result))
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
    <div className="w-full h-64 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase">{title}</h4>
      <div className="h-[calc(100%-1.5rem)]">{isValid() ? (<Bar key={chartdata.id} data={data} options={options} />) : null}</div>
    </div>
  );
}