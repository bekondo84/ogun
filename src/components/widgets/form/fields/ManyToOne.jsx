import React, { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import FieldLabel from "./FieldLabel"
import SearchMoreModal from "./SearchMoreModal"
import { Search, ChevronDown, Loader2, X, Check } from "lucide-react"
import { executedPostMethod } from "@/axios/DataService"
import { toast } from "sonner"

export default function ManyToOneInput({ field, value, error, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // inputValue gère le texte tapé par l'utilisateur
  const [inputValue, setInputValue] = useState("")
  // selectedItem stocke l'objet complet actuellement choisi
  const [selectedItem, setSelectedItem] = useState(null)

  const containerRef = useRef(null)
  const searchTimeout = useRef(null)

  // 1. Synchroniser l'état local avec la valeur initiale / externe
  useEffect(() => {
    if (value && field?.meta) {
      setInputValue(value?.stringValue || "")
      setSelectedItem(value)
      setSuggestions(Array.isArray(value) ? value : [value])
    } else {
      setSelectedItem(null)
      setInputValue("")
      setSuggestions([])
    }
  }, [value, field])

  // Nettoyage du timer debounce au démontage
  useEffect(() => {
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current)
    }
  }, [])

  // 2. Fermer le menu au clic extérieur et restaurer le libellé valide
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        if (selectedItem) {
          setInputValue(selectedItem.stringValue || "")
        } else {
          setInputValue("")
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [selectedItem])

  // 3. Fonction centrale de recherche
  const fetchSuggestions = async (searchText) => {
    setLoading(true)
    setIsOpen(true)
    try {
      const data = await onSearch(field, searchText, 5)
      setSuggestions(Array.isArray(data) ? data : [])
    } catch (err) {
      const serverMessage = err?.response?.data?.message || err?.message || "Erreur réseau"
      toast.error("Échec du chargement", {
        description: `${serverMessage} (code: ${err?.response?.status || "Serveur"})`
      })
    } finally {
      setLoading(false)
    }
  }

  const onSearch = async (targetField, searchText, size) => {
    if (targetField && targetField.meta) {
      const meta = targetField.meta
      let predicates = []
      if (searchText && searchText.length > 0) {
        predicates = [
          {
            fieldName: "stringValue",
            label: "stringValue",
            type: "java.lang.String",
            value: searchText,
            cond: "LIKE"
          }
        ]
      }
      const response = await executedPostMethod(meta.action, "fetchitems", {
        startIndex: 0,
        pageSize: size,
        typeCode: meta.typeCode,
        predicates: predicates
      })
      return response.data
    }
    return []
  }

  // 4. Gestion de la saisie au clavier (Debounce 300ms)
  const handleInputChange = (e) => {
    const text = e.target.value
    setInputValue(text)

    if (searchTimeout.current) clearTimeout(searchTimeout.current)

    if (!text.trim()) {
      onChange?.(field, null)
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
    setSelectedItem(item)
    setInputValue(item.stringValue || "")
    onChange?.(field, item)
    setIsOpen(false)
    setIsModalOpen(false)
  }

  const handleClear = () => {
    setInputValue("")
    setSelectedItem(null)
    onChange?.(field, null)
    setSuggestions([])
    setIsOpen(false)
  }

  const hasError = !!error?.[field?.fieldName]
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : []

  return (
    <div
      ref={containerRef}
      className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 w-full min-h-[44px] relative"
    >
      <FieldLabel id={field.fieldName} label={field.label} required={field.mandatory} />

      <div className="sm:w-2/3 w-full relative group">
        {/* Barre de saisie style Odoo avec focus dynamique */}
        <div
          className={`flex items-center border-b transition-colors ${
            hasError
              ? "border-red-500 dark:border-red-400"
              : isOpen
                ? "border-[var(--brand-primary)] dark:border-[var(--brand-primary-dark)]"
                : "border-slate-200/80 dark:border-slate-800 focus-within:border-[var(--brand-primary)] dark:focus-within:border-[var(--brand-primary-dark)]"
          }`}
        >
          <Input
            id={field.fieldName}
            type="text"
            placeholder={field.label || field.fieldName || "Saisissez ou cherchez..."}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => {
              if (!isOpen && !disabled) fetchSuggestions(inputValue)
            }}
            disabled={disabled}
            className="h-8 text-xs bg-transparent border-none rounded-none shadow-none px-0 w-full focus-visible:ring-0 focus-visible:border-none pr-6 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />

          {/* Bouton d'effacement rapide */}
          {inputValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              title="Effacer la sélection"
              className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 p-0.5 mr-1 transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}

          {/* Bouton ouverture liste */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                isOpen ? setIsOpen(false) : fetchSuggestions(inputValue)
              }
            }}
            className={`p-1 transition-colors cursor-pointer ${
              isOpen
                ? "text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)]"
                : "text-slate-400 hover:text-[var(--brand-primary)] dark:text-slate-500 dark:hover:text-[var(--brand-primary-dark)]"
            }`}
          >
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Message d'erreur éventuel */}
        {hasError && (
          <span className="text-[11px] text-red-500 dark:text-red-400 font-medium mt-1 block">
            {error[field.fieldName]}
          </span>
        )}

        {/* Liste déroulante dynamique */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
            {loading ? (
              <div className="flex items-center justify-center p-3 text-xs text-slate-500 dark:text-slate-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-2 text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)]" />
                Recherche...
              </div>
            ) : (
              <ul className="py-1 text-xs text-slate-700 dark:text-slate-300">
                {safeSuggestions.map((item, idx) => {
                  const isSelected = selectedItem?.seqnumber != null && selectedItem.seqnumber === item.seqnumber
                  return (
                    <li
                      key={item.seqnumber ?? idx}
                      onClick={() => handleSelect(item)}
                      className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-[var(--brand-soft)] dark:bg-[var(--brand-soft-dark)] text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] font-semibold"
                          : "hover:bg-[var(--brand-soft)]/60 dark:hover:bg-[var(--brand-soft-dark)]/70 hover:text-[var(--brand-primary)] dark:hover:text-[var(--brand-primary-dark)]"
                      }`}
                    >
                      <span className="truncate">{item.stringValue}</span>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] shrink-0 ml-2" />
                      )}
                    </li>
                  )
                })}

                {safeSuggestions.length === 0 && (
                  <li className="px-3 py-2.5 text-slate-400 dark:text-slate-500 italic text-center">
                    Aucun résultat trouvé
                  </li>
                )}

                {/* Pied de liste : Rechercher plus */}
                <li
                  onClick={() => {
                    setIsOpen(false)
                    setIsModalOpen(true)
                  }}
                  className="px-3 py-2 mt-0.5 border-t border-slate-100 dark:border-slate-800 text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] font-semibold hover:bg-[var(--brand-soft)] dark:hover:bg-[var(--brand-soft-dark)] cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Search className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    Rechercher plus... {inputValue ? `"${inputValue}"` : ""}
                  </span>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      <SearchMoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={safeSuggestions}
        meta={field?.meta}
        initialCriteria={inputValue}
        onSearch={onSearch}
        onSelect={handleSelect}
      />
    </div>
  )
}