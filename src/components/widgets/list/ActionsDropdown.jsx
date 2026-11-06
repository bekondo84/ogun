import React, { useState, useRef, useEffect } from "react"
import { Settings2, MoreHorizontal, Download, FileText, icons } from "lucide-react"

export default function ActionsDropdown({
     metadata,
     data,
     actions=[],
     onAction}) {
  const [isOpen, setIsOpen] = useState(false)
  const actionsRef = useRef(null)
  
  useEffect(() => {
    //console.log('---------------------------------'+JSON.stringify(actions))
    function handleClickOutside(event) {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [metadata])

  return (
    <div className="relative shrink-0" ref={actionsRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-8 px-2.5 inline-flex items-center justify-center gap-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer select-none ${
          isOpen 
            ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 shadow-xs" 
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
        }`}
        title="Plus d'options"
      >
        <Settings2 className="h-3.5 w-3.5 text-slate-400" />
        <MoreHorizontal className="h-3.5 w-3.5 text-slate-400 -ml-1" />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-1 z-50 w-52 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg p-1">
          {actions?.map((action, index) => {
              const Icon = icons[action.icon] ?? null
              return (
                  <button
                    key={action.code ?? action.name ?? index}
                    onClick={() => {
                      onAction(metadata, data, action)
                      setIsOpen(false)
                    }}
                    className="w-full text-left flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {Icon && <Icon className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
                    <span className="truncate">{action.name}</span>
                  </button>
              )
          })}       
          {false && actions?.length > 0 && <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />}
          {false && <button onClick={() => { alert("Export Excel"); setIsOpen(false); }} className="w-full text-left flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Download className="h-3.5 w-3.5 text-slate-500" /> Exporter les lignes (.xlsx)
          </button>}
          {false && <button onClick={() => { alert("Génération PDF"); setIsOpen(false); }} className="w-full text-left flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
            <FileText className="h-3.5 w-3.5 text-slate-500" /> Imprimer la vue en PDF
          </button>}          
        </div>
      )}
    </div>
  )
}