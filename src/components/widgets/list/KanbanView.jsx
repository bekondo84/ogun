import React from "react"
import { Checkbox } from "@/components/ui/checkbox"

export default function KanbanView({ data, selectedIds, onToggleSelectRow, onCardClick }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data.map((item) => {
        const isSelected = selectedIds.includes(item.id)
        
        return (
          <div
            key={item.id}
            onDoubleClick={() => onCardClick(item.id)}
            className={`relative bg-white dark:bg-slate-900 border rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-36 ${
              isSelected ? "border-purple-600 ring-1 ring-purple-100" : "border-slate-200 dark:border-slate-800"
            }`}
          >
            <div 
              className={`absolute top-3 right-3 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelectRow(item.id)} />
            </div>

            <div className="space-y-1 pr-6">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-purple-700 transition-colors">
                {item.company}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{item.contact}</p>
              <p className="text-[11px] text-slate-400 font-mono">{item.email}</p>
            </div>

            <div className="pt-2 border-t border-slate-50 dark:border-slate-800 flex justify-end">
              <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-0.5 rounded-full">
                {Number(item.value).toLocaleString("fr-FR")} €
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}