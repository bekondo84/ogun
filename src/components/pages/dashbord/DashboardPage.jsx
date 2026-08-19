import React, { useState } from "react"
import { RefreshCw } from "lucide-react"

// Importation de vos sous-composants existants + le nouveau Pipeline
import KpiCards from "@/components/widgets/dashboard/KpiCards"
import ConversionPipeline from "@/components/widgets/dashboard/ConversionPipeline"
import PerformanceCharts from "@/components/widgets/dashboard/PerformanceCharts"
import DistributionPie from "@/components/widgets/dashboard/DistributionPie"
import ActivityLogs from "@/components/widgets/dashboard/ActivityLogs"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleRefreshSimulation = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 500)
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-6 space-y-6 antialiased text-xs select-none">
      
      {/* 1. EN-TÊTE FIXE COMPACT */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 flex-wrap gap-4 bg-transparent">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider font-mono">Vue d'ensemble</span>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Tableau de bord décisionnel</h2>
        </div>
        
        <button 
          type="button"
          onClick={handleRefreshSimulation}
          className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-md inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${isLoading ? "animate-spin" : ""}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* 2. SECTION KPI CARDS */}
      <KpiCards isLoading={isLoading} />

      {/* 3. 🚀 NOUVELLE SECTION : LE PIPELINE DE CONVERSION COMMERCIAL */}
      <ConversionPipeline />

      {/* 4. PERFORMANCE CHARTS (HISTOGRAMME / COURBE) */}
      <PerformanceCharts />

      {/* 5. BASE DES COMPTES (PIE / GRAPH ACTIVITÉ) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DistributionPie />
        <ActivityLogs />
      </div>

    </div>
  )
}
