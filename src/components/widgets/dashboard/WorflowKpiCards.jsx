import React, { useEffect, useState } from "react"
import { icons, Layers, ArrowRight, TrendingUp, AlertTriangle } from "lucide-react"
import WorkflowKpiCard from "./WorflowKpiCard"
import { executedPostMethod } from "@/axios/DataService"
import WorkflowKpiResumes from "./WorkflowKpiResumes"
import { useInterval } from "@/hooks/useInterval"

export default function WorflowKpiCards({
   worflowKpiCards
}) {

  const [kpiCards, setKpiCards] = useState([])
  const [kpiData, setKpiData] = useState(null)
  const [Icon, setIcon] = useState(null)

  useEffect(() => {
      if (worflowKpiCards) {
        fetchKpi();
        setIcon(icons[worflowKpiCards.icon]?? null);
      }
  }, [worflowKpiCards]);

  useEffect(() => {
      //console.log('WorflowKpiCards.useEffect --------------------- '+JSON.stringify(worflowKpiCards))
      if (kpiData) {
         setKpiCards(kpiData.items)
      }
  }, [kpiData]);

  useInterval(() => {
      if (worflowKpiCards) {
          fetchKpi();
      }
  }, worflowKpiCards?.refresh || 3600000);

  const fetchKpi = async() => {
       const response = await executedPostMethod(worflowKpiCards.action, worflowKpiCards.method, {
           data: worflowKpiCards
       })
       setKpiData(response.data)
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-5 w-full">
      
      {/* En-tête du composant */}
      <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/40 pb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          {Icon && (<Icon className="h-4 w-4 text-purple-600" />)}
          <span>{worflowKpiCards?.label}</span>
        </h3>
        <span className="text-[10px] bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 px-2 py-0.5 rounded font-bold font-mono">
          {worflowKpiCards.resume}
        </span>
      </div>

      {/*GRAPHIC A : L'Entonnoir Horizontal Graphique */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-2.5">
          {kpiCards.map((item, index) => (
             <WorkflowKpiCard index ={index} item={item} kpiCards={kpiCards} unit={worflowKpiCards.unit}/>
          ))}
        </div>
      </div>
      <WorkflowKpiResumes data={kpiData} />
    </div>
  )
}
