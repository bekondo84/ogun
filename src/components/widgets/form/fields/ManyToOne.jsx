import React, { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import FieldLabel from "./FieldLabel"
import SearchMoreModal from "./SearchMoreModal"
import { Search, ChevronDown, Loader2, X } from "lucide-react"
import { executedPostMethod } from "@/axios/DataService"

export default function ManyToOneInput({ field, value, onChange, disabled /*, onSearch, onFindById */}) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  //const [meta, setMeta] = useState(null)
  
  // inputValue gère le texte tapé par l'utilisateur
  const [inputValue, setInputValue] = useState("")
  // selectedItem stocke l'objet complet actuellement choisi
  const [selectedItem, setSelectedItem] = useState(null)

  const containerRef = useRef(null)
  const searchTimeout = useRef(null)

  // 1. Charger le libellé initial depuis le serveur
  useEffect(() => {

    if (value && field?.meta) {
      setInputValue(value?.stringValue)
      setSelectedItem(value)
      setSuggestions([])
    } else {
      setSelectedItem(null)
      setInputValue("")
    }
  }, [value, field /*, onFindById*/])

  // 2. Fermer le menu au clic extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        // Si l'utilisateur clique dehors sans choisir, on remet le libellé sélectionné
        if (selectedItem) {
          setInputValue(selectedItem.displayName)
        } else {
          setInputValue("")
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [selectedItem])

  // 3. Fonction centrale de recherche (Saisie + Liste)
  const fetchSuggestions = async (searchText) => {
    setLoading(true)
    setIsOpen(true)
    try {
      const data = await onSearch(field, searchText, 5)
      setSuggestions(data || [])
    } catch (err) {
      console.error("Erreur ManyToOne", err)
    } finally {
      setLoading(false)
    }
  }

  const onSearch = async (field, searchText, size) => {
       if (field && field.meta) {
           let meta = field.meta
           let predicates = []
           if (searchText && searchText.length > 0) {
              predicates = [{fieldName:'stringValue', label:'stringValue', type:'java.lang.String', value: searchText, cond: 'LIKE'}] 
           }
           const response = await executedPostMethod(meta.action, "fetchitems", {
              startIndex: 0,
              pageSize: size,
              class: meta.type,
              predicates: predicates
           })
           
          //console.log('--------onSearch = async (field, searchText, size) ---------- : '+' searchText :  '+searchText+' ----------- '+JSON.stringify(suggestions)+'-------- '+suggestions.length)
          return response.data 
       }
  }

  // 4. Gestion de la saisie au clavier (avec Debounce de 300ms)
  const handleInputChange = (e) => {
    const text = e.target.value
    setInputValue(text)
     console.log('------------ Manytoone ---------------- : '+text)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)

    // Si l'utilisateur efface tout, on réinitialise la valeur
    if (!text.trim()) {
      onChange(field, null)
      setSelectedItem(null)
      setSuggestions([])
      setIsOpen(false)
      return
    }

    searchTimeout.current = setTimeout(() => {
      fetchSuggestions(text)
    }, 300)
  }

  const handleSelect = (item) => {
    //console.log('***************************** : '+JSON.stringify(item))
    setSelectedItem(item)
    setInputValue(item.stringValue)
    onChange(field, item)
    setIsOpen(false)
    setIsModalOpen(false)
  }

  const handleClear = () => {
    setInputValue("")
    setSelectedItem(null)
    onChange(field, null)
    setSuggestions([])
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 w-full min-h-[44px] relative">
      <FieldLabel id={field.fieldName} label={field.label} required={field.mandatory} />
      
      <div className="sm:w-2/3 w-full relative group">
        <div className="flex items-center border-b border-slate-200/80 dark:border-slate-800 transition-all focus-within:border-purple-600">
          <Input
            id={field.fieldName}
            type="text"
            placeholder={field.fieldName || "Saisissez ou cherchez..."}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => { if(!isOpen) fetchSuggestions(inputValue) }}
            disabled={disabled}
            className="h-8 text-xs bg-transparent border-none rounded-none shadow-none px-0 w-full focus-visible:ring-0 focus-visible:border-none pr-6"
          />
          
          {/* Bouton d'effacement rapide (Style Odoo / Chrome) */}
          {inputValue && !disabled && (
            <button 
              type="button" 
              onClick={handleClear} 
              className="text-slate-300 hover:text-slate-500 p-0.5 mr-1"
            >
              <X className="h-3 w-3" />
            </button>
          )}

          <button 
            type="button"
            disabled={disabled}
            onClick={() => { if(!disabled) fetchSuggestions(inputValue) }} 
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        {/* Liste déroulante dynamique */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-3 text-xs text-slate-500">
                <Loader2 className="h-3 w-3 animate-spin mr-2" /> Recherche...
              </div>
            ) : (
              <ul className="py-1 text-xs text-slate-700 dark:text-slate-300">
                {suggestions.map((item) => (
                  <li
                    key={item.seqnumber}
                    onClick={() => handleSelect(item)}
                    className="px-3 py-2 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-purple-700 cursor-pointer transition-colors"
                  >
                    {item.stringValue}
                  </li>
                ))}
                
                {suggestions.length === 0 && (
                  <li className="px-3 py-2 text-slate-400 italic">Aucun résultat trouvé</li>
                )}

                <li 
                  onClick={() => { setIsOpen(false); setIsModalOpen(true); }}
                  className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 text-purple-600 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                >
                  <Search className="h-3 w-3" />
                  Rechercher plus... "{inputValue}"
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      <SearchMoreModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        meta={field?.meta}
        initialCriteria={inputValue} // On passe la saisie en cours à la modal
        onSearch={onSearch}
        onSelect={handleSelect}
      />
    </div>
  )
}
