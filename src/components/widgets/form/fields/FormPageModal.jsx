import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import BaseInput from "./BaseInput"
import DynamicForm from "../DynamicForm"
// Importez vos autres inputs spécifiques si nécessaire (ex: ManyToOneInput)

export default function FormPagesModal({ isOpen, onClose, metadata, initialData, formData, setFormData, onSave, disabled, onSearch, onFindById }) {
  const [errors, setErrors] = useState({})
  const [editMode, setEditMode] = useState(true)

  // Réinitialiser le formulaire à chaque ouverture/changement de mode
  useEffect(() => {
    
  }, [isOpen, initialData])

  const handleFieldChange = (field, newValue) => {
    setFormData(prev => ({
      ...prev,
      [field.fieldName]: newValue
    }))
    console.log('-------------FieldChange event---------!!! '+newValue)
  }

  const handleSubmit = (e,) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent  className="w-full sm:max-w-4xl text-xs max-h-[90vh] flex flex-col"
         onPointerDownOutside={(e) => e.preventDefault()} // Bloque le clic souris basique
         onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {metadata?.formViewTitle}
          </DialogTitle>
        </DialogHeader>

        {/* Formulaire de saisie dynamique */}
        <div className="flex-1 overflow-y-auto py-4 pr-2 min-h-0 w-full">
          <DynamicForm 
            schema={metadata?.editorarea} 
            values={initialData}
            errors={errors} 
            onChange={handleFieldChange} 
            disabled={!editMode} 
            editMode={editMode}
          />
        </div>
        {/* Boutons d'actions */}
        <DialogFooter className="border-t border-slate-100 pt-3 dark:border-slate-800">
          <Button variant="outline" size="sm" type="button" onClick={onClose} className="h-8 text-xs">
            Annuler
          </Button>
          <Button 
            size="sm" 
            type="submit" 
            onClick={handleSubmit}
            className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white"
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
