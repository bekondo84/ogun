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
  onRefresh,
  onAction
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
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col antialiased">
      <DataControls
        title={metadata.listViewTitle}
        columns={columns}
        allowedViews={allowedViews}
        metadata={metadata}
        setPredicates={setPredicates}
        predicates={predicates}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCount={selectedIds.length}
        onDeleteSelected={() => onDelete(selectedIds)}
        onCreate={() => onCreate()}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => handlePageChange(page)}
        onRefresh={onRefresh}
        onAction={onAction}
      />

      <main className="flex-1 max-w-none w-full mx-auto overflow-y-auto">
        {isLoading ? (
          <TableSkeleton 
             rowsCount={items?.length}
             colsCount={columns.length}
          />
           
        ): viewMode === "list" ? (
          <TableView
            columns={columns}
            data={items} // On injecte les données triées
            selectedIds={selectedIds}
            sortConfig={sortConfig}
            onSort={handleSort}
            onToggleSelectAll={() => setSelectedIds(selectedIds.length === items.length ? [] : items.map(i => i.seqnumber))}
            onToggleSelectRow={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
            onRowClick={(id) => onSelected(id)}
          />
        ) : (
          <KanbanView
            data={items}
            selectedIds={selectedIds}
            onToggleSelectRow={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
            onCardClick={(id) => onSelected(id)}
          />
        )}
      </main>
    </div>
  )
}