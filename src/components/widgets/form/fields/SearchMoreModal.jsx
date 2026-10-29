import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import SmartSearch from "../../list/SmartSearch"
import { TableView } from "../../list"
import { executedPostMethod } from "@/axios/DataService"
import Pagination from "../../list/Pagination"

export default function SearchMoreModal({ 
  isOpen, 
  onClose,
  meta,
  initialData,
  onSelect, 
  isSelectable = false,
  onSave
}) {
  const [predicates, setPredicates] = useState([])
  const [columns, setColumns] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [allowedViews, setAllowedViews] = useState("")
  const [viewMode, setViewMode] = useState("list")
  const [sortConfig, setSortConfig] = useState({})

  useEffect(() => {
   const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose?.();
      }
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose])
  // Charger les colonnes du tableau depuis les métadonnées
  useEffect(() => {
    if (meta && meta.listView) {
      setColumns(meta['listView']['columns'] || [])
    }
  }, [meta])

  // Réinitialiser les états à l'ouverture de la modale
  useEffect(() => {
    if (isOpen) {
      setPredicates([])
      setData([])
      setSelectedIds([])
      setCurrentPage(1)
      setTotalPages(0)
      // Charger les données initiales dès l'ouverture
      onRefresh(null, [], 1)
    }
  }, [isOpen])

  // Gestion du tri (optionnel selon votre TableView)
  const handleSort = (columnKey) => {
    // Logique de tri si nécessaire
  }

  // Changement de page
  const onPageChange = (page) => {
    onRefresh(null, predicates, page)
  }

  // Clic sur une ligne (mode sélection simple)
  const onRowClick = (item) => {
    if (!isSelectable && onSelect) {
      onSelect(item)
      if (onClose) onClose()
    }
  }

  // Fonction centrale pour rafraîchir / fetch les données du backend
  const onRefresh = async (searchConfig, currentPredicates, page) => {
    const activePredicates = currentPredicates !== null ? currentPredicates : predicates;
    const pageNumber = page !== null ? page : currentPage;
    
    if (page !== null) {
      setCurrentPage(page);
    }

    if (meta) {
      setLoading(true)
      try {
        const response = await executedPostMethod(meta.action, "fetchitems", {
          startIndex: (pageNumber - 1) * (meta.pageSize || 10),
          pageSize: meta.pageSize || 10,
          typeCode: meta.typeCode,
          predicates: activePredicates,
          sort: []
        });

        const totalItems = response.nbreofitems || 0;
        const pageSize = meta.pageSize || 10;
        setTotalPages(Math.ceil(totalItems / pageSize));
        setData(response.data || []);
      } catch (err) {
        console.error("Erreur lors du chargement de la modale:", err);
      } finally {
        setLoading(false)
      }
    }
  }

  // Validation / Enregistrement de la sélection multiple
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filtrer les objets complets correspondant aux IDs cochés
    const selectedItems = data.filter(item => selectedIds.includes(item.seqnumber || item.id));
    
    if (onSave) {
      onSave(selectedItems); // On transmet les éléments sélectionnés au parent
    }
    
    setSelectedIds([]);
    if (onClose) onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-4xl text-xs max-h-[90vh] flex flex-col"
         onInteractOutside={(e) => e.preventDefault()}
         onEscapeKeyDown={(e) => e.preventDefault()}
        >
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Recherche avancée : {meta?.listViewTitle || "Sélection"}
          </DialogTitle>
        </DialogHeader>

        {/* Barre de recherche et Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2">
          <SmartSearch 
            columns={columns} 
            predicates={predicates} 
            setPredicates={setPredicates}  
            onRefresh={(config, preds) => onRefresh(config, preds, 1)} 
          />
          
          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              allowedViews={allowedViews}
              viewMode={viewMode}
              setViewMode={setViewMode}
              totalPages={totalPages}
              onPageChange={onPageChange} 
            />
          )}         
        </div>  

        {/* Grille / Liste de résultats */}
        <div className="flex-1 overflow-y-auto min-h-[300px] relative border rounded-md border-slate-100 dark:border-slate-800">
          {loading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 flex items-center justify-center z-10 backdrop-blur-[1px]">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
          )}

          <TableView  
            columns={columns}
            data={data}
            selectedIds={selectedIds}
            sortConfig={sortConfig}
            onSort={handleSort}
            onToggleSelectAll={() => {
              const allIds = data.map(i => i.seqnumber || i.id);
              setSelectedIds(selectedIds.length === data.length ? [] : allIds);
            }}
            onToggleSelectRow={(id) => {
              setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
            }}
            onRowClick={onRowClick}
            isSelectable={isSelectable}
          />
        </div>

        {/* Footer avec boutons d'action si le mode sélection est actif */}
        {isSelectable && (
          <DialogFooter className="border-t border-slate-100 pt-3 dark:border-slate-800">
            <Button variant="outline" size="sm" type="button" onClick={onClose} className="h-8 text-xs">
              Annuler
            </Button>
            <Button 
              size="sm" 
              type="button" 
              onClick={handleSubmit}
              disabled={selectedIds.length === 0}
              className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
            >
              Enregistrer ({selectedIds.length})
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}