import React, { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { getColumnType } from "@/utils/Utils"
import CustomFilter from "./CustomFilter"

export default function SmartSearch({ 
   metadata
  , columns = []
  , predicates = []
  , setPredicates
  , filters
  , setFilters
  , onRefresh }) {
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchableColumns, setSearchableColumns] = useState([])
  
  const dropdownRef = useRef(null)

  // Filtrer uniquement les colonnes autorisées à la recherche
  
  useEffect(() => {
      setSearchableColumns(columns.filter(col => col.searchable !== false))
  }, [columns])
  // Fermer les suggestions au clic à l'extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Ajouter ou modifier un prédicat (Facette)
  const handleSelectField = (column, exactValue = null) => {
    const targetValue = exactValue || inputValue.trim()
    if (!targetValue) return

    const existingIndex = predicates.findIndex(p => p.fieldName === column.fieldName)
    let newPredicates = [...predicates]

    if (existingIndex >= 0) {
      newPredicates[existingIndex].value = targetValue
    } else {
      let cond = 'EQ'
      if (column.type === 'java.lang.String') {
        cond = 'LIKE'
      }
      newPredicates.push({
        fieldName: column.fieldName,
        label: column.label,
        value: targetValue,
        type: getColumnType(column.type),
        cond: cond
      })
    }

    setPredicates(newPredicates)
    setInputValue("")
    setShowSuggestions(false)
    if (onRefresh) onRefresh(null, newPredicates, null) 
  }

  // Supprimer un filtre
  const handleRemovePredicate = (fieldName) => {
    const updated = predicates.filter(p => p.fieldName !== fieldName)
    setPredicates(updated)
    if (onRefresh) onRefresh(null, updated, null)
  }

  return (
    <div className="flex flex-col w-full">
      {/* Ligne principale : CustomFilter + Input de recherche */}
      <div className="flex items-center gap-2 w-full">        
         <CustomFilter 
            metadata={metadata}
            predicates={predicates} 
            setPredicates={setPredicates}
            filters={filters}
            setFilters={setFilters}
            searchableColumns={searchableColumns} 
            //onSelect={handleSelectField}
            onRefresh={onRefresh}
            onDeleteFilter={() => alert('Vous avez cliqué sur la suppression du filtre')}
            onEditFilter={() => alert('Vous avez cliqué sur la modification du filtre')}
         />        
        
        {/* Conteneur de l'input avec position relative stricte */}
        <div className="relative flex-1 min-w-0" ref={dropdownRef}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Filtrer par critère..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setShowSuggestions(e.target.value.length > 0)
            }}
            onFocus={() => inputValue.length > 0 && setShowSuggestions(true)}
            className="h-8 pl-9 pr-4 bg-slate-50 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:bg-white w-full text-slate-900 dark:text-white transition-colors"
          />

          {/* Menu suggestions positionné en absolu par-dessus */}
          {showSuggestions && searchableColumns.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl max-h-60 overflow-y-auto p-1">
              <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Rechercher dans :
              </div>
              {searchableColumns.map((col) => (
                <button
                  key={col.fieldName}
                  type="button"
                  onClick={() => handleSelectField(col)}
                  className="w-full text-left flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 font-medium transition-colors cursor-pointer"
                >
                  <span>{col.label}</span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                    :{inputValue}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>      
      </div>

      {/* Rendu des badges (isole la hauteur en dessous) */}
      {predicates.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          {predicates.map((p) => (
            <div key={p.fieldName} className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-950/20 border border-purple-200/60 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded text-[11px] font-medium shadow-sm">
              <span>{p.label}:</span>
              <span className="text-slate-700 dark:text-slate-200 font-semibold">{p.value}</span>
              <button type="button" onClick={() => handleRemovePredicate(p.fieldName)} className="hover:bg-purple-200/60 p-0.5 rounded transition-colors ml-0.5 cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button 
            type="button" 
            onClick={() => { setPredicates([]); if (onRefresh) onRefresh(null, [], null); }} 
            className="inline-flex items-center text-[10px] text-slate-400 hover:text-red-500 transition-colors font-semibold ml-1 cursor-pointer"
            title="Tout effacer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}