import React from "react"
import { BarChart3, TrendingUp } from "lucide-react"

export default function PerformanceCharts() {
  // 🚀 CORRECTIF : On passe la valeur numérique en pourcentage directe pour l'attribut style
  const fakeMonthlySales = [
    { month: "Jan", amount: 45, percentage: "45%" },
    { month: "Fév", amount: 60, percentage: "60%" },
    { month: "Mar", amount: 55, percentage: "55%" },
    { month: "Avr", amount: 75, percentage: "75%" },
    { month: "Mai", amount: 90, percentage: "90%" },
    { month: "Juin", amount: 100, percentage: "100%" }
  ]

  const fakeTrendData = [
    { label: "Sem. 1", value: "12M", percentage: "20%" },
    { label: "Sem. 2", value: "18M", percentage: "45%" },
    { label: "Sem. 3", value: "15M", percentage: "35%" },
    { label: "Sem. 4", value: "28M", percentage: "80%" }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      
      {/* 📊 COMPOSANT 1 : HISTOGRAMME MENSUEL (Bar Chart) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4 text-purple-600" />
            <span>Performance des ventes (Millions FRS)</span>
          </h3>
        </div>
        
        {/* Conteneur de graphique avec une hauteur fixe stricte */}
        <div className="relative w-full h-44 flex items-end justify-between border-b border-l border-slate-200 dark:border-slate-800 px-4 pb-0">
          {fakeMonthlySales.map((bar, i) => (
            <div key={i} className="flex flex-col items-center justify-end h-full w-12 group relative">
              
              {/* Infobulle au survol de la barre */}
              <div className="absolute opacity-0 group-hover:opacity-100 bg-slate-950 text-white text-[9px] font-mono px-1.5 py-0.5 rounded bottom-full mb-1 transition-opacity pointer-events-none z-20">
                {bar.amount}M
              </div>

              {/* 🚀 RÉPARÉ : Utilisation de l'attribut style pour dessiner la hauteur physique */}
              <div 
                style={{ height: bar.percentage }}
                className="w-6 bg-purple-600 dark:bg-purple-500 rounded-t-sm group-hover:bg-purple-700 transition-all duration-300 shadow-sm shrink-0" 
              />
              
              {/* Libellé sous la ligne d'axe */}
              <span className="text-[10px] font-semibold text-slate-400 font-mono absolute top-full pt-1.5">{bar.month}</span>
            </div>
          ))}
        </div>
        <div className="h-2" /> {/* Espace de garde inférieur */}
      </div>

      {/* 📈 COMPOSANT 2 : COURBE DE TENDANCE (Line Chart SVG) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span>Évolution du flux de trésorerie</span>
          </h3>
        </div>

        {/* Zone graphique relative fixe */}
        <div className="relative w-full h-44 border-b border-l border-slate-200 dark:border-slate-800 flex items-end justify-between px-6 pb-0">
          
          {/* Tracé vectoriel SVG fluide calé en fond de zone */}
          <svg className="absolute inset-0 w-full h-full p-4 overflow-visible text-emerald-500/20 dark:text-emerald-400/10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 0 80 Q 25 30, 50 60 T 100 10" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>

          {fakeTrendData.map((point, i) => (
            <div key={i} className="flex flex-col items-center justify-end h-full relative w-16 group">
              
              {/* 🚀 RÉPARÉ : Positionnement absolu par le bas en pixels ou % calculés */}
              <div 
                style={{ bottom: point.percentage }}
                className="absolute h-2.5 w-2.5 bg-emerald-600 dark:bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900 z-10 shadow-md group-hover:scale-125 transition-transform" 
              />
              
              {/* Badge de montant calé au-dessus du point */}
              <span 
                style={{ bottom: point.percentage }}
                className="absolute text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-400 translate-y-3.5 z-10 bg-white/80 dark:bg-slate-900/80 px-0.5 rounded"
              >
                {point.value}
              </span>

              {/* Libellé de l'axe des abscisses */}
              <span className="text-[10px] text-slate-400 font-medium absolute top-full pt-1.5">{point.label}</span>
            </div>
          ))}
        </div>
        <div className="h-2" />
      </div>

    </div>
  )
}
