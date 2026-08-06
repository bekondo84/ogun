import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import SmartSearch from "../../list/SmartSearch"
import ActionsDropdown from "../../list/ActionsDropdown"
import { TableView } from "../../list"
import { executedPostMethod } from "@/axios/DataService"
import Pagination from "../../list/Pagination"

export default function SearchMoreModal({ isOpen, onClose, meta, onSelect }) {
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
          //setAllowedViews(meta.)
          /*
          const response = await executedPostMethod(meta.action, "fetchitems", {
                  startIndex:0,
                  pageSize : meta.pageSize,
                  predicates : [],
                  class : meta.type
                })
                setData([]) */
                // console.log('-------------------------META : '+JSON.stringify(response.data))
       }
  }, [meta])

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Dans la modal, on ne limite plus à 5, on demande une liste plus large (ex: 50)
      const response = await executedPostMethod(meta.action, "fetchitems", {
                startIndex: (pageNumer-1) * metadata.pageSize,
                pageSize: metadata.pageSize,
                class: metadata.type,
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
                    class: meta.type,
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] text-xs">
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
          <Pagination
              currentPage={currentPage}
              allowedViews={allowedViews}
              viewMode={viewMode}
              setViewMode={setViewMode}
              totalPages={totalPages}
              onPageChange={onPageChange} />
          
        </div>  
        {/* Grille / Liste de résultats */}
        <TableView  
            columns={columns}
            data={data}
            selectedIds={selectedIds}
            sortConfig={handleSearch}
            onToggleSelectAll={() => setSelectedIds(selectedIds.length === items.length ? [] : items.map(i => i.seqnumber))}
            onToggleSelectRow={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
            onRowClick={(item) => onRowClick(item)}
            isSelectable={false}
          />
      </DialogContent>
    </Dialog>
  )
}
