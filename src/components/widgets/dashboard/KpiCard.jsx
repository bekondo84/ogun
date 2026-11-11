import React from "react"
import {icons, DollarSign, Users, TrendingUp, ShoppingBag, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function KpiCard ({ isLoading, kpi }) {

    const Icon = icons[kpi.icon] ??  null       
    const Color = kpi.color ?? null

    return (
          <div key={kpi.id} className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3 transition-opacity ${isLoading ? "opacity-60" : "opacity-100 animate-in fade-in"}`}>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">{kpi.label}</span>
              <div className={`p-2 rounded-lg ${Color}`}>{Icon && <Icon className="h-4 w-4" />}</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono tracking-tight">{kpi.value}</div>
              {kpi.change &&
                <div className="flex items-center gap-1 font-medium">
                  <span className={kpi.change ? "text-emerald-600 inline-flex items-center" : "text-rose-600 inline-flex items-center"}>
                    {kpi.change >= 0 ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />} {kpi.change}
                  </span>
                  <span className="text-slate-400 text-[10px]">{kpi.scope}</span>
                </div>}
            </div>
          </div>
        )
}