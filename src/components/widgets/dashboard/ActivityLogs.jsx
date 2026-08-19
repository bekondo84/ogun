import React from "react"
import { Clock, CheckCircle2, AlertCircle, Landmark } from "lucide-react"

export default function ActivityLogs() {
  const fakeActivities = [
    { text: "Fiche client 'Société SABC' créée", time: "Il y a 10 min", icon: CheckCircle2, iconColor: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
    { text: "Importation de 125 lignes via Excel", time: "Il y a 1 heure", icon: Landmark, iconColor: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
    { text: "Alerte format numéro de téléphone", time: "Il y a 3 heures", icon: AlertCircle, iconColor: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
    { text: "Fiche #845 basculée en 'Gagné'", time: "Hier à 16:45", icon: CheckCircle2, iconColor: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" }
  ]

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 lg:col-span-2">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
        <Clock className="h-4 w-4 text-slate-400" />
        <span>Dernières opérations de la plateforme</span>
      </h3>
      <div className="flow-root pt-1">
        <ul className="-mb-8">
          {fakeActivities.map((activity, idx) => (
            <li key={idx}>
              <div className="relative pb-5">
                {idx !== fakeActivities.length - 1 && (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100 dark:bg-slate-800" />
                )}
                <div className="relative flex space-x-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ring-4 ring-white dark:ring-slate-900 ${activity.iconColor}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                    <p className="font-semibold text-slate-600 dark:text-slate-300">{activity.text}</p>
                    <span className="text-right text-[10px] text-slate-400 font-mono shrink-0">{activity.time}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
