import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import SmartSearch from "../../list/SmartSearch"
import ActionsDropdown from "../../list/ActionsDropdown"
import { TableView } from "../../list"
import { executedPostMethod } from "@/axios/DataService"
import Pagination from "../../list/Pagination"

export default function SearchMoreModal({ 
  isOpen, 
  onClose,
  meta,
  initialData,
  onSelect, 
  isSelectable=false,
  onSave
}) {
  const [criteria, setCriteria] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [predicates, setPredicates] = useState([])
  const [columns, setColumns] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [allowedViews, setAllowedViews] = useState("")
  const [viewMode, setViewMode] = useState("list")

  useEffect (() => {
       if (meta && meta.listView) {
          setColumns(meta['listView']['columns'])
       }
  }, [meta])

  useEffect( () =>{
     setPredicates([])
     setData([])
     setCurrentPage(1)
     setTotalPages(0)
  }, [isOpen])
    

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Dans la modal, on ne limite plus à 5, on demande une liste plus large (ex: 50)
      const response = await executedPostMethod(meta.action, "fetchitems", {
                startIndex: (pageNumer-1) * metadata.pageSize,
                pageSize: metadata.pageSize,
                typeCode: metadata.typeCode,
                predicates: predicat,
                sort:sortrules
              });
      setData(response.data)
      //setResults(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (columnkey) => {

  }

  const onPageChange = (page) => {
      onRefresh(null, null, page)
  }

  const onRowClick = (item) =>  {
    onSelect(item)
    setPredicates([])
  }

  const onRefresh = async(searchConfig, predicates, page) => {
     
     if (predicates !== null) {
       setPredicates(predicates)
    }
    var pageNumer = 1;
    if (page !== null) {
      pageNumer = page;
      setCurrentPage(page)
    }
     if (meta) {
        setLoading(true)
        
        try {
          // Dans la modal, on ne limite plus à 5, on demande une liste plus large (ex: 50)
          const response = await executedPostMethod(meta.action, "fetchitems", {
                    startIndex: (pageNumer-1) * meta.pageSize,
                    pageSize: meta.pageSize,
                    typeCode: meta.typeCode,
                    predicates: predicates,
                    sort:[]
                  });
          setTotalPages(Math.ceil(response.nbreofitems / meta.pageSize))
          setData(response.data)
         // console.log('----------------On Refresj SearchMoreModal ---------------'+JSON.stringify(data))
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    //console.log('---------ManyToMany -----------handleSubmit ----------- '+JSON.stringify(data))
    onSave(data)
    setData([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-4xl text-xs max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Recherche avancée : {meta?.listViewTitle}
          </DialogTitle>
        </DialogHeader>

        {/* Barre de recherche */}
        <div className="flex flex-1 max-w-2xl items-start gap-2">
          <SmartSearch 
               columns={columns} 
               predicates={predicates} 
               setPredicates={setPredicates}  
               onRefresh={onRefresh} />
          {currentPage <= totalPages &&(
             <Pagination
              currentPage={currentPage}
              allowedViews={allowedViews}
              viewMode={viewMode}
              setViewMode={setViewMode}
              totalPages={totalPages}
              onPageChange={onPageChange} />
          )}          
          
        </div>  
        {/* Grille / Liste de résultats */}
        <TableView  
            columns={columns}
            data={data}
            selectedIds={selectedIds}
            sortConfig={handleSearch}
            onToggleSelectAll={() => setSelectedIds(selectedIds.length === data.length ? [] : data.map(i => i.seqnumber))}
            onToggleSelectRow={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
            onRowClick={(item) => onRowClick(item)}
            isSelectable={isSelectable}
          />
          {isSelectable && (
             <DialogFooter className="border-t border-slate-100 pt-3 dark:border-slate-800">
                <Button variant="outline" size="sm" type="button" onClick={onClose} className="h-8 text-xs">
                  Annuler
                </Button>
                <Button 
                  size="sm" 
                  type="submit" 
                  onClick={handleSubmit}
                  className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Enregistrer
                </Button>
              </DialogFooter>
          )}
        
      </DialogContent>
    </Dialog>
  )
}
