import React, { useEffect, useState } from "react";
import { Plus, Trash2, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { applicableOperators } from "@/utils/Utils";
import { useTranslation } from "react-i18next";

export default function CustomFilterModal({
  metadata,
  searchableColumns = [],
  initialFilter = null,
  setInitialFilter,
  isOpen,
  onClose,
  onSave,
}) {
  const [filterName, setFilterName] = useState(initialFilter?.name || "");
  const [predicates, setPredicates] = useState(
    initialFilter?.predicates || [
      { field: searchableColumns[0]?.fieldName || "", criteria: "eq", value: "" },
    ]
  );
  const [operators, setOperators] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    setFilterName(initialFilter?.name || "");
  }, [initialFilter]);

  useEffect(() => {
    setPredicates(
      initialFilter?.predicates || [
        { field: searchableColumns[0]?.fieldName || "", criteria: "eq", value: "" },
      ]
    );

    if (searchableColumns[0] && Object.keys(searchableColumns[0]).length > 0) {
      setOperators(applicableOperators(searchableColumns[0], t));
    }
  }, [searchableColumns, initialFilter]);

  // Ajouter une nouvelle ligne de condition
  const handleAddPredicate = () => {
    setPredicates([
      ...predicates,
      { field: searchableColumns[0]?.fieldName || "", criteria: "eq", value: "" },
    ]);
  };

  // Supprimer une ligne de condition
  const handleRemovePredicate = (index) => {
    const newPredicates = predicates.filter((_, i) => i !== index);
    setPredicates(newPredicates);
  };

  // Mettre à jour une ligne spécifique
  const handlePredicateChange = (index, key, value) => {
    if (key === "field") {
      const field = searchableColumns?.filter((f) => f.fieldName == value);
      if (Array.isArray(field) && field.length > 0) {
        setOperators(applicableOperators(field[0], t));
      }
    }

    const newPredicates = [...predicates];
    newPredicates[index] = { ...newPredicates[index], [key]: value };
    setPredicates(newPredicates);
  };

  // Sauvegarde
  const handleSave = () => {
    if (!filterName?.trim()) return;
    onSave({
      id: initialFilter?.id || -1,
      typeCode: metadata.typeCode,
      name: filterName,
      predicates: predicates,
    });
    onClose();
  };

  const handleApply = () => {
    const filter = {
      name: filterName,
      predicates: predicates,
    };
    setInitialFilter?.(filter);
    onClose();
  };

  const inputFocusClasses =
    "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[var(--brand-primary)] dark:focus:border-[var(--brand-primary-dark)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-colors";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-0">
        {/* Liseré d'accentuation en haut de la modale */}
        <div className="h-[3px] w-full bg-[var(--brand-primary)] dark:bg-[var(--brand-primary-dark)]" />

        <div className="p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-base font-semibold text-slate-800 dark:text-slate-100">
              <div className="p-1.5 rounded-lg bg-[var(--brand-soft)] dark:bg-[var(--brand-soft-dark)] text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)]">
                <Filter className="h-4 w-4" />
              </div>
              <span>
                {initialFilter ? "Modifier le filtre personnalisé" : "Créer un filtre personnalisé"}
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* Corps de la modale */}
          <div className="space-y-4 py-2">
            {/* Nom du filtre */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {t("filter_name")}
              </label>
              <input
                type="text"
                placeholder="Ex: Commandes importantes en cours..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className={`w-full h-9 px-3 text-xs rounded-md ${inputFocusClasses}`}
              />
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

            {/* Liste des conditions (Predicates) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t("filter_cond")}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--brand-soft)] dark:bg-[var(--brand-soft-dark)] text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)]">
                  {predicates.length}
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {predicates.map((predicate, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-slate-50/80 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200/70 dark:border-slate-800/80 hover:border-[var(--brand-border)] transition-colors"
                  >
                    {/* 1. Sélection du champ */}
                    <select
                      value={predicate.field}
                      onChange={(e) => handlePredicateChange(index, "field", e.target.value)}
                      className={`flex-1 h-8 px-2 text-xs rounded ${inputFocusClasses}`}
                    >
                      {searchableColumns.map((col) => (
                        <option key={col.fieldName} value={col.fieldName}>
                          {col.label}
                        </option>
                      ))}
                    </select>

                    {/* 2. Sélection de l'opérateur */}
                    <select
                      value={predicate.criteria}
                      onChange={(e) => handlePredicateChange(index, "criteria", e.target.value)}
                      className={`w-32 h-8 px-2 text-xs rounded ${inputFocusClasses}`}
                    >
                      {operators?.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>

                    {/* 3. Saisie de la valeur */}
                    {!["isempty", "notempty"].includes(predicate.criteria) && (
                      <input
                        type="text"
                        placeholder="Valeur..."
                        value={predicate.value || ""}
                        onChange={(e) => handlePredicateChange(index, "value", e.target.value)}
                        className={`flex-1 h-8 px-2 text-xs rounded ${inputFocusClasses}`}
                      />
                    )}

                    {/* Bouton de suppression de la ligne */}
                    <button
                      type="button"
                      onClick={() => handleRemovePredicate(index)}
                      disabled={predicates.length === 1}
                      title="Supprimer cette condition"
                      className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-950/50 text-slate-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Bouton pour ajouter une condition */}
              <button
                type="button"
                onClick={handleAddPredicate}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[var(--brand-soft)] dark:bg-[var(--brand-soft-dark)] text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] hover:bg-[var(--brand-primary)] hover:text-white dark:hover:bg-[var(--brand-primary)] dark:hover:text-white transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{t("add_filter")}</span>
              </button>
            </div>
          </div>

          {/* Pied de page de la modale */}
          <DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-8 px-3 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-none cursor-pointer"
            >
              {t("cancel_btn")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleApply}
              className="h-8 px-3 text-xs font-semibold bg-[var(--brand-soft)] dark:bg-[var(--brand-soft-dark)] text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] hover:opacity-90 border-none cursor-pointer"
            >
              {t("apply_btn")}
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!filterName?.trim()}
              className="h-8 px-3.5 text-xs font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-white border-none disabled:opacity-40 cursor-pointer"
            >
              {t("save_btn")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}