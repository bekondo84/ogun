import React from "react"
import { DollarSign, Users, TrendingUp, ShoppingBag, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function KpiCard ({ isLoading, kpi }) {

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
}