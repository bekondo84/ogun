import React, { useState, useRef, useEffect } from "react"
import { Search, Filter, X } from "lucide-react"

export default function SmartSearch({ columns, predicates, setPredicates, onRefresh }) {
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const dropdownRef = useRef(null)

  const searchableColumns = columns //.filter(col => col.search !== false)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getColumnType = (type) => {
      var coltype = type
      if (type === 'int') {
          coltype = 'java.lang.Integer'
      } else if (type == 'float') {
        coltype = 'java.lang.Float'
      } else if (type == 'short') {
        coltype = 'java.lang.Short'
      }  else if (type == 'double') {
        coltype = 'java.lang.Double'
      }  else if (type == 'long') {
        coltype = 'java.lang.Long'
      }
      return coltype;
  }
  const handleSelectField = (column) => {
    if (!inputValue.trim()) return
    const existingIndex = predicates.findIndex(p => p.field === column.fieldName)
    let newPredicates = [...predicates]

    if (existingIndex >= 0) {
      newPredicates[existingIndex].value = inputValue.trim()
    } else {
      var cond = 'EQ'
      if (column.type ==='java.lang.String') {
            cond = 'LIKE'
      }
      
      newPredicates.push({
        fieldName: column.fieldName,
        label: column.label || column.fieldName,
        value: inputValue.trim(),
        type: getColumnType(column.type),
        cond:cond
      })
    }
    setPredicates(newPredicates)
    setInputValue("")
    setShowSuggestions(false)
    onRefresh(null, newPredicates, null)
  }

  return (
    <div className="flex flex-1 max-w-xl flex-col gap-2">
      <div className="flex items-center gap-2 w-full">
        <button hidden ="true"
          onClick={() => alert("Ouverture des filtres")}
          className="h-8 px-3 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:bg-slate-950/40 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
        >
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          <span className="hidden md:inline">Filtres</span>
        </button>
        
        <div className="relative flex-1" ref={dropdownRef}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
          <input
            type="text"
            placeholder="Saisissez une valeur puis sélectionnez un champ..."
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
              {searchableColumns.map((col) => (
                <button
                  key={col.fieldName}
                  onClick={() => handleSelectField(col)}
                  className="w-full text-left flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 font-medium"
                >
                  <span>{col.label}</span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                    {col.fieldName}:{inputValue}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>       
      </div>

      {predicates.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-1">
          {predicates.map((p) => (
            <div key={p.field} className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-950/20 border border-purple-200/60 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded text-[11px] font-medium shadow-sm">
              <span>{p.label}:</span>
              <span className="text-slate-700 dark:text-slate-200 font-semibold">{p.value}</span>
              <button onClick={() => onRefresh(null, predicates.filter(x => x.fieldName !== p.fieldName))} className="hover:bg-purple-200/60 p-0.5 rounded transition-colors ml-0.5">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button onClick={() => onRefresh(null, [])} className="text-[10px] text-slate-400 hover:text-red-500 font-semibold ml-1">
            Effacer tout
          </button>
        </div>
      )}
    </div>
  )
}