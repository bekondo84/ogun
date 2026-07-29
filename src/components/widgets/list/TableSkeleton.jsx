import React from "react"

export default function TableSkeleton({ rowsCount = 5, colsCount = 4 }) {
  // Crée des tableaux fictifs pour boucler sur le nombre de lignes et colonnes
  const rows = Array(rowsCount).fill(0)
  const cols = Array(colsCount).fill(0)

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden animate-pulse">
      {/* En-tête du squelette */}
      <div className="h-11 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-4">
        <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded" /> {/* Checkbox */}
        {cols.map((_, i) => (
          <div key={i} className="h-3 bg-slate-200 dark:bg-slate-800 rounded flex-1" />
        ))}
      </div>
      
      {/* Lignes du squelette */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {rows.map((_, rowIndex) => (
          <div key={rowIndex} className="h-12 flex items-center px-4 gap-4">
            <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded" /> {/* Checkbox */}
            {cols.map((_, colIndex) => {
              // Donne des largeurs différentes aux cellules pour faire plus réaliste
              const widths = ["w-3/4", "w-1/2", "w-5/6", "w-2/3"]
              const randomWidth = widths[colIndex % widths.length]
              
              return (
                <div key={colIndex} className="flex-1">
                  <div className={`h-3 bg-slate-100 dark:bg-slate-800/60 rounded ${randomWidth}`} />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}