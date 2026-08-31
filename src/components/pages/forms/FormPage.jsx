import React, { useEffect, useState } from "react"
import DynamicForm from "@/components/widgets/form/DynamicForm"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { ChevronRight, Settings2, Copy, Trash2, Archive, ArrowLeft } from "lucide-react"
import FormPageSkeleton from "../skeletons/FormPageSkeleton"
import { validateForm } from "@/utils/FormUtils"
import { toast } from "sonner"
import FormHeaderTitle from "@/components/widgets/form/FormHeaderTitle"
import FormHeaderAction from "@/components/widgets/form/FormHeaderAction"

export default function FormDataModule({
         metadata,
         item,
         editMode,
         isLoading,
         setFormValues,
         onSave,
         onCancel,
         onAction
}) {
  const [currentStage, setCurrentStage] = useState("in_progress") // États : new, in_progress, won
  const [errors, setErrors] = useState({})
  const [actions, setActions] = useState([])

  useEffect(() => {
     // Réinitialisation des erreurs lors du changement de fiche
     setErrors({})
     setActions(metadata.editorarea.actions)
  }, [metadata, item])

  const handleFieldChange = (field, value) => {
    setFormValues(prev => ({ ...prev, [field?.fieldName]: value }))
    
    if (errors[field?.fieldName]) {
        setErrors(prev => ({ ...prev, [field?.fieldName]: null }))
    }     
  }

  const handleSubmit = async (mode, item) => {
    if (mode) {
       const columns = metadata?.listView?.columns || [];
       const formErrors = validateForm(item, columns)
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors)
            toast.warning("Formulaire invalide", {
                description: "Veuillez corriger les erreurs surlignées en rouge avant de sauvegarder."
            })
            return
        }
    }
    onSave(mode, item)
  }

  return (
    <div className="h-screen w-full bg-slate-100 dark:bg-slate-950 flex flex-col antialiased">
        <FormHeaderTitle item={item} metadata={metadata} onCancel={onCancel} />
        <FormHeaderAction item={item} metadata={metadata} actions={actions} editMode={editMode} currentStage={currentStage} handleSubmit={handleSubmit} onCancel={onCancel} setCurrentStage={setCurrentStage} onAction={onAction}/>
       {/* Zone de contenu scrollable pour le formulaire */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950 text-xs">
          {isLoading ? (
            <FormPageSkeleton />
          ) : (
            <DynamicForm 
              schema={metadata?.editorarea} 
              values={item} 
              errors={errors} 
              onChange={handleFieldChange} 
              disabled={!editMode} 
              editMode={editMode}
            />
          )}
        </div>
        
    </div>
  )
}
