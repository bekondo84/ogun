import React, { useEffect, useState } from "react"
import { Trash2, Plus } from "lucide-react"
import FieldLabel from "@/components/widgets/form/fields/FieldLabel"
import { TableView } from "../../list"
import { executedPostMethod } from "@/axios/DataService"
import { useSearchMoreModal } from "../../notification/useSearchMoreModal"

export default function ManyToMany({ field, value = [], onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const [metadata, setMetadata] = useState(null)
  const [columns, setColumns] = useState([])
  const [sortConfig, setSortConfig] = useState({})
  const [modal, ModalElement] = useSearchMoreModal()

  const safeValue = Array.isArray(value) ? value : []

  useEffect(() => {
    const meta = field?.meta || {}
    const visibleCols = meta?.listView?.columns?.filter(col => col.show) || []
    setMetadata(meta)
    setColumns(visibleCols)
  }, [field])

  const handleSort = (columnKey) => {
    setSortConfig(prev => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === "asc" ? "desc" : "asc"
    }))
  }

  const handleSelect = (item) => {
    // Géré via la sélection multiple de la modale
  }

  const handleSubmit = (data) => {
    const updatedList = [...safeValue]
    if (data && data.length > 0) {
      data.forEach(item => {
        const index = updatedList.findIndex(v => v.seqnumber === item.seqnumber)
        if (index >= 0) {
          updatedList[index] = item
        } else {
          updatedList.push(item)
        }
      })
    }
    onChange?.(field, updatedList)
    setIsOpen(false)
  }

  // Gérer la coche d'une seule ligne
  const handleSelectRow = (rowId) => {
    setSelectedRowIds(prev =>
      prev.includes(rowId) ? prev.filter(id => id !== rowId) : [...prev, rowId]
    )
  }

  // Action : Retirer les éléments sélectionnés du tableau
  const handleRemoveSelected = () => {
    const updatedList = safeValue.filter(
      item => !selectedRowIds.includes(item.seqnumber ?? item.id)
    )
    onChange?.(field, updatedList)
    setSelectedRowIds([])
  }

  const onSearch = async (targetField, searchText, size) => {
    if (targetField && targetField.meta) {
      const meta = targetField.meta
      let predicates = []
      if (searchText && searchText.length > 0) {
        predicates = [
          {
            fieldName: "stringValue",
            label: "stringValue",
            type: "java.lang.String",
            value: searchText,
            cond: "LIKE"
          }
        ]
      }
      const response = await executedPostMethod(meta.action, "fetchitems", {
        startIndex: 0,
        pageSize: size,
        typeCode: meta.typeCode,
        predicates: predicates
      })
      return response.data
    }
    return []
  }

  const onShowModal = async () => {
    if (disabled) return
    setIsOpen(true)
    try {
      const result = await modal({
        isOpen: true,
        onClose: () => setIsOpen(false),
        meta: field?.meta,
        data: inputValue,
        onSelect: handleSelect,
        isSelectable: true,
        onSave: handleSubmit
      })

      if (result) {
        handleSubmit(result)
      }
    } catch (error) {
      // Modale fermée ou annulée
    } finally {
      setIsOpen(false)
    }
  }

  return (
    <div className="flex flex-col w-full space-y-2.5">
      {/* En-tête avec Label + Badge compteur à gauche et Actions à droite */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2">
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
            {/* Bouton Ajouter (style moderne sans bordure adapté à l'accent) */}
            <button
              type="button"
              onClick={onShowModal}
              title="Ajouter des éléments"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] bg-[var(--brand-soft)] dark:bg-[var(--brand-soft-dark)] hover:bg-[var(--brand-primary)] hover:text-white dark:hover:bg-[var(--brand-primary)] dark:hover:text-white px-2.5 py-1.5 rounded-md transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span></span>
            </button>

            {/* Bouton Supprimer la sélection */}
            <button
              type="button"
              disabled={selectedRowIds.length === 0}
              onClick={handleRemoveSelected}
              title="Retirer les lignes sélectionnées"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-950/30 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white px-2.5 py-1.5 rounded-md transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {selectedRowIds.length > 0 && <span>({selectedRowIds.length})</span>}
            </button>
          </div>
        )}
      </div>

      {/* Tableau de Données Structuré */}
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
                : safeValue.map(i => i.seqnumber ?? i.id)
            )
          }
          onToggleSelectRow={(id) => handleSelectRow(id)}
          onRowClick={(id) => handleSelectRow(id)}
          onlineEditable={false}
        />
      </div>

      {ModalElement}
    </div>
  )
}