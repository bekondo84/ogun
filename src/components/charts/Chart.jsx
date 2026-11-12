import React from "react";
import { PieChart } from "./PieChart";
import LineChart from "./LineChart";
import DoughnutChart from "./DoughnutChart";
import { BarChart } from "./BarChart";
import ActivityLogs from "../widgets/dashboard/ActivityLogs";

export default function Chart({
    chart
}) {

    return (
       <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
           {chart.type === 'pie' ? (
               <PieChart pieData={chart}/>      
           ): chart.type === 'line'? (
              <LineChart lineChart={chart} />
           ): chart.type === 'doughnut' ? (
               <DoughnutChart doughnut={chart}/>
           ): chart.type === 'bar' ? (
              <BarChart />
           ): chart.type === 'activitylogs' ? (
              <ActivityLogs />
           ): null}          
        </div>       
    )  
}