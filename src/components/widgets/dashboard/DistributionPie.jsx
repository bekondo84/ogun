import React from "react"
import { PieChart } from "lucide-react"

export default function DistributionPie() {
  const fakePieData = [
    { name: "Direct Client", value: "45%", color: "bg-purple-600" },
    { name: "Campagne Email", value: "30%", color: "bg-blue-500" },
    { name: "Réseaux Sociaux", value: "15%", color: "bg-amber-500" },
    { name: "Recommandation", value: "10%", color: "bg-emerald-600" }
  ]

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
        <PieChart className="h-4 w-4 text-blue-600" />
        <span>Provenance des Affaires</span>
      </h3>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="relative h-24 w-24 rounded-full border-[10px] border-purple-600 flex items-center justify-center shrink-0">
          <div className="absolute inset-0 -m-[10px] rounded-full border-[10px] border-blue-500 clip-pie-30" />
          <div className="absolute inset-0 -m-[10px] rounded-full border-[10px] border-amber-500 clip-pie-15" />
          <p className="text-[10px] font-black text-slate-800 dark:text-white">100%</p>
        </div>
        <div className="flex-1 space-y-2 w-full">
          {fakePieData.map((item, i) => (
            <div key={i} className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/40 pb-0.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`h-2 w-2 rounded-full shrink-0 ${item.color}`} />
                <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}</span>
              </div>
              <span className="font-mono font-bold text-slate-800 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
