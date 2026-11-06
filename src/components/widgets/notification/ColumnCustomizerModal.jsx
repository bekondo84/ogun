import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, ArrowUp, ArrowDown, RotateCcw } from "lucide-react"
import { useTranslation } from "react-i18next"
import { executedPostMethod } from "@/axios/DataService"
import { data } from "react-router-dom"

export default function ColumnCustomizerModal({ 
  metadata,
  isOpen, 
  onClose, 
  columns = [], 
  setColumns ,
  onSave        // Callback pour sauvegarder la nouvelle configuration
}) {
  const [localColumns, setLocalColumns] = useState([])
  const {t, i18n} = useTranslation()
  const [title, setTitle] = useState("")


  useEffect(() => {
      getSettings()
  }, [metadata])
  // Synchroniser les colonnes locales à l'ouverture de la modale
  useEffect(() => {
    if (isOpen && columns) {
      // On s'assure d'avoir une copie propre avec un état de visibilité et un ordre indexé
      setLocalColumns(
        columns.map((col, index) => ({
          ...col,
          show: col.show !== undefined ? col.show : true,
          order: col.order !== undefined ? col.order : index
        }))
      )
    }
  }, [isOpen, columns])

  const getSettings = async() => {
       const response = await executedPostMethod('settingsAction', 'get_user_table_settings', {
            typeCode: metadata.typeCode,
       })
       const data = response.data

      if (data && data.columns) {
        setColumns(data.columns)
        //console.log('---------------------------------------LLLLLLLLLLLLLLLl')
      } 
  }

  // Basculer la visibilité d'une colonne
  const handleToggleVisibility = (key) => {
    setLocalColumns(prev => 
      prev.map(col => col.fieldName === key ? { ...col, show: !col.show } : col)
    )
   // const co = columns.filter(col => col.fieldName == key)[0].show = 
  }

  // Déplacer une colonne vers le haut ou le bas
  const handleMove = (index, direction) => {
    const newCols = [...localColumns]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newCols.length) return

    // Échange des positions
    const temp = newCols[index]
    newCols[index] = newCols[targetIndex]
    newCols[targetIndex] = temp

    setLocalColumns(newCols)
  }

  // Réinitialiser aux paramètres par défaut
  const handleReset = () => {
    setLocalColumns(
      columns.map((col, index) => ({
        ...col,
        show: true,
        order: index
      }))
    )
  }

  // Validation et sauvegarde
  const handleSave = async() => {
    const setting = {
        typeCode: metadata.typeCode,
        type: '2',
        columns: localColumns
    }
    const response = await executedPostMethod("settingsAction", "save_table_settings", {
          data: setting,
    })
    setColumns(localColumns)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-md text-xs max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">
           {t('column_coustomizer_modal')}
          </DialogTitle>
        </DialogHeader>

        <p className="text-slate-500 text-[11px] mb-2">
           {t('column_coustomizer_modal_message')}
        </p>

        {/* Liste des colonnes modifiables */}
        <div className="flex-1 overflow-y-auto space-y-1.5 border border-slate-100 dark:border-slate-800 rounded-md p-2 max-h-[350px]">
          {localColumns.map((col, index) => (
            <div 
              key={col.fieldName} 
              className={`flex items-center justify-between p-2 rounded border transition-colors ${
                col.show 
                  ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" 
                  : "bg-slate-50 dark:bg-slate-950/50 border-dashed border-slate-200 opacity-60"
              }`}
            >
              {/* Checkbox de visibilité + Libellé */}
              <div 
                className="flex items-center gap-2.5 cursor-pointer select-none flex-1"
                onClick={() => handleToggleVisibility(col.fieldName)}
              >
                <button 
                  type="button"
                  className="text-slate-400 hover:text-purple-600 transition-colors"
                >
                  {col.show ? <Eye className="h-4 w-4 text-purple-600" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <span className={`font-medium ${col.show ? "text-slate-800 dark:text-slate-200" : "text-slate-400 line-through"}`}>
                  {col.label}
                </span>
              </div>

              {/* Boutons de réordonnancement */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, "up")}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Déplacer vers le haut"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === localColumns.length - 1}
                  onClick={() => handleMove(index, "down")}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Déplacer vers le bas"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer avec actions */}
        <DialogFooter className="border-t border-slate-100 pt-3 dark:border-slate-800 flex justify-between items-center sm:justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            type="button" 
            onClick={handleReset} 
            className="h-8 text-xs text-slate-500 hover:text-slate-800"
          >
            <RotateCcw className="h-3 w-3 mr-1.5" /> Réinitialiser
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" type="button" onClick={onClose} className="h-8 text-xs">
              Annuler
            </Button>
            <Button 
              size="sm" 
              type="button" 
              onClick={handleSave} 
              className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white"
            >
              Enregistrer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}