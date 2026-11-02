import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import DynamicForm from "../form/DynamicForm"
import { validateForm } from "@/utils/FormUtils"
import { executedPostMethod, uploadFile } from "@/axios/DataService"
// Importez vos autres inputs spécifiques si nécessaire (ex: ManyToOneInput)

export default function ActionModal({ 
     isOpen, 
     onClose,
     onSave, 
     metadata, 
     formData, 
     disabled = false,
     toast
    }) {
  const [errors, setErrors] = useState({})
  const [editMode, setEditMode] = useState(true)
  const [data, setData] = useState(formData)
  const [resources, setResources] = useState([])

  // Réinitialiser le formulaire à chaque ouverture/changement de mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose])

  if (!isOpen) return null;

  const handleFieldChange = (field, newValue) => {
    setData(prev => ({
      ...prev,
      [field.fieldName]: newValue
    }))
    //console.log('-------------FieldChange event---------!!! '+newValue)
  }

  const handleSubmit = async(e,) => {
    e.preventDefault()
    const columns = metadata?.listView?.columns || [];
       const formErrors = validateForm(data, columns)
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors)
            return
        }
    const response = await executedPostMethod(metadata.action, "save", {
                data: data,
                typeCode:metadata.typeCode
              })
     //Upload resource and clean if exist
    for (var index in resources) {
    const resource = new FormData()
    resource.append('file', resources[index].file)
    resource.append('name', resources[index].name)
    //console.log('-------------------- File recieve---- '+JSON.stringify(resources[res].file))
        await uploadFile(resource)
    }
    setResources([])
    //console.log ('ActionModal.handleSubmit -------------------- '+JSON.stringify(data))
    onSave(data)
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
            values={data}
            errors={errors} 
            resources={resources}
            setResources={setResources}
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
