import React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"

export default function TableView({ 
  columns, 
  data, 
  selectedIds, 
  onToggleSelectAll, 
  onToggleSelectRow, 
  onRowClick,
  sortConfig,
  onSort    
}) {
  const isAllSelected = data.length > 0 && selectedIds.length === data.length

  return (
    // ✨ CORRECTION ET ERGONOMIE MOBILE : "overflow-x-auto" active le scroll tactile horizontal
    <div className="w-full overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm scrollbar-thin">
      
      {/* ✨ CORRECTION "min-w-[700px]" : Empêche les colonnes de s'écraser et garantit l'espace nécessaire au scroll */}
      <table className="w-full min-w-[700px] text-left border-collapse text-xs select-none table-fixed">
        
        {/* En-tête */}
        <thead className="bg-slate-50/70 dark:bg-slate-950/40 backdrop-blur-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold tracking-wide">
          <tr>
            <th className="p-3.5 w-12 text-center align-middle">
              <Checkbox checked={isAllSelected} onCheckedChange={onToggleSelectAll} />
            </th>
            {columns.map((col) => {
              const isSorted = sortConfig?.key === col.key
              const isAsc = sortConfig?.direction === "asc"
              
              return (
                <th 
                  key={col.key} 
                  onClick={() => col.sortable && onSort(col.key)}
                  className={`p-3.5 align-middle font-semibold transition-colors ${
                    col.sortable ? "cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white" : ""
                  } ${col.align === "right" ? "text-right" : "text-left"}`}
                  // Permet de respecter les largeurs personnalisées configurées dans les métadonnées
                  style={{ width: col.width || "auto" }}
                >
                  <div className={`flex items-center gap-1.5 ${col.align === "right" ? "justify-end" : "justify-start"}`}>
                    <span>{col.label}</span>
                    {col.sortable && (
                      <span className="text-slate-400 dark:text-slate-500 shrink-0">
                        {isSorted ? (
                          isAsc ? <ArrowUp className="h-3.5 w-3.5 text-purple-700 dark:text-purple-400" /> : <ArrowDown className="h-3.5 w-3.5 text-purple-700 dark:text-purple-400" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-40" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        
        {/* Corps */}
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300 font-medium">
          {data.map((row) => {
            const isSelected = selectedIds.includes(row.id)
            
            return (
              <tr 
                key={row.id} 
                onDoubleClick={() => onRowClick(row.id)}
                className={`transition-colors cursor-pointer group/row ${
                  isSelected 
                    ? "bg-purple-50/40 dark:bg-purple-950/10 hover:bg-purple-50/60 dark:hover:bg-purple-950/20" 
                    : "hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                }`}
              >
                <td className="p-3.5 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelectRow(row.id)} />
                </td>
                {columns.map((col) => {
                  const cellValue = row[col.key]
                  return (
                    <td 
                      key={col.key} 
                      className={`p-3.5 align-middle truncate ${col.align === "right" ? "text-right" : "text-left"} ${col.className || ""}`}
                    >
                      {col.render ? col.render(cellValue, row) : cellValue}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>

      </table>
    </div>
  )
}