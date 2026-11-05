import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, X, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { combovalues } from "@/axios/DataService";
import FieldLabel from "./FieldLabel";

export default function Combobox({
  metadata,
  field,
  label = "",              
  value = null,    
  error,    
  onChange,              
  disabled = false,
  labelKey = "value",      // Nom de la propriété à afficher (ex: "name", "label")
  valueKey = "key"         // Nom de la propriété clé (ex: "id", "code")
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const [options, setOptions] = useState([]);
  const { t, i18n } = useTranslation();

  // Trouver l'élément actuellement sélectionné
  const selectedItem = options.find(opt => opt[valueKey] === value);

  // Filtrer les options selon la recherche
  const filteredOptions = options.filter(opt => {
    const optLabel = String(opt[labelKey] || "").toLowerCase();
    return optLabel.includes(searchQuery.toLowerCase());
  });

  const errorMessage = error && field ? error[field.fieldName] : null;
  const hasError = !!errorMessage;

  // Load combobox data when field change
  useEffect(() => {
    if (field && metadata) {
      fetchData();
    }
  }, [field]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    const values = await combovalues(metadata.typeCode, field);
    if (values && Object.keys(values).length > 0) {
      const optionsL = [];
      Object.keys(values).forEach(key => optionsL.push({
        key: key,
        value: values[key]
      }));
      setOptions(optionsL);
    }
  };

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Label positionné à gauche */}
      {field && (
        <FieldLabel id={field.fieldName} label={field.label} required={field.mandatory} />
      )}

      {/* Conteneur principal du combobox */}
      <div className={`relative ${label ? "w-2/3" : "w-full"}`} ref={containerRef}>
        
        {/* Bouton principal avec effet bordure basse style InputPrimitive / Odoo */}
        <div 
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full h-9 px-2 flex items-center justify-between bg-transparent text-xs transition-colors cursor-pointer select-none border-b border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 focus:border-purple-600 ${
            disabled ? "opacity-50 pointer-events-none bg-slate-50 dark:bg-slate-900" : ""
          } ${hasError ? "!border-red-500" : ""}`}
        >
          <span className={`truncate ${selectedItem ? "text-slate-900 dark:text-slate-100 font-medium" : "text-slate-400"}`}>
            {selectedItem ? selectedItem[labelKey] : t('placeholder_lb')}
          </span>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {/* Bouton pour effacer la sélection si une valeur est présente */}
            {selectedItem && !disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(field, null);
                }}
                className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:text-slate-300 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* Message d'erreur */}
        {hasError && (
          <span className="text-[11px] text-red-500 font-medium animate-in fade-in duration-150 block mt-0.5">
            {errorMessage}
          </span>
        )}

        {/* Liste déroulante (Popup de recherche & sélection) */}
        {isOpen && (
          <div className="absolute left-0 right-0 mt-1 z-50 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
            
            {/* Barre de recherche interne */}
            <div className="flex items-center px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
              <Search className="h-3.5 w-3.5 text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                autoFocus
                placeholder={t('searchPlaceholder_lb')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 focus:outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Liste des options */}
            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {filteredOptions.length === 0 ? (
                <div className="py-3 text-center text-xs text-slate-400 italic">
                  Aucun résultat trouvé
                </div>
              ) : (
                filteredOptions.map((opt, index) => {
                  const uniqueKey = `${opt[valueKey] !== undefined ? opt[valueKey] : 'opt'}-${index}`;
                  const isSelected = opt[valueKey] === value;
                  return (
                    <div
                      key={uniqueKey}
                      onClick={() => {
                        onChange(field, opt[valueKey]);
                        setIsOpen(false);
                        setSearchQuery("");
                      }}
                      className={`w-full text-left flex items-center justify-between px-2.5 py-2 text-xs rounded-md cursor-pointer transition-colors ${
                        isSelected 
                          ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-medium" 
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span className="truncate">{opt[labelKey]}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0 ml-2" />}
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}