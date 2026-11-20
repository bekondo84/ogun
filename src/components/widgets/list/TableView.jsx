import React, { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUp, ArrowDown, ArrowUpDown, Edit2 } from "lucide-react"
import { fieldValue } from "@/utils/FieldUtils"
import TableImageCell from "../form/fields/TableImageCell"
import { combovalues } from "@/axios/DataService"

export default function TableView({ 
  metadata,
  columns = [], 
  setColumns,
  data = [], 
  selectedIds = [], 
  onToggleSelectAll, 
  onToggleSelectRow, 
  onRowClick,
  sortConfig,
  onSort,    
  isSelectable = true,
  onlineEditable = false
}) {
  const [selectValues, setSelectValues] = useState([]) 
  const [activecolumns, setActivecolumns] = useState([])

  useEffect(() => {
    const visibleCols = columns?.filter(col => col.show) || []
    setActivecolumns(visibleCols)
    if (metadata?.typeCode && visibleCols.length > 0) {
      buildSelectValues(visibleCols)
    }
  }, [columns, metadata])

  const buildSelectValues = async (cols) => {
    const rows = cols.filter(col => col.widget === "combobox")
    const result = []

    for (const row of rows) {
      try {
        const values = await combovalues(metadata.typeCode, row)
        result.push({
          field: row.fieldName,
          values: values || {}
        })
      } catch (e) {
        // Fallback silencieux si la liste de valeurs échoue
      }
    }
    setSelectValues(result)
  }

  const getComboxValue = (fieldName, id) => {
    const item = selectValues?.find(it => it.field === fieldName)
    if (item && item.values && item.values[id] !== undefined) {
      return item.values[id]
    }
    return id
  }

  const safeData = Array.isArray(data) ? data : []
  const safeSelectedIds = Array.isArray(selectedIds) ? selectedIds : []
  const isAllSelected = safeData.length > 0 && safeSelectedIds.length === safeData.length

  const totalColSpan =
    activecolumns.length + (isSelectable ? 1 : 0) + (onlineEditable ? 1 : 0)

  const checkboxAccentClasses =
    "h-4 w-4 rounded-[4px] cursor-pointer transition-all border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-[var(--brand-primary)] dark:hover:border-[var(--brand-primary-dark)] data-[state=checked]:bg-[var(--brand-primary)] dark:data-[state=checked]:bg-[var(--brand-primary-dark)] data-[state=checked]:border-[var(--brand-primary)] dark:data-[state=checked]:border-[var(--brand-primary-dark)] data-[state=checked]:text-white dark:data-[state=checked]:text-slate-950 focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/30"

  return (
    <div className="w-full overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
      <table className="w-full min-w-[800px] text-left border-collapse text-xs select-none table-auto">
        
        {/* En-tête */}
        <thead className="bg-slate-50/80 dark:bg-slate-950/50 backdrop-blur-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold tracking-wide">
          <tr>
            {isSelectable && (
              <th className="p-3.5 w-[48px] min-w-[48px] max-w-[48px] text-center align-middle">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={onToggleSelectAll}
                  className={checkboxAccentClasses}
                />
              </th>            
            )}

            {activecolumns.map((col, colIdx) => {
              const isSorted = sortConfig?.key === col.fieldName
              const isAsc = sortConfig?.direction === "asc"
              
              return (
                <th 
                  key={col.fieldName ?? colIdx} 
                  onClick={() => col.sortable && onSort?.(col.fieldName)}
                  className={`p-3.5 align-middle font-semibold transition-colors ${
                    col.sortable
                      ? "cursor-pointer hover:bg-[var(--brand-soft)]/50 dark:hover:bg-[var(--brand-soft-dark)]/40 hover:text-[var(--brand-primary)] dark:hover:text-[var(--brand-primary-dark)]"
                      : ""
                  } ${
                    isSorted
                      ? "text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] bg-[var(--brand-soft)]/30 dark:bg-[var(--brand-soft-dark)]/20"
                      : ""
                  } ${col.align === "right" ? "text-right" : "text-left"}`}
                  style={{ width: col.width || "auto" }}
                >
                  <div className={`flex items-center gap-1.5 ${col.align === "right" ? "justify-end" : "justify-start"}`}>
                    <span className="whitespace-nowrap">{col.label}</span>
                    {col.sortable && (
                      <span className="shrink-0">
                        {isSorted ? (
                          isAsc ? (
                            <ArrowUp className="h-3.5 w-3.5 text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)]" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5 text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)]" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-400 dark:text-slate-500 opacity-40" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              )
            })}

            {onlineEditable && (
              <th className="p-3.5 w-[48px] text-center align-middle" />
            )}
          </tr>
        </thead>
        
        {/* Corps du tableau */}
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300 font-medium">
          {safeData.map((row, rowIdx) => {
            const rowId = row.seqnumber ?? row.id ?? rowIdx
            const isSelected = safeSelectedIds.includes(rowId)
            
            return (
              <tr 
                key={rowId} 
                onDoubleClick={() => onRowClick?.(row)}
                className={`transition-colors cursor-pointer group/row ${
                  isSelected 
                    ? "bg-[var(--brand-soft)]/60 dark:bg-[var(--brand-soft-dark)]/60 hover:bg-[var(--brand-soft)] dark:hover:bg-[var(--brand-soft-dark)]" 
                    : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                }`}
              >
                {isSelectable && (
                  <td
                    className={`p-3.5 text-center align-middle relative ${
                      isSelected ? "shadow-[inset_3px_0_0_0_var(--brand-primary)] dark:shadow-[inset_3px_0_0_0_var(--brand-primary-dark)]" : ""
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelectRow?.(rowId)}
                      className={checkboxAccentClasses}
                    />
                  </td>                
                )}

                {activecolumns.map((col, colIdx) => {
                  const cellValue = fieldValue(col, row)
                  return (
                    <td 
                      key={col.seqnumber ?? col.fieldName ?? colIdx} 
                      className={`p-3.5 align-middle ${col.widget === "number" ? "text-right" : "text-left"} ${col.className || ""}`}
                      style={{ maxWidth: col.width || "300px" }}
                    >
                      <div className="truncate block">
                        {col.render ? (
                          col.render(cellValue, row)
                        ) : col.widget === "checkbox" ? (
                          <input 
                            type="checkbox" 
                            checked={!!cellValue}
                            disabled
                            className="rounded border-slate-300 dark:border-slate-700 text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] h-3.5 w-3.5 cursor-not-allowed accent-[var(--brand-primary)] dark:accent-[var(--brand-primary-dark)]"
                          />
                        ) : col.widget === "switch" ? (
                          <div
                            className={`relative inline-flex h-4 w-7 shrink-0 cursor-not-allowed items-center rounded-full transition-colors duration-200 ${
                              cellValue
                                ? "bg-[var(--brand-primary)] dark:bg-[var(--brand-primary-dark)]"
                                : "bg-slate-200 dark:bg-slate-700"
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white dark:bg-slate-950 shadow-2xs transition duration-200 ${
                                cellValue ? "translate-x-3.5" : "translate-x-0.5"
                              }`}
                            />
                          </div>
                        ) : col.widget === "image" || col.widget === "media" ? (
                          <TableImageCell value={cellValue} />
                        ) : col.widget === "combobox" ? (
                          String(getComboxValue(col.fieldName, cellValue) ?? "")
                        ) : col.widget === "password" ? (
                          "••••••••"
                        ) : (
                          String(cellValue ?? "")
                        )}
                      </div>
                    </td>
                  )
                })}

                {onlineEditable && (
                  <td className="p-2.5 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onRowClick?.(row)}
                      title="Modifier la ligne"
                      className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-[var(--brand-primary)] dark:hover:text-[var(--brand-primary-dark)] hover:bg-[var(--brand-soft)] dark:hover:bg-[var(--brand-soft-dark)] transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            )
          })}

          {safeData.length === 0 && (
            <tr>
              <td
                colSpan={Math.max(totalColSpan, 1)}
                className="p-8 text-center text-slate-400 dark:text-slate-500 italic"
              >
                Aucun élément dans la table. Cliquez sur "Ajouter".
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}