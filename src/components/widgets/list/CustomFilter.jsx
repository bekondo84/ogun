import { Filter, Plus, Pencil, Trash2, Check } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import CustomFilterModal from "./CustomFilterModal";
import { useTranslation } from "react-i18next";
import { executedPostMethod } from "@/axios/DataService";
import { applyPredicatesFilter } from "@/utils/FormUtils";

export default function CustomFilter({
  metadata,
  searchableColumns = [],
  predicates,
  setPredicates,
  filters = [],
  setFilters,
  onRefresh,
  onCreateFilter,
  onEditFilter,
  onDeleteFilter,
  onCustomFilter
}) {
  const [showCustomFilters, setShowCustomFilters] = useState(false);
  const customFiltersRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFilter, setEditingFilter] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (showCustomFilters && metadata?.typeCode) {
      fetchFilter();
    }
  }, [showCustomFilters]);

  useEffect(() => {
    if (editingFilter && editingFilter.type == "1") {
      applyPredicatesFilter(editingFilter, searchableColumns, predicates, setPredicates, onRefresh);
    } else if (editingFilter && editingFilter.type == "2") {
      onCustomFilter?.(editingFilter);
    }
  }, [editingFilter]);

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

  const fetchFilter = async () => {
    const response = await executedPostMethod("filterAction", "userfilters", {
      typeCode: metadata.typeCode,
    });
    setFilters(response.data || []);
  };

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
  const handleSaveFilter = async (filter) => {
    await executedPostMethod("filterAction", "register", {
      data: filter,
      typeCode: metadata.typeCode,
    });
    setShowCustomFilters(false);
  };

  const onSelectCustomFilter = (filter) => {
    setEditingFilter(filter);
  };

  const handleOnDelete = async (filter) => {
    await executedPostMethod("filterAction", "deletefilter", {
      data: filter,
    });
    if (editingFilter?.id === filter.id) {
      setEditingFilter(null);
    }
    setShowCustomFilters(false);
  };

  const hasActiveFilter = Boolean(editingFilter);

  return (
    <div className="relative shrink-0" ref={customFiltersRef}>
      {/* Bouton principal d'ouverture du menu */}
      <button
        type="button"
        onClick={() => setShowCustomFilters(!showCustomFilters)}
        title={t("registred_filter")}
        className={`relative h-8 px-2.5 inline-flex items-center justify-center gap-1.5 text-xs font-medium rounded-md transition-all cursor-pointer select-none ${
          showCustomFilters || hasActiveFilter
            ? "bg-[var(--brand-soft)] dark:bg-[var(--brand-soft-dark)] text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] shadow-2xs"
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
        }`}
      >
        <Filter
          className={`h-3.5 w-3.5 transition-colors ${
            showCustomFilters || hasActiveFilter
              ? "text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)]"
              : "text-slate-400 dark:text-slate-500"
          }`}
        />
        {hasActiveFilter && (
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] dark:bg-[var(--brand-primary-dark)]" />
        )}
      </button>

      {/* Dropdown Menu */}
      {showCustomFilters && (
        <div className="absolute left-0 mt-1.5 z-50 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
            {t("registred_filter")}
          </div>

          {/* Liste des filtres enregistrés ou message vide */}
          <div className="space-y-0.5 mt-1 max-h-48 overflow-y-auto">
            {!filters || filters.length === 0 ? (
              <div className="px-2.5 py-3 text-xs text-slate-400 dark:text-slate-500 text-center italic">
                {t("no_filter_message")}
              </div>
            ) : (
              filters.map((filter) => {
                const isSelected = editingFilter?.id != null && editingFilter.id === filter.id;

                return (
                  <div
                    key={filter.id}
                    className={`group relative flex items-center justify-between px-2.5 py-2 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[var(--brand-soft)] dark:bg-[var(--brand-soft-dark)] text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-[var(--brand-soft)]/60 dark:hover:bg-[var(--brand-soft-dark)]/70 hover:text-[var(--brand-primary)] dark:hover:text-[var(--brand-primary-dark)]"
                    }`}
                    onClick={() => {
                      onSelectCustomFilter(filter);
                      setShowCustomFilters(false);
                    }}
                  >
                    <div className="flex items-center gap-2 truncate pr-14">
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] shrink-0" />
                      )}
                      <span className="truncate">{filter.name}</span>
                    </div>

                    {/* Actions Modifier / Supprimer (visibles au survol) */}
                    {filter.type == "1" && filter.scope == "1" && (
                      <div className="absolute right-1.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs rounded px-1 py-0.5 shadow-2xs">
                        <button
                          type="button"
                          title="Modifier"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(filter);
                            setShowCustomFilters(false);
                          }}
                          className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-[var(--brand-primary)] dark:hover:text-[var(--brand-primary-dark)] hover:bg-[var(--brand-soft)] dark:hover:bg-[var(--brand-soft-dark)] transition-colors cursor-pointer"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>

                        <button
                          type="button"
                          title="Supprimer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOnDelete(filter);
                          }}
                          className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
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
            className="w-full text-left flex items-center gap-2 px-2.5 py-2 text-xs rounded-md hover:bg-[var(--brand-soft)] dark:hover:bg-[var(--brand-soft-dark)] text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] font-semibold transition-colors cursor-pointer group"
          >
            <div className="flex h-4 w-4 items-center justify-center rounded bg-[var(--brand-soft)] dark:bg-[var(--brand-soft-dark)] text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-colors">
              <Plus className="h-3 w-3" />
            </div>
            <span>{t("create_filter_btn")}</span>
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