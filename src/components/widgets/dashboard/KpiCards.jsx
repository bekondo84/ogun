import React from "react"
import { DollarSign, Users, TrendingUp, ShoppingBag, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function KpiCards({ isLoading }) {
  const fakeKpis = [
    { id: 1, label: "Chiffre d'Affaires", value: "45,280,000 FRS", change: "+12.5%", isPositive: true, icon: DollarSign, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" },
    { id: 2, label: "Nouveaux Clients", value: "1,240", change: "+8.2%", isPositive: true, icon: Users, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/30" },
    { id: 3, label: "Opportunités en Cours", value: "85", change: "-3.1%", isPositive: false, icon: TrendingUp, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30" },
    { id: 4, label: "Taux de Conversion", value: "64.2%", change: "+4.6%", isPositive: true, icon: ShoppingBag, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {fakeKpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <div key={kpi.id} className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3 transition-opacity ${isLoading ? "opacity-60" : "opacity-100 animate-in fade-in"}`}>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">{kpi.label}</span>
              <div className={`p-2 rounded-lg ${kpi.color}`}><Icon className="h-4 w-4" /></div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono tracking-tight">{kpi.value}</div>
              <div className="flex items-center gap-1 font-medium">
                <span className={kpi.isPositive ? "text-emerald-600 inline-flex items-center" : "text-rose-600 inline-flex items-center"}>
                  {kpi.isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />} {kpi.change}
                </span>
                <span className="text-slate-400 text-[10px]">vs mois dernier</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
