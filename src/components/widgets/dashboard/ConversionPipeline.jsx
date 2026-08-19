import React from "react"
import { Layers, ArrowRight, TrendingUp, AlertTriangle } from "lucide-react"

export default function ConversionPipeline() {
  // 🚀 FAKE DATA : Les étapes du tunnel avec les volumes, montants et taux de passage
  const fakePipelineStages = [
    { stage: "Nouveau", count: 120, amount: "45.0M FRS", conversion: "100%", color: "bg-purple-600 dark:bg-purple-500", text: "text-purple-700" },
    { stage: "Qualifié", count: 85, amount: "32.5M FRS", conversion: "70.8%", color: "bg-blue-600 dark:bg-blue-500", text: "text-blue-700" },
    { stage: "Proposition Émise", count: 42, amount: "18.2M FRS", conversion: "35.0%", color: "bg-amber-500 dark:bg-amber-400", text: "text-amber-700" },
    { stage: "Négociation", count: 18, amount: "9.1M FRS", conversion: "15.0%", color: "bg-indigo-600 dark:bg-indigo-500", text: "text-indigo-700" },
    { stage: "Gagné", count: 12, amount: "6.4M FRS", conversion: "10.0%", color: "bg-emerald-600 dark:bg-emerald-500", text: "text-emerald-700" }
  ]

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-5 w-full">
      
      {/* En-tête du composant */}
      <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/40 pb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-purple-600" />
          <span>Pipeline Commercial & Tunnel de Conversion</span>
        </h3>
        <span className="text-[10px] bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 px-2 py-0.5 rounded font-bold font-mono">
          Global CRM
        </span>
      </div>

      {/* 🚀 GRAPHIC A : L'Entonnoir Horizontal Graphique */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-2.5">
          {fakePipelineStages.map((item, index) => (
            <React.Fragment key={index}>
              {/* Carte de l'étape */}
              <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-3 flex flex-col justify-between space-y-3 group hover:border-purple-500/40 transition-all relative overflow-hidden">
                {/* Ligne de couleur du haut */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${item.color}`} />
                
                <div className="flex items-start justify-between gap-2 pt-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 truncate">{item.stage}</span>
                  <span className="font-mono bg-white dark:bg-slate-800 border border-slate-200/40 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-500">
                    {item.conversion}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="text-base font-black text-slate-900 dark:text-white font-mono tracking-tight">
                    {item.count} <span className="text-[10px] font-semibold text-slate-400">fiches</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 font-mono">
                    {item.amount}
                  </div>
                </div>
              </div>

              {/* Petite flèche intermédiaire (uniquement entre les étapes, masquée sur mobile) */}
              {index !== fakePipelineStages.length - 1 && (
                <div className="hidden md:flex items-center justify-center text-slate-300 dark:text-slate-700 shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 🚀 GRAPHIC B : Les barres de rendement d'attrition associées */}
      <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-3 p-3 bg-purple-50/30 dark:bg-purple-950/10 rounded-xl border border-purple-100/50 dark:border-purple-900/20">
          <div className="p-2 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 rounded-lg">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-200">Vitesse du Pipeline</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Le temps moyen de conversion d'une fiche est de <span className="font-bold text-purple-700 dark:text-purple-400 font-mono">14 jours</span> cette semaine.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-amber-50/30 dark:bg-amber-950/10 rounded-xl border border-amber-100/50 dark:border-amber-900/20">
          <div className="p-2 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 rounded-lg">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-200">Taux de Perte Global</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Attention, environ <span className="font-bold text-amber-700 dark:text-amber-400 font-mono">35% de déperdition</span> constatée entre l'étape de qualification et de proposition.</p>
          </div>
        </div>
      </div>

    </div>
  )
}
