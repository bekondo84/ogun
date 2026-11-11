import React from "react"
import { BarChart3, TrendingUp } from "lucide-react"
import LineChart from "@/components/charts/LineChart"
import DoughnutChart from "@/components/charts/DoughnutChart"

export default function Charts() {
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
      
      {/* COMPOSANT 1 : HISTOGRAMME MENSUEL (Bar Chart) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <LineChart />                
      </div>

      {/* COMPOSANT 2 : COURBE DE TENDANCE (Line Chart SVG) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <DoughnutChart />
      </div>

    </div>
  )
}
