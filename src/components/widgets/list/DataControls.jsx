import React from "react"
import { Plus, Trash2, ChevronLeft, ChevronRight, Table, LayoutGrid } from "lucide-react"
import ActionsDropdown from "./ActionsDropdown"
import SmartSearch from "./SmartSearch"

export default function DataControls({
  title = "Menu",
  columns = [],
  allowedViews,
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
  onRefresh
}) {

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4 shadow-sm flex-wrap">
      
      {/* SECTION 1 : Titre & CRUD */}
      <div className="flex items-center gap-3 shrink-0">
        <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
        <button onClick={onCreate} className="inline-flex items-center justify-center bg-purple-700 hover:bg-purple-800 text-white h-8 px-3 text-xs font-semibold gap-1.5 rounded-md transition-colors cursor-pointer">
          <Plus className="h-3.5 w-3.5" /> Créer
        </button>
        {selectedCount > 0 && (
          <button onClick={onDeleteSelected} className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white h-8 px-3 text-xs font-semibold gap-1.5 rounded-md transition-all cursor-pointer">
            <Trash2 className="h-3.5 w-3.5" /> Supprimer ({selectedCount})
          </button>
        )}
      </div>

      {/* SECTION 2 : Recherche & Actions (Intégration des sous-composants) */}
      <div className="flex flex-1 max-w-2xl items-start gap-2">
        <ActionsDropdown />
        <SmartSearch columns={columns} predicates={predicates} setPredicates={setPredicates}  onRefresh={onRefresh} />
      </div>

      {/* SECTION 3 : Pagination & Mode de vue */}
      <div className="flex items-center justify-between sm:justify-end gap-6 text-xs text-slate-600 dark:text-slate-400 shrink-0">
        <div className="flex items-center gap-2 font-medium">
          <span>{currentPage} / {totalPages}</span>
          <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden bg-white dark:bg-slate-800">
            <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer border-r border-slate-200 dark:border-slate-700 bg-transparent">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer bg-transparent">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center border border-slate-200 dark:border-slate-700 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-900">
          {/*1. Affichage condition du bouton List */}
          {allowedViews?.includes("list") && (
              <button onClick={() => setViewMode("list")} className={`p-1 rounded-md cursor-pointer bg-transparent border-0 ${viewMode === "list" ? "bg-white text-purple-700 shadow-sm" : "text-slate-500"}`}>
                <Table className="h-4 w-4" />
              </button>          
          )}
          {allowedViews?.includes("kaban") && (
                <button onClick={() => setViewMode("kanban")} className={`p-1 rounded-md cursor-pointer bg-transparent border-0 ${viewMode === "kanban" ? "bg-white text-purple-700 shadow-sm" : "text-slate-500"}`}>
                  <LayoutGrid className="h-4 w-4" />
                </button>
          )}
        </div>
      </div>

    </div>
  )
}