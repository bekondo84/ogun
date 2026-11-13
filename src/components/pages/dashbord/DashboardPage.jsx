import React, { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

import KpiCards from "@/components/widgets/dashboard/KpiCards"
import ActivityLogs from "@/components/widgets/dashboard/ActivityLogs"
import WorflowKpiCards from "@/components/widgets/dashboard/WorflowKpiCards"
import LineChart from "@/components/charts/LineChart"
import DoughnutChart from "@/components/charts/DoughnutChart"
import { BarChart } from "@/components/charts/BarChart"
import { PieChart } from "@/components/charts/PieChart"
import { RadarChart } from "@/components/charts/RadarChart"
import { ScatterChart } from "@/components/charts/ScatterChart"
import Charts from "@/components/widgets/dashboard/Charts"

export default function DashboardPage({
   dashboard
}) {

  useEffect(() => {
      setSections(dashboard?.dashbordItems)
      setTitle(dashboard?.label)
      //console.log('DashboardPage.useEffect --------------- '+JSON.stringify(dashboard))
  }, [dashboard]);

  
  const [isLoading, setIsLoading] = useState(false)

  const handleRefreshSimulation = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 500)
  }
  const [sections, setSections] = useState([])
  const [title, setTitle] = useState(null)

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-6 space-y-6 antialiased text-xs select-none">
      
      {/* 1. EN-TÊTE FIXE COMPACT */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 flex-wrap gap-4 bg-transparent">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider font-mono"></span>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
        </div>
        
        {/* <button 
          type="button"
          onClick={handleRefreshSimulation}
          className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-md inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${isLoading ? "animate-spin" : ""}`} />
          <span>Actualiser</span>
        </button> */}
      </div>
       
       {sections?.map((section, idx) => (
           section.type === 'kpiCards' ? (
               <KpiCards kpiCardsMeta={section} />
           ): section.type === 'WorflowKpiCards' ? (
              <WorflowKpiCards worflowKpiCards={section}/>
           ):section.type ==='Charts' ? (
              <Charts data={section}/>
           ): null
       ))}
    </div>
  )
}
