import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit2 } from "lucide-react"
import FieldLabel from "@/components/widgets/form/fields/FieldLabel"
import FormPageModal from "@/components/widgets/form/fields/FormPageModal"
import { executedPostMethod } from "@/axios/DataService"
import { getMetaFromTypeCode } from "@/axios/MetaService"
import { TableView } from "../../list"
import { toast } from "sonner"

export default function OneToMany({ field, value = [], onChange, disabled }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null) // null = création, number = édition d'une ligne
  const [selectedRowIndexes, setSelectedRowIndexes] = useState([])
  const [formData, setFormData] = useState({})
  const [metadata, setMetadata] = useState(null)
  const [columns, setColumns] = useState([])
  //const [selectedIds, setSelectedIds] = useState([])
  const [sortConfig, setSortConfig] = useState({})

  useEffect(() => {
       const meta = field?.meta || null
       setMetadata(meta)
       setColumns(meta?.listView?.columns?.filter(col => col.show) || [])
       fetchMeta(meta)
      // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! '+JSON.stringify(meta?.listView?.columns?.filter(col => col.show)))
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
  const handleSelectRow = (row) => {
     setFormData(row)
     setEditingIndex(null)
     setIsModalOpen(true)
  }

  const onToggleSelectRow = () => {
     
  }

  const handleSort = (columnKey) => {
  
  }
  // Action : Enregistrer une ligne (Création ou Modification)
  const handleSaveItem = (itemData) => {
    //console.log('const handleSaveItem = (itemData) => -------------- '+JSON.stringify(itemData))
    let updatedList = [...value]
    if (editingIndex !== null) {
      // Mode Édition
      updatedList[editingIndex] = itemData
    } else {
       var index = updatedList.findIndex(i => i.seqnumber === itemData.seqnumber)
       if (index >= 0) {
           updatedList[index] = itemData
       } else {
         updatedList.push(itemData)      
       }
    }
    onChange(field, updatedList)
    setIsModalOpen(false)
    setEditingIndex(null)
  }

  // Action : Retirer les lignes cochées du tableau
  const handleRemoveSelected = () => {
    const updatedList = value.filter(item => !selectedRowIndexes.includes(item.seqnumber))
    onChange(field, updatedList)
    setSelectedRowIndexes([])
  }

  const fetchMeta = async (metadata) => {
      const meta = await getMetaFromTypeCode(metadata.typeCode)
          
        if (meta) {
          setMetadata(meta)
        }
  }

  const handleNewItem = async() => {
        try {
          if (metadata) {
             const response = await executedPostMethod(metadata.action, "create", {
               class: metadata.type
             })      
             var data = response.data
             data.seqnumber = value.length+1 
            setFormData(data)
            /**
            const meta = await getMetaFromTypeCode(metadata.typeCode)
            
            if (meta) {
              setMetadata(meta)
            }
               */
            //console.log('-----------------------------Metadata : '+JSON.stringify(meta))
          }
            setEditingIndex(null)
             setIsModalOpen(true)
       } catch (error) {
           const serverMessage = error?.message
           toast.error("Echec du chargement", {
          description: `${serverMessage} (code: ${error?.status || 'Serveur'})`
        })
       } finally {

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
              onClick={() => {handleNewItem(); setEditingIndex(null); setIsModalOpen(true); }}
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
        <TableView 
            columns={columns}
            data={value} // On injecte les données triées
            selectedIds={selectedRowIndexes}
            sortConfig={sortConfig}
            onSort={handleSort}
            onToggleSelectAll={() => setSelectedRowIndexes(selectedRowIndexes.length === value.length ? [] : value.map(i => i.seqnumber))}
            onToggleSelectRow={(id) => {setSelectedRowIndexes(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}}
            onRowClick={(id) => handleSelectRow(id)}
            onlineEditable={true}
            />
      </div>

      {/* Modal du Formulaire d'édition dynamique */}
      <FormPageModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingIndex(null); }}
        metadata={metadata}
        initialData={formData}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveItem}
        onSearch={onSearch}
        disabled={disabled}
      />
    </div>
  )
}