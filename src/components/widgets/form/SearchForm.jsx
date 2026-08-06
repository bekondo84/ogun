import React, { useEffect, useState } from "react"
import { DataControls, TableView, KanbanView } from "@/components/widgets/list"
import TableSkeleton from "@/components/widgets/list/TableSkeleton"

export default function ListDataModule({
  predicates,
  setPredicates,
  sortConfig,
  setSortConfig,
  isLoading,
  setIsLoading,
  items,
  metadata,
  currentPage,
  setCurrentPage,
  totalPages,
  viewMode,
  setViewMode,
  allowedViews,
  onCreate,
  onDelete,
  onSelected,
  onRefresh
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState([])
  
  // MÉTA-DONNÉES DU TABLEAU (Mise à jour : Ajout du paramètre sortable)
  const columns = [...metadata.listView.columns.filter(col => col.show)]

  // 3. Gestion du clic sur un en-tête de colonne
  const handleSort = (columnKey) => {

    let direction = "asc"
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key: columnKey, direction })
    onRefresh({ key: columnKey, direction }, null, null)
  }

  const handlePageChange = (page) => {
        //console.log('Handle page change event --------- '+page)
        //setCurrentPage(page)
        onRefresh(null, null, page)
  }

  return (
         <div className="space-y-4 pb-2">
            
         </div>
     
  )
}