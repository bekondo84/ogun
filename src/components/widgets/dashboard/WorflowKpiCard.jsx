import { ArrowRight } from "lucide-react";
import React from "react";

export default function WorkflowKpiCard({
    item
    ,index
    , kpiCards
    ,unit}) {


    return (
        <React.Fragment key={index}>
              {/* Carte de l'étape */}
              <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-3 flex flex-col justify-between space-y-3 group hover:border-purple-500/40 transition-all relative overflow-hidden">
                {/* Ligne de couleur du haut */}
                {item.color && (<div className={`absolute top-0 left-0 right-0 h-1 ${item.color}`} />)}
                
                <div className="flex items-start justify-between gap-2 pt-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 truncate">{item.label}</span>
                  {item.change && (<span className="font-mono bg-white dark:bg-slate-800 border border-slate-200/40 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-500">
                    {`${item.change} %`}
                  </span>)}
                </div>

                <div className="space-y-0.5">
                  <div className="text-base font-black text-slate-900 dark:text-white font-mono tracking-tight">
                    {item.value} {unit && <span className="text-[10px] font-semibold text-slate-400">{unit}</span>}
                  </div>
                  {item.amount && (<div className="text-[10px] font-bold text-slate-500 font-mono">
                    {item.amount}
                   </div>)}
                </div>
              </div>

              {/* Petite flèche intermédiaire (uniquement entre les étapes, masquée sur mobile) */}
              {index !== kpiCards.length - 1 && (
                <div className="hidden md:flex items-center justify-center text-slate-300 dark:text-slate-700 shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
        </React.Fragment>
    )
}