import React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUp, ArrowDown, ArrowUpDown, Edit2 } from "lucide-react"
import { fieldValue } from "@/utils/FieldUtils"
import TableImageCell from "../form/fields/TableImageCell"


export default function TableView({ 
  columns, 
  data, 
  selectedIds, 
  onToggleSelectAll, 
  onToggleSelectRow, 
  onRowClick,
  sortConfig,
  onSort,    
  isSelectable=true,
  onlineEditable = false
}) {

  
  const isAllSelected = data?.length > 0 && selectedIds?.length == data?.length

  return (
    // CONTENEUR GLOBAL : Gère le défilement horizontal fluide sur petit écran
    <div className="w-full overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      
      {/* CORRECTION 'table-auto' : Laisse le navigateur calculer l'espace nécessaire et évite la superposition */}
      <table className="w-full min-w-[800px] text-left border-collapse text-xs select-none table-auto">
        
        {/* En-tête */}
        <thead className="bg-slate-50/70 dark:bg-slate-950/40 backdrop-blur-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold tracking-wide">
          <tr>
            {/* Colonne Checkbox avec taille fixe stricte en px */}
            {isSelectable && (
                 <th className="p-3.5 w-[48px] min-w-[48px] max-w-[48px] text-center align-middle">
                  <Checkbox checked={isAllSelected} onCheckedChange={onToggleSelectAll} />
                </th>            
            )}
            {columns.map((col) => {
              const isSorted = sortConfig?.key === col.fieldName
              const isAsc = sortConfig?.direction === "asc"
              
              return (
                <th 
                  key={col.fieldName} 
                  onClick={() => col.sortable && onSort(col.fieldName)}
                  className={`p-3.5 align-middle font-semibold transition-colors ${
                    col.sortable ? "cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white" : ""
                  } ${col.align === "right" ? "text-right" : "text-left"}`}
                  // Utilise col.width si fourni, sinon laisse libre
                  style={{ width: col.width || "auto" }}
                >
                  <div className={`flex items-center gap-1.5 ${col.align === "right" ? "justify-end" : "justify-start"}`}>
                    <span className="whitespace-nowrap">{col.label}</span>
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
        
        {/* Corps du tableau */}
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300 font-medium">
          {data?.map((row) => {
            const isSelected = selectedIds.includes(row.seqnumber)
            
            return (
              <tr 
                key={row.seqnumber} 
                onDoubleClick={() => onRowClick(row)}
                className={`transition-colors cursor-pointer group/row ${
                  isSelected 
                    ? "bg-purple-50/40 dark:bg-purple-950/10 hover:bg-purple-50/60 dark:hover:bg-purple-950/20" 
                    : "hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                }`}
              >
                {isSelectable && (
                   <td className="p-3.5 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelectRow(row.seqnumber)} />
                  </td>                
                )}
                {columns.map((col) => {
                  const cellValue =  fieldValue(col, row)//row[col.fieldName]===null ? row[col.fieldName] : (typeof row[col.fieldName] === 'object' ? row[col.fieldName]['stringValue'] : row[col.fieldName])
                  return (
                    <td 
                      key={col.seqnumber} 
                      className={`p-3.5 align-middle ${col.widget === 'number' ? "text-right" : "text-left"} ${col.className || ""}`}
                      style={{ maxWidth: col.width || "300px" }}
                    >
                      <div className="truncate block">
                        {col.render ? (
                          col.render(cellValue, row)
                        ) : col.widget === 'checkbox' ? (
                          <input 
                            type="checkbox" 
                            checked={!!cellValue} // Convertit en booléen strict
                            disabled // Lecture seule dans le tableau
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 h-3.5 w-3.5 cursor-not-allowed accent-purple-600"
                          />
                        ) : col.widget === 'switch' ? (
                          <div className={`relative inline-flex h-4 w-7 shrink-0 cursor-not-allowed items-center rounded-full transition-colors duration-200 ${cellValue ? 'bg-purple-600' : 'bg-slate-200'}`}>
                            <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition duration-200 ${cellValue ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                          </div>
                        ) : col.widget === 'image' || col.widget === 'media' ? (
                            <div className={`relative inline-flex h-4 w-7 shrink-0 cursor-not-allowed items-center rounded-full transition-colors duration-200 ${cellValue ? 'bg-purple-600' : 'bg-slate-200'}`}>
                              <TableImageCell value={cellValue} />
                           </div>
                        ): (
                          // Valeur textuelle par défaut (chaîne, date, nombre, etc.)
                          String(cellValue ?? '')
                        )}
                      </div>
                  </td>

                  )
                })}
                {onlineEditable && (
                  <td className="p-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => onRowClick(row)}
                      className="text-slate-400 hover:text-purple-600 transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            )
          })}
          {data?.length === 0 && (
              <tr>
                <td colSpan={columns.length } className="p-6 text-center text-slate-400 italic">
                  Aucun élément dans la table. Cliquez sur "Ajouter une ligne".
                </td>
              </tr>
            )}
        </tbody>

      </table>
    </div>
  )
}