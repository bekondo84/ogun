import React, { useEffect, useState } from "react";
import { Plus, Trash2, X, Filter } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog"; // Adapte selon ton chemin Shadcn
import { Button } from "@/components/ui/button";
import { applicableOperators } from "@/utils/Utils";
import { useTranslation } from "react-i18next";

export default function CustomFilterModal({
  metadata,
  searchableColumns = [], // Liste des colonnes disponibles (ex: [{fieldName: 'name', label: 'Nom', type: 'string'}, ...])
  initialFilter = null,
  setInitialFilter , 
  isOpen,
  onClose,
  onSave,
      // Si on est en mode édition
}) {
  // État local du filtre en cours de création / modification
  const [filterName, setFilterName] = useState(initialFilter?.name || "");
  const [predicates, setPredicates] = useState(
    initialFilter?.predicates || [{ field: searchableColumns[0]?.fieldName || "", criteria: "eq", value: "" }]
  );
  const [operators, setOperators] = useState([])
  const {t, i18n} = useTranslation();

  useEffect(() => {
         setFilterName(initialFilter?.name)
        // console.log('------------------------ '+JSON.stringify(initialFilter))
  }, [initialFilter])

  useEffect(() => {
        setPredicates(initialFilter?.predicates || [{ field: searchableColumns[0]?.fieldName || "", criteria: "eq", value: "" }])
        setOperators(applicableOperators(searchableColumns[0]?.fieldName, t))
  }, [searchableColumns])
  // Ajouter une nouvelle ligne de condition
  const handleAddPredicate = () => {
    setPredicates([
      ...predicates, 
      { field: searchableColumns[0]?.fieldName || "", criteria: "eq", value: "" }
    ]);
  };

  // Supprimer une ligne de condition
  const handleRemovePredicate = (index) => {
    const newPredicates = predicates.filter((_, i) => i !== index);
    setPredicates(newPredicates);
  };

  // Mettre à jour une ligne spécifique
  const handlePredicateChange = (index, key, value) => {
    const field = searchableColumns?.filter(f => f.fieldName == value);

    if (Array.isArray(field) && field.length > 0) {
           setOperators(applicableOperators(field[0], t))
          // console.log('-------------------------- : '+JSON.stringify(field[0]))
    }    
    
    const newPredicates = [...predicates];
    newPredicates[index][key] = value;
    setPredicates(newPredicates);
  };

  // Sauvegarde
  const handleSave = () => {
    if (!filterName.trim()) return;
    onSave({
      id: initialFilter?.id || -1,
      typeCode: metadata.typeCode,
      name: filterName,
      predicates: predicates
    });
    onClose();
  };

  const handleApply = () => {
     const filter  = {
           name: filterName,
           predicates: predicates
     }
     setInitialFilter(filter)
     onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
            <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Filter className="h-4 w-4" />
            </div>
            {initialFilter ? "Modifier le filtre personnalisé" : "Créer un filtre personnalisé"}
          </DialogTitle>
        </DialogHeader>

        {/* Corps de la modale */}
        <div className="space-y-4 py-4">
          
          {/* Nom du filtre */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {t('filter_name')}
            </label>
            <input 
              type="text"
              placeholder="Ex: Commandes importantes en cours..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

          {/* Liste des conditions (Predicates) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('filter_cond')}
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {predicates.map((predicate, index) => (
                <div key={index} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80">
                  
                  {/* 1. Sélection du champ */}
                  <select
                    value={predicate.field}
                    onChange={(e) => handlePredicateChange(index, "field", e.target.value)}
                    className="flex-1 h-8 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
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
                    className="w-32 h-8 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    {operators?.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>

                  {/* 3. Saisie de la valeur (masquée si l'opérateur est un test d'existence de type is_null) */}
                  {!["is_null", "is_not_null"].includes(predicate.criteria) && (
                    <input
                      type="text"
                      placeholder="Valeur..."
                      value={predicate.value || ""}
                      onChange={(e) => handlePredicateChange(index, "value", e.target.value)}
                      className="flex-1 h-8 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  )}

                  {/* Bouton de suppression de la ligne */}
                  <button
                    type="button"
                    onClick={() => handleRemovePredicate(index)}
                    disabled={predicates.length === 1} // Empêche de supprimer la dernière ligne
                    className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-950/50 text-slate-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
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
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{t('add_filter')}</span>
            </button>
          </div>

        </div>

        {/* Pied de page de la modale */}
        <DialogFooter className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="h-8 text-xs font-medium border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            {t('cancel_btn')}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleApply}
            className="h-8 text-xs font-medium border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            {t('apply_btn')}
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
            disabled={!filterName?.trim()}
            className="h-8 text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
          >
            {t('save_btn')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}