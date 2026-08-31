import React from "react"
import { DollarSign, Users, TrendingUp, ShoppingBag, ArrowUpRight, ArrowDownRight } from "lucide-react"
import KpiCard from "./KpiCard"

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
        return (
          <KpiCard isLoading={isLoading} kpi={kpi} />
        )
      })}
    </div>
  )
}
