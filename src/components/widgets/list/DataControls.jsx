import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Search, Plus, Trash2, ChevronLeft, ChevronRight, 
  Table, LayoutGrid, MoreHorizontal, Download, FileText, Settings2 
} from "lucide-react"

export default function DataControls({
  title,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  selectedCount,
  onDeleteSelected,
  onCreate,
  currentPage,
  totalPages,
  onPageChange
}) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4 shadow-sm">
      
      {/* 1. Titre & Actions principales de l'en-tête */}
      <div className="flex items-center gap-3 shrink-0">
        <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
        <Button onClick={onCreate} size="sm" className="bg-purple-700 hover:bg-purple-800 text-white h-8 text-xs font-semibold gap-1.5 cursor-pointer rounded-md">
          <Plus className="h-3.5 w-3.5" /> Créer
        </Button>
        {selectedCount > 0 && (
          <Button onClick={onDeleteSelected} size="sm" variant="destructive" className="h-8 text-xs font-semibold gap-1.5 cursor-pointer rounded-md animate-in fade-in zoom-in-95 duration-100">
            <Trash2 className="h-3.5 w-3.5" /> Supprimer ({selectedCount})
          </Button>
        )}
      </div>

      {/* 2. Barre de recherche centrale + Menu Custom Actions */}
      <div className="flex flex-1 max-w-md items-center gap-2">
         {/* ⚙️ Menu Déroulant pour les Custom Actions */}
        <DropdownMenu>
    <DropdownMenuTrigger className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-md inline-flex items-center justify-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white hover:bg-slate-50 dark:bg-slate-950/40 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer focus:outline-none">
      <Settings2 className="h-3.5 w-3.5 text-slate-500" />
      <span>Actions</span>
      <MoreHorizontal className="h-3.5 w-3.5 text-slate-400" />
    </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 p-1">
            <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Traitements CRM</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => alert("Export Excel lancé")} className="cursor-pointer gap-2 text-xs">
              <Download className="h-3.5 w-3.5 text-slate-500" /> Exporter les lignes (.xlsx)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Génération PDF lancée")} className="cursor-pointer gap-2 text-xs">
              <FileText className="h-3.5 w-3.5 text-slate-500" /> Imprimer la vue en PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Recherche en temps réel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-9 pr-4 bg-slate-50 dark:bg-slate-950 text-xs border-slate-200 focus-visible:ring-purple-600 focus-visible:bg-white"
          />
        </div>       
      </div>

      {/* 3. Pagination & Commutateur de Mode de Vue (Tableau / Kanban) */}
      <div className="flex items-center justify-between sm:justify-end gap-6 text-xs text-slate-600 dark:text-slate-400">
        
        {/* Pagination compacte style Odoo */}
        <div className="flex items-center gap-2 font-medium">
          <span>{currentPage} / {totalPages}</span>
          <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden bg-white dark:bg-slate-800">
            <button 
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer border-r border-slate-200 dark:border-slate-700"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Boutons de bascule de structure de vue */}
        <div className="flex items-center border border-slate-200 dark:border-slate-700 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-900">
          <button
            onClick={() => setViewMode("table")}
            title="Vue en Tableau"
            className={`p-1 rounded-md transition-all cursor-pointer ${viewMode === "table" ? "bg-white dark:bg-slate-800 text-purple-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            <Table className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("kanban")}
            title="Vue en Kanban (Cartes)"
            className={`p-1 rounded-md transition-all cursor-pointer ${viewMode === "kanban" ? "bg-white dark:bg-slate-800 text-purple-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>

      </div>

    </div>
  )
}