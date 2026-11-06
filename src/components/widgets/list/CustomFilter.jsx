import { Filter, Plus, Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import CustomFilterModal from "./CustomFilterModal";
import { useTranslation } from "react-i18next";
import { getColumnType } from "@/utils/Utils";
import { executedPostMethod } from "@/axios/DataService";
import { data } from "react-router-dom";

export default function CustomFilter({
    metadata,
    searchableColumns = [],
    predicates,
    setPredicates,
    filters,
    setFilters,
    onRefresh,
    onCreateFilter,
    onEditFilter,
    onDeleteFilter
}) {
  const [showCustomFilters, setShowCustomFilters] = useState(false);
  const customFiltersRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFilter, setEditingFilter] = useState(null); // null = création, objet = modification
  const [savedFilters, setSavedFilters] = useState([]);
  const {t, i18n} = useTranslation()

  useEffect (() => {
      
    if (showCustomFilters) {
       fetchFilter()
    }

  }, [showCustomFilters])

  useEffect(() => {
       const currentPredicates = [...predicates]
       if (editingFilter && editingFilter.predicates.length > 0) {
           editingFilter.predicates.forEach(pred => {
            var field = searchableColumns.filter(col => col.fieldName == pred.field)[0]
            currentPredicates.push({
                  fieldName: field.fieldName,
                  label: field.label ,
                  value: pred.value,
                  type: getColumnType(field.type),
                  cond: pred.criteria
               });
               //console.log('CustomFilter.useEffect ----------------------------- '+field.fieldName+' --- '+field.label+' ---- '+JSON.stringify(field))
           });         
           setPredicates(currentPredicates)
           if (onRefresh) onRefresh(null, currentPredicates, null) 
       }
  }, [editingFilter])
  // Fermer le menu au clic à l'extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (customFiltersRef.current && !customFiltersRef.current.contains(event.target)) {
        setShowCustomFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchFilter = async() => {
        const response = await executedPostMethod("filterAction", "userfilters", {
            typeCode: metadata.typeCode,
        })
        setFilters(response.data)
        //console.log('----------------------------------- '+JSON.stringify(response.data))
  }
  // Ouverture pour la création
  const handleOpenCreate = () => {
    setEditingFilter(null);
    setIsModalOpen(true);
  };

  // Ouverture pour la modification
  const handleOpenEdit = (filter) => {
    setEditingFilter(filter);
    setIsModalOpen(true);
  };

  // Enregistrement (Création ou Mise à jour)
  const handleSaveFilter = async(filter) => {
     //console.log('CustomFilter.handleSaveFilter ---------------------- '+JSON.stringify(metadata))
     
    const response = await executedPostMethod('filterAction', 'register', {
        data: filter,    
        typeCode: metadata.typeCode    
    });
    setShowCustomFilters(false)
  };

  const onSelectCustomFilter = (filter) => {
      setEditingFilter(filter)
  }

  const handleOnDelete = async(filter) => {
      const response =  await executedPostMethod('filterAction', 'deletefilter', {
            data: filter
      })
      setShowCustomFilters(false)
  }


  return (
    <div className="relative shrink-0" ref={customFiltersRef}>
      {/* Bouton principal d'ouverture du menu */}
      <button 
        type="button"
        onClick={() => setShowCustomFilters(!showCustomFilters)}
        className={`h-8 px-2.5 inline-flex items-center justify-center gap-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer select-none ${
          showCustomFilters 
            ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 shadow-xs" 
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
        }`}
      >
        <Filter className={`h-3.5 w-3.5 ${showCustomFilters ? "text-purple-600 dark:text-purple-400" : "text-slate-400"}`} />
        <span></span>
      </button>

      {/* Dropdown Menu */}
      {showCustomFilters && (
        <div className="absolute left-0 mt-1 z-50 w-64 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-1 animate-in fade-in slide-in-from-top-1 duration-150">
          
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            {t('registred_filter')}
          </div>

          {/* Liste des filtres enregistrés ou message vide */}
          <div className="space-y-0.5 mt-1 max-h-48 overflow-y-auto">
            {filters?.length === 0 ? (
              <div className="px-2.5 py-3 text-xs text-slate-400 text-center italic">
                {t('no_filter_message')}
              </div>
            ) : (
              filters?.map((filter) => (
                <div
                  key={filter.id}
                  className="group relative flex items-center justify-between px-2.5 py-2 text-xs rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer"
                  onClick={() => {
                    if (onSelectCustomFilter) onSelectCustomFilter(filter);
                    setShowCustomFilters(false);
                  }}
                >
                  <span className="truncate pr-14">{filter.name}</span>

                  {/* Actions Modifier / Supprimer (visibles au survol) */}
                  <div className="absolute right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 dark:bg-slate-800 pl-1">
                    {filter.type == '1' && filter.scope == '1' && (
                      <button
                        type="button"
                        title="Modifier"
                        onClick={(e) => {
                          e.stopPropagation(); // Évite d'appliquer le filtre au clic
                          handleOpenEdit(filter);
                          setShowCustomFilters(false);
                        }}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    )}
                    {filter.scope == '1' && (
                      <button
                        type="button"
                        title="Supprimer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOnDelete(filter);
                        }}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-950/50 text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Séparateur */}
          <div className="h-px bg-slate-100 dark:bg-slate-800 my-1.5" />
          {/* Action : Créer un nouveau filtre personnalisé */}
          <button
            type="button"
            onClick={() => {
              setShowCustomFilters(false);
              handleOpenCreate();
            }}
            className="w-full text-left flex items-center gap-2 px-2.5 py-2 text-xs rounded-md hover:bg-purple-50 dark:hover:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-semibold transition-colors cursor-pointer group"
          >
            <div className="flex h-4 w-4 items-center justify-center rounded bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 group-hover:bg-purple-200">
              <Plus className="h-3 w-3" />
            </div>
            <span>{t('create_filter_btn')}</span>
          </button>

        </div>
      )}
      {/* La modale standard de construction */}
      <CustomFilterModal 
        metadata={metadata}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFilter}
        searchableColumns={searchableColumns}
        initialFilter={editingFilter}
        setInitialFilter={setEditingFilter}
      />
    </div>
  );
}