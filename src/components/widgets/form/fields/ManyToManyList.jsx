import React from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

export default function ManyToManyList({ field, value = [], onChange, disabled }) {
  const { id, label, relationColumns = [] } = field

  // Ajouter une nouvelle ligne avec des valeurs vides basées sur les colonnes configurées
  const handleAddRow = () => {
    const newRow = relationColumns.reduce(
      (acc, col) => ({ ...acc, [col.key]: "" }), 
      { id: `new_${Date.now()}` } // ID unique temporaire
    )
    onChange(id, [...value, newRow])
  }

  // Supprimer une ligne spécifique
  const handleRemoveRow = (rowId) => {
    onChange(id, value.filter(row => row.id !== rowId))
  }

  // Mettre à jour une cellule spécifique à la saisie
  const handleCellChange = (rowId, colKey, cellVal) => {
    onChange(id, value.map(row => row.id === rowId ? { ...row, [colKey]: cellVal } : row))
  }

  return (
    <div className="w-full col-span-2 space-y-3 mt-4 border border-slate-200/60 dark:border-slate-800 p-4 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
      
      {/* En-tête du sous-tableau style Odoo List View Section */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label}
        </span>
        {!disabled && (
          <Button 
            type="button" 
            onClick={handleAddRow} 
            size="sm" 
            variant="outline" 
            className="h-7 text-[10px] font-bold gap-1 text-purple-700 border-purple-200 hover:bg-purple-50 dark:border-slate-700 dark:text-purple-400 dark:hover:bg-purple-950/30 cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Ajouter une ligne
          </Button>
        )}
      </div>

      {/* Structure du tableau scrollable horizontalement sur mobile */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold bg-slate-50/50 dark:bg-slate-950/20">
              {relationColumns.map((col) => (
                <th key={col.key} className="p-2 font-semibold">{col.label}</th>
              ))}
              {!disabled && <th className="p-2 w-10 text-center"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {value.length > 0 ? (
              value.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors">
                  {relationColumns.map((col) => (
                    <td key={col.key} className="p-1">
                      <input
                        type={col.type || "text"}
                        value={row[col.key] || ""}
                        placeholder="Saisir..."
                        disabled={disabled}
                        onChange={(e) => handleCellChange(row.id, col.key, e.target.value)}
                        className="w-full bg-transparent border-none p-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-950 rounded transition-colors border-b border-transparent focus:border-purple-600"
                      />
                    </td>
                  ))}
                  {!disabled && (
                    <td className="p-1 text-center align-middle">
                      <button 
                        type="button" 
                        onClick={() => handleRemoveRow(row.id)} 
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={relationColumns.length + (disabled ? 0 : 1)} className="p-4 text-center text-slate-400 italic">
                  Aucun élément enregistré. Cliquez sur "Ajouter une ligne" pour commencer.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}