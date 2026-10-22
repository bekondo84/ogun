import React, { useState, useRef, useEffect } from "react"
import { Search, Filter, X, Check, Trash2 } from "lucide-react"
import { getColumnType } from "@/utils/Utils"

export default function SmartSearch({ columns = [], predicates = [], setPredicates, onRefresh }) {
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showCustomFilters, setShowCustomFilters] = useState(false)
  
  const dropdownRef = useRef(null)
  const customFiltersRef = useRef(null)

  // Filtrer uniquement les colonnes autorisées à la recherche
  const searchableColumns = columns.filter(col => col.searchable !== false)

  // Fermer les menus au clic à l'extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
      if (customFiltersRef.current && !customFiltersRef.current.contains(event.target)) {
        setShowCustomFilters(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])


  // Ajouter ou modifier un prédicat (Facette)
  const handleSelectField = (column, exactValue = null) => {
    const targetValue = exactValue || inputValue.trim()
    if (!targetValue) return

    const existingIndex = predicates.findIndex(p => p.field === column.fieldName)
    let newPredicates = [...predicates]

    if (existingIndex >= 0) {
      newPredicates[existingIndex].value = targetValue
    } else {
      var cond = 'EQ'
      if (column.type === 'java.lang.String') {
        cond = 'LIKE'
      }
      newPredicates.push({
        fieldName: column.fieldName,
        label: column.label ,
        value: targetValue,
        type: getColumnType(column.type),
        cond: cond
      })
    }

    setPredicates(newPredicates)
    setInputValue("")
    setShowSuggestions(false)
    setShowCustomFilters(false)
    if (onRefresh) onRefresh(null, newPredicates, null) 
  }

  // Supprimer un filtre
  const handleRemovePredicate = (field) => {
    const updated = predicates.filter(p => p.field !== field)
    setPredicates(updated)
    if (onRefresh) onRefresh(null, updated, null)
  }

  return (
    <div className="flex flex-1 flex-col gap-2 min-w-[300px]">
      <div className="flex items-center gap-2 w-full">
        
        {/* NOUVEAU : Menu Filtres Personnalisés */}
        <div className="relative shrink-0" ref={customFiltersRef}>
          <button 
            type="button"
            onClick={() => setShowCustomFilters(!showCustomFilters)}
            className={`h-8 px-3 inline-flex items-center justify-center gap-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
              showCustomFilters 
                ? "bg-purple-50 border-purple-300 text-purple-700 dark:bg-purple-950/40 dark:border-purple-800" 
                : "bg-white border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50"
            }`}
          >
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden md:inline">...</span>
          </button>

          {showCustomFilters && (
            <div className="absolute left-0 mt-1 z-50 w-56 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg p-1 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Filtres rapides</div>
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
              
              {searchableColumns.slice(0, 5).map((col) => {
                const isActive = predicates.some(p => p.field === col.fieldName)
                return (
                  <button
                    key={col.fieldName}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        handleRemovePredicate(col.fieldName)
                      } else {
                        // Exemple par défaut : filtre les valeurs non vides/actives
                        handleSelectField(col, "Saisi")
                      }
                    }}
                    className="w-full text-left flex items-center justify-between px-2.5 py-1.5 text-xs rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <span className="truncate">{col.label} renseigné</span>
                    {isActive && <Check className="h-3.5 w-3.5 text-purple-600 shrink-0 ml-2" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
        
        {/* Barre de recherche classique par input */}
        <div className="relative flex-1" ref={dropdownRef}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
          <input
            type="text"
            placeholder="Filtrer par critère..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setShowSuggestions(e.target.value.length > 0)
            }}
            onFocus={() => inputValue.length > 0 && setShowSuggestions(true)}
            className="h-8 pl-9 pr-4 bg-slate-50 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:bg-white w-full text-slate-900 dark:text-white"
          />

          {showSuggestions && searchableColumns.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg max-h-60 overflow-y-auto p-1">
              <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Rechercher dans :
              </div>
              {searchableColumns.map((col) => (
                <button
                  key={col.fieldName}
                  type="button"
                  onClick={() => handleSelectField(col)}
                  className="w-full text-left flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 font-medium transition-colors"
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

      {/* Rendu des badges de filtres sous la barre */}
      {predicates.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-1 animate-in fade-in duration-200">
          {predicates.map((p) => (
            <div key={p.fieldName} className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-950/20 border border-purple-200/60 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded text-[11px] font-medium shadow-sm">
              <span>{p.label}:</span>
              <span className="text-slate-700 dark:text-slate-200 font-semibold">{p.value}</span>
              <button type="button" onClick={() => handleRemovePredicate(p.field)} className="hover:bg-purple-200/60 p-0.5 rounded transition-colors ml-0.5 cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => { setPredicates([]); if (onRefresh) onRefresh(null, [], null); }} className="text-[10px] text-slate-400 hover:text-red-500 transition-colors font-semibold ml-1 cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
