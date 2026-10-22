import React, { useEffect } from "react"
import { Plus, Trash2, ChevronLeft, ChevronRight, Table, LayoutGrid } from "lucide-react"
import ActionsDropdown from "./ActionsDropdown"
import SmartSearch from "./SmartSearch"
import Pagination from "./Pagination"
import Breadcrumb from "../Breadcrumb"

export default function DataControls({
  title = "Menu",
  breadcrumbs, 
  columns = [],
  actions = [],
  allowedViews,
  metadata,
  predicates = [],
  setPredicates,
  viewMode = "list",
  setViewMode,
  selectedCount = 0,
  onDeleteSelected,
  onCreate,
  currentPage = 1,
  totalPages,
  onPageChange,
  onRefresh,
  onAction,
  onBreadcrumbAction
}) {

  useEffect(() => {
      //console.log('---------------DataControls---------- : '+metadata)
  }, [metadata, currentPage, totalPages,columns])
  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4 shadow-sm flex-wrap">
      
      {/* SECTION 1 : Breadcrumb + Titre & CRUD */}
      <div className="flex flex-col gap-1.5 shrink-0">
        
        {/* Intégration du composant autonome */}
        <Breadcrumb items={breadcrumbs} onAction={onBreadcrumbAction} />

        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
          {metadata?.canCreate && (
            <button 
              onClick={onCreate} 
              className="inline-flex items-center justify-center bg-purple-700 hover:bg-purple-800 text-white h-8 px-3 text-xs font-semibold gap-1.5 rounded-md transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Créer
            </button>
          )}
          {selectedCount > 0 && metadata?.canDelete && (
            <button 
              onClick={onDeleteSelected} 
              className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white h-8 px-3 text-xs font-semibold gap-1.5 rounded-md transition-all cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" /> Supprimer ({selectedCount})
            </button>
          )}
        </div>
      </div>

      {/* SECTION 2 : Recherche & Actions (Intégration des sous-composants) */}
      <div className="flex flex-1 max-w-2xl items-start gap-2">
        <ActionsDropdown 
          metadata={metadata}
          actions={actions}
          onAction={onAction}
        />
        <SmartSearch columns={columns} predicates={predicates} setPredicates={setPredicates}  onRefresh={onRefresh} />
      </div>

      {/* SECTION 3 : Pagination & Mode de vue */}
      {currentPage <= totalPages && (
          <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          allowedViews={allowedViews} 
          viewMode={viewMode}
          setViewMode={setViewMode} 
          onPageChange={onPageChange}/>
      )}
       
    </div>
  )
}