import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import FieldLabel from "@/components/widgets/form/fields/FieldLabel"
import FormPageModal from "@/components/widgets/form/fields/FormPageModal"
import { executedPostMethod } from "@/axios/DataService"
import { getMetaFromTypeCode } from "@/axios/MetaService"
import { TableView } from "../../list"
import { toast } from "sonner"

export default function OneToMany({ field, value = [], onChange, disabled }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const [formData, setFormData] = useState({})
  const [metadata, setMetadata] = useState(null)
  const [columns, setColumns] = useState([])
  const [sortConfig, setSortConfig] = useState({})

  const safeValue = Array.isArray(value) ? value : []

  useEffect(() => {
    const meta = field?.meta || null
    setMetadata(meta)
    setColumns(meta?.listView?.columns?.filter(col => col.show) || [])
    if (meta?.typeCode) {
      fetchMeta(meta)
    }
  }, [field])

  const fetchMeta = async (targetMeta) => {
    try {
      const meta = await getMetaFromTypeCode(targetMeta.typeCode)
      if (meta) {
        setMetadata(meta)
      }
    } catch (error) {
      // Fallback silencieux sur field.meta
    }
  }

  const onSearch = () => {}

  // Ouverture d'une ligne en édition (supporte l'objet ligne ou son seqnumber)
  const handleSelectRow = (rowOrId) => {
    const targetRow =
      typeof rowOrId === "object" && rowOrId !== null
        ? rowOrId
        : safeValue.find(item => item.seqnumber === rowOrId)

    if (!targetRow) return

    const idx = safeValue.findIndex(item => item.seqnumber === targetRow.seqnumber)
    setFormData(targetRow)
    setEditingIndex(idx >= 0 ? idx : null)
    setIsModalOpen(true)
  }

  const handleSort = (columnKey) => {
    setSortConfig(prev => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === "asc" ? "desc" : "asc"
    }))
  }

  // Enregistrer une ligne (Création ou Modification)
  const handleSaveItem = (itemData) => {
    const updatedList = [...safeValue]
    if (editingIndex !== null && updatedList[editingIndex]) {
      updatedList[editingIndex] = itemData
    } else {
      const index = updatedList.findIndex(i => i.seqnumber === itemData.seqnumber)
      if (index >= 0) {
        updatedList[index] = itemData
      } else {
        updatedList.push(itemData)
      }
    }
    onChange?.(field, updatedList)
    setIsModalOpen(false)
    setEditingIndex(null)
  }

  // Retirer les lignes cochées du tableau
  const handleRemoveSelected = () => {
    const updatedList = safeValue.filter(
      item => !selectedRowIds.includes(item.seqnumber)
    )
    onChange?.(field, updatedList)
    setSelectedRowIds([])
  }

  const handleNewItem = async () => {
    if (disabled) return
    try {
      if (metadata) {
        const response = await executedPostMethod(metadata.action, "create", {
          typeCode: metadata.typeCode
        })
        const data = response.data || {}
        data.seqnumber = safeValue.length + 1
        setFormData(data)
      } else {
        setFormData({ seqnumber: safeValue.length + 1 })
      }
      setEditingIndex(null)
      setIsModalOpen(true)
    } catch (error) {
      const serverMessage = error?.response?.data?.message || error?.message || "Erreur serveur"
      toast.error("Échec du chargement", {
        description: `${serverMessage} (code: ${error?.response?.status || "Serveur"})`
      })
    }
  }

  return (
    <div className="flex flex-col w-full space-y-2.5">
      {/* Barre d'outils supérieure */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <FieldLabel id={field.fieldName} label={field.label} required={field.mandatory} />

          {safeValue.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--brand-soft)] dark:bg-[var(--brand-soft-dark)] text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] transition-colors">
              {safeValue.length}
            </span>
          )}
        </div>

        {!disabled && (
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleNewItem}
              className="h-7 px-2.5 text-xs font-semibold text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] bg-[var(--brand-soft)] dark:bg-[var(--brand-soft-dark)] hover:bg-[var(--brand-primary)] hover:text-white dark:hover:bg-[var(--brand-primary)] dark:hover:text-white border-none rounded-md gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span></span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={selectedRowIds.length === 0}
              onClick={handleRemoveSelected}
              className="h-7 px-2.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-950/30 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white border-none rounded-md gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {selectedRowIds.length > 0 && <span>({selectedRowIds.length})</span>}
            </Button>
          </div>
        )}
      </div>

      {/* Conteneur Grille / Tableau */}
      <div
        className={`w-full overflow-x-auto border rounded-lg bg-white dark:bg-slate-900/40 transition-colors ${
          selectedRowIds.length > 0
            ? "border-[var(--brand-border)]"
            : "border-slate-200/80 dark:border-slate-800"
        }`}
      >
        <TableView
          columns={columns}
          data={safeValue}
          selectedIds={selectedRowIds}
          sortConfig={sortConfig}
          onSort={handleSort}
          onToggleSelectAll={() =>
            setSelectedRowIds(
              selectedRowIds.length === safeValue.length
                ? []
                : safeValue.map(i => i.seqnumber)
            )
          }
          onToggleSelectRow={(id) =>
            setSelectedRowIds(prev =>
              prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            )
          }
          onRowClick={(rowOrId) => handleSelectRow(rowOrId)}
          onlineEditable={true}
        />
      </div>

      {/* Modal du Formulaire d'édition dynamique */}
      <FormPageModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingIndex(null)
        }}
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