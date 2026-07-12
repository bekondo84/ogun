import React from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

export default function RelationTable({ field, value = [], onChange, disabled }) {
  const { id, label, relationColumns = [] } = field

  const handleAddRow = () => {
    const newRow = relationColumns.reduce((acc, col) => ({ ...acc, [col.key]: "" }), { id: Date.now() })
    onChange(id, [...value, newRow])
  }

  const handleRemoveRow = (rowId) => {
    onChange(id, value.filter(row => row.id !== rowId))
  }

  const handleCellChange = (rowId, colKey, cellVal) => {
    onChange(id, value.map(row => row.id === rowId ? { ...row, [colKey]: cellVal } : row))
  }

  return (
    <div className="w-full col-span-2 space-y-2 border border-slate-100 dark:border-slate-800 p-4 rounded-xl bg-white dark:bg-slate-900 shadow-inner">
      <div className="flex items-center justify-between border-b pb-2">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{label}</span>
        {!disabled && (
          <Button type="button" onClick={handleAddRow} size="sm" variant="outline" className="h-7 text-[11px] font-semibold gap-1 text-purple-700 border-purple-200 hover:bg-purple-50">
            <Plus className="h-3 w-3" /> Ajouter une ligne
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b text-slate-400 font-semibold bg-slate-50/50 dark:bg-slate-950/20">
              {relationColumns.map(col => <th key={col.key} className="p-2">{col.label}</th>)}
              {!disabled && <th className="p-2 w-10 text-center"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {value.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/40">
                {relationColumns.map((col) => (
                  <td key={col.key} className="p-1">
                    <input
                      type={col.type || "text"}
                      value={row[col.key] || ""}
                      disabled={disabled}
                      onChange={(e) => handleCellChange(row.id, col.key, e.target.value)}
                      className="w-full bg-transparent border-none p-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-950 rounded"
                    />
                  </td>
                ))}
                {!disabled && (
                  <td className="p-1 text-center">
                    <button type="button" onClick={() => handleRemoveRow(row.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}