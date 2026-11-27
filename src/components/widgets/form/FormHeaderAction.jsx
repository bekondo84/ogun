import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { ChevronRight, Settings2, Copy, Trash2, Archive, ArrowLeft, icons } from "lucide-react"
import ActionsDropdown from "../list/ActionsDropdown"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { getFormFields, visible } from "@/utils/FormUtils"
import StatusBar from "./StatusBar"

export default function FormHeaderAction ({
       metadata, 
       item, 
       actions=[],
        editMode, 
        currentStage, 
        handleSubmit, 
        onCancel, 
        setCurrentStage,
        onAction
      }) {

    
    const [workflowactions, setWorkflowactions] = useState([])
    const [customactions, setCustomactions] = useState([])
    const {t, i18n} = useTranslation()
    const [fields, setFields] = useState([])
    const [showStatusBar, setShowStatusBar] = useState(false)
   
    useEffect (() => {       
       const fieldss = getFormFields(metadata.editorarea);
       const editorarea = metadata.editorarea;
       const stateCompo = editorarea?.states;
       if (stateCompo && Array.isArray(stateCompo.states)) {
           const states = [...stateCompo.states]
           setShowStatusBar(states.filter(state => visible(fieldss, state.visibleWhen, item)).length > 0);
          // console.log ('----------------------------- '+(states.filter(state => visible(fieldss, state.visibleWhen, item)).length > 0))
       }
       
       if (editorarea && editorarea.sta)
       setFields(fieldss);
    }, [metadata]);



    useEffect(() => {
        if (editMode != 'C') {                      
           setWorkflowactions(actions.filter(act => act.position=='workflow' && visible(fields, act.visibleWhen, item)));
           setCustomactions(actions.filter(act => act.position=='actions' && visible(fields, act.visibleWhen, item)));
        }
    }, [actions]);

    useEffect(() => {
       //console.log('+++++++++++++++++++++++++++ '+JSON.stringify(customactions))
     }, [customactions])

    const showActionsMenus = () => {
       const formComponent = metadata?.editorarea;
       const actionsComponent = formComponent?.actions;
       //console.log ('FormHeaderAction.showActionsMenus ---------------- '+JSON.stringify(actionsComponent.visibleWhen))
       if (actionsComponent && actionsComponent.visibleWhen) {
        
           return visible (fields, actionsComponent.visibleWhen, item)
       }
       return true;
    }
    // Fonction pour centraliser le changement d'étape et notifier l'utilisateur si besoin
    const handleWorkflowAction = (nextStage) => {
        setCurrentStage(nextStage)
    }

    const canCancel = () => {
        
        if (metadata && metadata.viewMode ) {
            const allowViews = metadata?.viewMode.split(',');
            return allowViews.length > 1
        }
        return false;
    }

    return (
        <div className="flex flex-col w-full flex-shrink-0 z-10 shadow-sm">
            
            {/* LIGNE 1 : Barre principale des boutons système (Sauvegarde / Annulation) */}
            <div className="bg-white dark:bg-slate-900 px-6 py-2 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-3">
                
                {/* Actions système de gauche */}
                <div className="flex items-center gap-2">
                    {(editMode === 'U' && metadata.canUpdate || editMode === 'C' && metadata.canCreate) && (
                       <Button onClick={() => handleSubmit(editMode, item)} size="sm" className="bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] h-8 text-white font-semibold rounded-md text-xs cursor-pointer shadow-sm">
                        {t('save_btn')}
                       </Button>
                    )} 
                    {editMode === 'V' && metadata.canUpdate && (
                       <Button onClick={() => handleSubmit(editMode, item)} size="sm" className="bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] h-8 text-white font-semibold rounded-md text-xs cursor-pointer shadow-sm">
                        {t('update_btn')}
                       </Button>
                    )}                
                    {canCancel() && (<Button onClick={() => onCancel()} variant="outline" size="sm" className="h-8 text-slate-600 text-xs rounded-md cursor-pointer">
                        {t('cancel_btn')}
                    </Button>)}

                    {/* Menu Déroulant Actions Contextuelles */}
                    {customactions && customactions.length > 0 && showActionsMenus() ? (<ActionsDropdown metadata={metadata} data={item} actions={customactions}  onAction={onAction}/>) : null}                    
                </div>

                {/* Fil d'Ariane graphique d'étapes (Stages workflow) à droite */}           
                {showStatusBar ? (<StatusBar data={item} metadata={metadata} />) :null }    
            </div>

            {/* LIGNE 2 : Barre exclusive pour les actions / boutons de transition du Workflow */}
            {workflowactions.length > 0 ? (
                <div className="bg-slate-50 dark:bg-slate-900/40 px-6 py-1.5 border-b border-slate-200 dark:border-slate-800 flex items-center h-10 select-none text-xs">
                  <div className="flex items-center gap-1.5">
                      {workflowactions?.map((action, index)=> {
                            const Icon = icons[action.icon] ?? null
                            return (
                              <Button 
                                key={action.code ?? action.name ?? index}
                                type="button"
                                onClick={() => onAction(metadata, item, action)} 
                                size="sm" 
                                 className="h-7 px-3 text-slate-600 hover:text-slate-800 border-slate-200 bg-white font-medium text-[11px] rounded shadow-sm cursor-pointer"
                              >
                                {Icon && <Icon className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
                                <span className="truncate">{action.name}</span>
                            </Button>
                          )
                      })}                      
                  </div>
              </div>    
            ):null}               
            
        </div>
    )
}
