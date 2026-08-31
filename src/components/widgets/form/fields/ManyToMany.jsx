import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button" 
import { Input } from "@/components/ui/input"   
import { Trash2, Plus, Search } from "lucide-react"
import FieldLabel from "@/components/widgets/form/fields/FieldLabel"
import SearchMoreModal from "@/components/widgets/form/fields/SearchMoreModal"
import { TableView } from "../../list"
import { toast } from "sonner"

export default function ManyToMany({ field, value = [], onChange, disabled }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const [metadata, setMetadata] = useState(null)
  const [columns, setColumns] = useState([])
  const [sortConfig, setSortConfig] = useState({})

  useEffect( () => {
      const meta = field?.meta || {}
      const columns = meta?.listView?.columns.filter(col => col.show) || []
      setMetadata (meta)
      setColumns(columns)
      //console.log('------------------------ : '+field)
  }, [field, value])

  const handleSort = (columnKey) => {
  
  }

  const handleSelect = (item) => {
    // setSelectedItem(item)
    //setInputValue(item.stringValue)
    //onChange(field, item)   
  }

  const handleSubmit = (data) => {
      console.log('***************************** : '+JSON.stringify(data))
      let updatedList = [...value]
      if (data && data.length > 0 ) {
        data.forEach(i => {
            let index = updatedList.findIndex(v => v.seqnumber === i.seqnumber)
            if (index >= 0 ) {
                updatedList[index] = i
            } else {
              updatedList.push(i)
            }
        })
      }
      onChange(field, updatedList)
      setIsOpen(false)
      setIsModalOpen(false)
  }

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
    const updatedList = value.filter(item => !selectedRowIds.includes(item.seqnumber))
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
                typeCode: meta.typeCode,
                predicates: predicates
             })
             
            //console.log('--------onSearch = async (field, searchText, size) ---------- : '+' searchText :  '+searchText+' ----------- '+JSON.stringify(suggestions)+'-------- '+suggestions.length)
            return response.data 
         }
    }

  // Extraire les colonnes à afficher depuis les métadonnées de la relation
  //const columns = metadata?.fields || [{ fieldName: "id", label: "ID" }, { fieldName: "displayName", label: "Libellé" }]

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
              <Plus className="h-3.5 w-3.5" />
            </button>
            
            <button
              type="button"
              disabled={selectedRowIds.length === 0}
              onClick={handleRemoveSelected}
              className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/30 px-2.5 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-3.5 w-3.5" /> ({selectedRowIds.length})
            </button>
          </div>
        )}
      </div>

      {/* Tableau de Données Structuré */}
      <div className="w-full overflow-x-auto border border-slate-100 rounded-md dark:border-slate-800">
        <TableView 
              columns={columns}
              data={value} // On injecte les données triées
              selectedIds={selectedRowIds}
              sortConfig={sortConfig}
              onSort={handleSort}
              onToggleSelectAll={() => setSelectedRowIds(selectedRowIds.length === value.length ? [] : value.map(i => i.seqnumber))}
              onToggleSelectRow={(id) => {setSelectedRowIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}}
              onRowClick={(id) => handleSelectRow(id)}
              onlineEditable={false}
              />
      </div>

      {/* Modal de Sélection Avancée */}
      <SearchMoreModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              meta={field?.meta}
              initialCriteria={inputValue} // On passe la saisie en cours à la modal
              onSearch={onSearch}
              onSelect={handleSelect}
              isSelectable={true}
              onSave={handleSubmit}
            />
    </div>
  )
}
