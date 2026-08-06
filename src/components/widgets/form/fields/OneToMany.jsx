import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit2 } from "lucide-react"
import FieldLabel from "@/components/widgets/form/fields/FieldLabel"
import FormPageModal from "@/components/widgets/form/fields/FormPageModal"
import { executedPostMethod } from "@/axios/DataService"
import { getMetaFromTypeCode } from "@/axios/MetaService"

export default function OneToMany({ field, value = [], onChange, disabled }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null) // null = création, number = édition d'une ligne
  const [selectedRowIndexes, setSelectedRowIndexes] = useState([])
  const [item, setItem] = useState(null)
  const [metadata, setMetadata] = useState(null)
  const [columns, setColumns] = useState([])

  useEffect(() => {
       setMetadata(field?.meta || null)
       setColumns(metadata?.listView?.columns?.filter(col => col.show) || [])
  }, [field, value])
  //const metadata = field?.meta || null
  //const columns = metadata?.listView?.columns?.filter(col => col.show) || []

  const onSearch = () => {
    
  }

  // Gérer la coche globale
  const handleSelectAllRows = (e) => {
    if (e.target.checked) {
      setSelectedRowIndexes(value.map((_, index) => index))
    } else {
      setSelectedRowIndexes([])
    }
  }

  // Gérer la coche unique
  const handleSelectRow = (index) => {
    setSelectedRowIndexes(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  // Action : Enregistrer une ligne (Création ou Modification)
  const handleSaveItem = (itemData) => {
    let updatedList = [...value]
    if (editingIndex !== null) {
      // Mode Édition
      updatedList[editingIndex] = itemData
    } else {
      // Mode Création : Générer un ID temporaire si inexistant pour le composant React
      const newItem = { ...itemData, id: itemData.id || `tmp_${Date.now()}` }
      updatedList.push(newItem)
    }
    onChange(field, updatedList)
    setIsModalOpen(false)
    setEditingIndex(null)
  }

  // Action : Retirer les lignes cochées du tableau
  const handleRemoveSelected = () => {
    const updatedList = value.filter((_, index) => !selectedRowIndexes.includes(index))
    onChange(field, updatedList)
    setSelectedRowIndexes([])
  }

  const handleNewItem = async() => {
    if (metadata) {
        try {
             const response = await executedPostMethod(metadata.action, "create", {
               class: metadata.type
             })      
             const meta = await getMetaFromTypeCode(metadata.typeCode)
            setItem(response.data)
            
            if (meta) {
              setMetadata(meta)
            }
           // console.log('-----------------------------Metadata : '+JSON.stringify(meta))
            setEditingIndex(index)
             setIsModalOpen(true)
       } catch (error) {
           console.error("Erreur de récupération :", error);
       } finally {

       }
    }
       
  }
  //console.log('--------OneToMany --------------------- '+JSON.stringify(metadata))
  //const columns = metadata?.fields || []

  return (
    <div className="flex flex-col w-full space-y-3">
      {/* Barre d'outils supérieure */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
        <FieldLabel id={field.fieldName} label={field.label} required={field.mandatory} />
        
        {!disabled && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => { setEditingIndex(null); setIsModalOpen(true); }}
              className="h-8 text-xs font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 border-none gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={selectedRowIndexes.length === 0}
              onClick={handleRemoveSelected}
              className="h-8 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 border-none gap-1 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />  ({selectedRowIndexes.length})
            </Button>
          </div>
        )}
      </div>

      {/* Conteneur Grille / Tableau */}
      <div className="w-full overflow-x-auto border border-slate-100 rounded-md dark:border-slate-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium border-b border-slate-100 dark:border-slate-800">
              {!disabled && (
                <th className="p-2.5 w-10 text-center">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAllRows}
                    checked={value.length > 0 && selectedRowIndexes.length === value.length}
                    className="rounded border-slate-300 accent-purple-600 cursor-pointer"
                  />
                </th>
              )}
              {columns.map(col => (
                <th key={col.fieldName} className="p-2.5 font-semibold uppercase tracking-wider text-slate-400">
                  {col.label}
                </th>
              ))}
              {!disabled && <th className="p-2.5 w-12 text-center"></th>}
            </tr>
          </thead>
          <tbody>
            {value?.map((item, index) => (
              <tr 
                key={item.id || index}
                className="border-b border-slate-50 dark:border-slate-800/40 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
              >
                {!disabled && (
                  <td className="p-2.5 text-center">
                    <input 
                      type="checkbox"
                      checked={selectedRowIndexes.includes(index)}
                      onChange={() => handleSelectRow(index)}
                      className="rounded border-slate-300 accent-purple-600 cursor-pointer"
                    />
                  </td>
                )}
                {columns.map(col => (
                  <td key={col.fieldName} className="p-2.5 text-slate-700 dark:text-slate-300">
                    {/* Formatage propre si la valeur est une date complexe */}
                    {typeof item[col.fieldName] === 'string' && item[col.fieldName].includes('T') && item[col.fieldName].length > 16
                      ? item[col.fieldName].substring(0, 16).replace('T', ' ')
                      : String(item[col.fieldName] ?? '')}
                  </td>
                ))}
                {!disabled && (
                  <td className="p-2.5 text-center">
                    <button
                      type="button"
                      onClick={handleNewItem}
                      className="text-slate-400 hover:text-purple-600 transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            
            {value.length === 0 && (
              <tr>
                <td colSpan={columns.length + (disabled ? 0 : 2)} className="p-6 text-center text-slate-400 italic">
                  Aucun élément dans la table. Cliquez sur "Ajouter une ligne".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal du Formulaire d'édition dynamique */}
      <FormPageModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingIndex(null); }}
        metadata={metadata}
        initialData={handleNewItem}
        onSave={handleSaveItem}
        onSearch={onSearch}
        
      />
    </div>
  )
}