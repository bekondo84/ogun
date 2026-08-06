import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button" 
import { Input } from "@/components/ui/input"   
import { Trash2, Plus, Search } from "lucide-react"
import FieldLabel from "@/components/widgets/form/fields/FieldLabel"
import SearchMoreModal from "@/components/widgets/form/fields/SearchMoreModal"

export default function ManyToMany({ field, value = [], onChange, disabled }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const [metadata, setMetadata] = useState(null)

  useEffect( () => {
      setMetadata (field?.meta)
  }, [field, value])
  // Gérer la coche globale (Tout sélectionner / Tout désélectionner dans le tableau)
  const handleSelectAllRows = (e) => {
    if (e.target.checked) {
      setSelectedRowIds(value.map(item => item.id))
    } else {
      setSelectedRowIds([])
    }
  }

  // Gérer la coche d'une seule ligne
  const handleSelectRow = (id) => {
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  // Action : Ajouter des éléments (Callback de la Modal)
  const handleAddItems = (newItems) => {
    // Éviter les doublons lors de l'ajout
    const existingIds = value.map(item => item.id)
    const filteredNewItems = newItems.filter(item => !existingIds.includes(item.id))
    
    onChange(field, [...value, ...filteredNewItems])
  }

  // Action : Retirer les éléments sélectionnés du tableau
  const handleRemoveSelected = () => {
    const updatedList = value.filter(item => !selectedRowIds.includes(item.id))
    onChange(field, updatedList)
    setSelectedRowIds([]) // Réinitialiser la sélection
  }

   const onSearch = async (field, searchText, size) => {
         if (field && field.meta) {
             let meta = field.meta
             let predicates = []
             if (searchText && searchText.length > 0) {
                predicates = [{fieldName:'stringValue', label:'stringValue', type:'java.lang.String', value: searchText, cond: 'LIKE'}] 
             }
             const response = await executedPostMethod(meta.action, "fetchitems", {
                startIndex: 0,
                pageSize: size,
                class: meta.type,
                predicates: predicates
             })
             
            //console.log('--------onSearch = async (field, searchText, size) ---------- : '+' searchText :  '+searchText+' ----------- '+JSON.stringify(suggestions)+'-------- '+suggestions.length)
            return response.data 
         }
    }

  // Extraire les colonnes à afficher depuis les métadonnées de la relation
  const columns = metadata?.fields || [{ fieldName: "id", label: "ID" }, { fieldName: "displayName", label: "Libellé" }]

  return (
    <div className="flex flex-col w-full space-y-3">
      {/* Entête avec Label à gauche et Actions à droite */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
        <FieldLabel id={field.fieldName} label={field.label} required={field.mandatory} />
        
        {!disabled && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700 bg-purple-50 dark:bg-purple-950/30 px-2.5 py-1 rounded"
            >
              <Plus className="h-3.5 w-3.5" /> Ajouter
            </button>
            
            <button
              type="button"
              disabled={selectedRowIds.length === 0}
              onClick={handleRemoveSelected}
              className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/30 px-2.5 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-3.5 w-3.5" /> Retirer ({selectedRowIds.length})
            </button>
          </div>
        )}
      </div>

      {/* Tableau de Données Structuré */}
      <div className="w-full overflow-x-auto border border-slate-100 rounded-md dark:border-slate-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium border-b border-slate-100 dark:border-slate-800">
              {!disabled && (
                <th className="p-2 w-10 text-center">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAllRows}
                    checked={value.length > 0 && selectedRowIds.length === value.length}
                    className="rounded border-slate-300 accent-purple-600"
                  />
                </th>
              )}
              {columns.map(col => (
                <th key={col.fieldName} className="p-2 font-semibold uppercase tracking-wider text-slate-400">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {value.map((item) => (
              <tr 
                key={item.id}
                className="border-b border-slate-50 dark:border-slate-800/40 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
              >
                {!disabled && (
                  <td className="p-2 text-center">
                    <input 
                      type="checkbox"
                      checked={selectedRowIds.includes(item.id)}
                      onChange={() => handleSelectRow(item.id)}
                      className="rounded border-slate-300 accent-purple-600"
                    />
                  </td>
                )}
                {columns.map(col => (
                  <td key={col.fieldName} className="p-2 text-slate-700 dark:text-slate-300">
                    {/* Gestion de l'affichage des valeurs primitives ou objets */}
                    {typeof item[col.fieldName] === 'object' ? JSON.stringify(item[col.fieldName]) : String(item[col.fieldName] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
            
            {value.length === 0 && (
              <tr>
                <td colSpan={columns.length + (disabled ? 0 : 1)} className="p-6 text-center text-slate-400 italic">
                  Aucun élément lié. Cliquez sur "Ajouter" pour enrichir la liste.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Sélection Avancée */}
      <SearchMoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        field={field}
        onSearch={onSearch}
        onValidate={handleAddItems}
        metadata={metadata}
      />
    </div>
  )
}
