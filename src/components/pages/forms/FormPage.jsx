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
import { getFormFields, isDependsOn, validateForm } from "@/utils/FormUtils"
import { toast } from "sonner"
import FormHeaderTitle from "@/components/widgets/form/FormHeaderTitle"
import FormHeaderAction from "@/components/widgets/form/FormHeaderAction"
import Breadcrumb from "@/components/widgets/Breadcrumb"
import { executedPostMethod } from "@/axios/DataService"
import { getColumnType } from "@/utils/Utils"
import { useOdooModal } from "@/components/widgets/notification/useOdooModal"
import { triggerGlobalModal } from "@/utils/modalService"
import { useTranslation } from "react-i18next"

export default function FormDataModule({
         metadata,
         item,
         breadcrumbs,
         editMode,
         isLoading,
         setFormValues,
         resources,
         setResources,
         onSave,
         onCancel,
         onAction,
         shutcutAction,
         onBreadcrumbAction
}) {
  const [currentStage, setCurrentStage] = useState("in_progress") // États : new, in_progress, won
  const [errors, setErrors] = useState({})
  const [actions, setActions] = useState([])
  const [fields, setFields] = useState()
  const [modal, ModalElement] = useOdooModal();
  const {t, i18n} = useTranslation()

 // const [resources, setResources] = useState([]) //contains formData for upload files
    
useEffect(() => {
      //console.log('-------Change of resource are detected size :::::: '+resources.length+' ----------- '+JSON.stringify(data))
  }, [resources])
 
  useEffect(() => {
     // Réinitialisation des erreurs lors du changement de fiche
     setErrors({})
     setActions(metadata.editorarea.actions)
     var fieldList = getFormFields(metadata?.editorarea)
     setFields(fieldList)
    
  }, [metadata])

  const handleFieldChange = async(field, value) => {
    setFormValues(prev => ({ ...prev, [field?.fieldName]: value }))
    
    if (errors[field?.fieldName]) {
        setErrors(prev => ({ ...prev, [field?.fieldName]: null }))
    } else { //No errors detected, process all on depends fields
       const dependsOnFields = fields.filter(f => isDependsOn(f, field))
       
       for (var index in dependsOnFields) {
           var dependField = dependsOnFields[index]
           console.log('FormPage.handleFieldChange ----------------'+JSON.stringify(dependField))
           /*
           const result = await executedPostMethod(metadata.action, dependField.handler, {
                  data: value,
                  plugin: null,
                  class: metadata.type,
                  typeCode: metadata.typeCode
              })
              setFormValues(prev => ({...prev, [dependField?.fieldName]:result}))*/
       }
    }
  }

  const checkContraints = async(mode, item) => {    
       if (mode =='C') {//Check if duplicate primary key contrains and non respect of unique contraints
          //Check primaruy key contraints
          const response = await executedPostMethod(metadata.action, "fetchitem", {
                        data: item,
                        plugin: null,
                        class: metadata.type,
                        typeCode: metadata.typeCode
                    })
          const hasDuplicate = response && Object.keys(response).length > 0;
          if (hasDuplicate) {
            await modal({
                      title: t('duplicate_key'),
                      message: t('duplicate_key_message'),
                      variant: "danger",
                      conconfirmText: t('confirmation_btn'),
                      cancelText: t('close_btn'),
                      showCancel: false
                    });
            return false
          }
          //Validation of uniques contraints
          //TODO
       }
       return true
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
     //console.log('FormPage.handleSubmit --------------------------------- '+checkContraints(mode, item))
    if (await checkContraints(mode, item)) {
         onSave(mode, item)
    } else {
        
    }
   
  }

  return (
    <div className="h-screen w-full bg-slate-100 dark:bg-slate-950 flex flex-col antialiased">
      {/* Intégration du composant autonome */}
        <FormHeaderTitle item={item} metadata={metadata} onCancel={onCancel} breadcrumbs={breadcrumbs} onBreadcrumbAction={onBreadcrumbAction}/>
        <FormHeaderAction item={item} metadata={metadata} actions={actions} editMode={editMode} currentStage={currentStage} handleSubmit={handleSubmit} onCancel={onCancel} setCurrentStage={setCurrentStage} onAction={onAction}/>
       {/* Zone de contenu scrollable pour le formulaire */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950 text-xs">
          {isLoading ? (
            <FormPageSkeleton />
          ) : (
            <DynamicForm 
              meta={metadata}
              schema={metadata?.editorarea} 
              values={item} 
              errors={errors} 
              resources={resources}
              setResources={setResources}
              onChange={handleFieldChange} 
              disabled={!editMode} 
              editMode={editMode}
              shutcutAction={shutcutAction}
            />
          )}
        </div>
        {ModalElement}
    </div>
  )
}
