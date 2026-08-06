import React from "react"
import { Plus, Trash2, ChevronLeft, ChevronRight, Table, LayoutGrid } from "lucide-react"


export default function Pagination ({
    currentPage=1,
    totalPages,
    allowedViews,
    viewMode,
    setViewMode,
    onPageChange
}) {

    return (
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

    )
}