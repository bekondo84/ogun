import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { ChevronRight, Settings2, Copy, Trash2, Archive, ArrowLeft } from "lucide-react"
import ActionsDropdown from "../list/ActionsDropdown"

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

    const listActions = actions.filter(act => act.position='actions')
    const workflowactions = actions.filter(act => !(act.position='actions'))
    // Fonction pour centraliser le changement d'étape et notifier l'utilisateur si besoin
    const handleWorkflowAction = (nextStage) => {
        setCurrentStage(nextStage)
    }

    return (
        <div className="flex flex-col w-full flex-shrink-0 z-10 shadow-sm">
            
            {/* LIGNE 1 : Barre principale des boutons système (Sauvegarde / Annulation) */}
            <div className="bg-white dark:bg-slate-900 px-6 py-2 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-3">
                
                {/* Actions système de gauche */}
                <div className="flex items-center gap-2">
                    {(editMode === 'U' || editMode === 'C') && (
                       <Button onClick={() => handleSubmit(editMode, item)} size="sm" className="bg-purple-700 hover:bg-purple-800 h-8 text-white font-semibold rounded-md text-xs cursor-pointer shadow-sm">
                        Sauvegarder
                       </Button>
                    )} 
                    {editMode === 'V' && (
                       <Button onClick={() => handleSubmit(editMode, item)} size="sm" className="bg-purple-700 hover:bg-purple-800 h-8 text-white font-semibold rounded-md text-xs cursor-pointer shadow-sm">
                        Modifier
                       </Button>
                    )}                
                    <Button onClick={() => onCancel()} variant="outline" size="sm" className="h-8 text-slate-600 text-xs rounded-md cursor-pointer">
                        Annuler
                    </Button>

                    {/* Menu Déroulant Actions Contextuelles */}
                    <ActionsDropdown metadata={metadata} data={item} actions={listActions} onAction={onAction}/>
                </div>

                {/* Fil d'Ariane graphique d'étapes (Stages workflow) à droite */}
                <div className="flex items-center border border-slate-100 dark:border-slate-800 rounded-md overflow-hidden bg-slate-50/50 dark:bg-slate-950 font-medium text-[11px]">
                  <button 
                      onClick={() => setCurrentStage("new")}
                      className={`px-3 py-1.5 transition-colors cursor-pointer ${currentStage === "new" ? "bg-purple-700 text-white font-bold" : "text-slate-500 hover:bg-slate-100"}`}
                  >
                      Nouveau
                  </button>
                  <div className="flex items-center text-slate-300 bg-white dark:bg-slate-900 px-0.5"><ChevronRight className="h-3 w-3" /></div>
                  <button 
                      onClick={() => setCurrentStage("in_progress")}
                      className={`px-3 py-1.5 transition-colors cursor-pointer ${currentStage === "in_progress" ? "bg-purple-700 text-white font-bold" : "text-slate-500 hover:bg-slate-100"}`}
                  >
                      En Cours
                  </button>
                  <div className="flex items-center text-slate-300 bg-white dark:bg-slate-900 px-0.5"><ChevronRight className="h-3 w-3" /></div>
                  <button 
                      onClick={() => setCurrentStage("won")}
                      className={`px-3 py-1.5 transition-colors cursor-pointer ${currentStage === "won" ? "bg-emerald-600 text-white font-bold" : "text-slate-500 hover:bg-slate-100"}`}
                  >
                      Gagné
                  </button>
                </div>
            </div>

            {/* LIGNE 2 : Barre exclusive pour les actions / boutons de transition du Workflow */}
            {(workflowactions.length > 0)&&(
                <div className="bg-slate-50 dark:bg-slate-900/40 px-6 py-1.5 border-b border-slate-200 dark:border-slate-800 flex items-center h-10 select-none text-xs">
                  <div className="flex items-center gap-1.5">
                      {currentStage === "new" && (
                        <Button 
                          type="button"
                          onClick={() => handleWorkflowAction("in_progress")} 
                          size="sm" 
                          className="h-7 px-3 bg-purple-700 hover:bg-purple-800 text-white font-medium text-[11px] rounded shadow-sm cursor-pointer"
                        >
                          Démarrer le traitement
                        </Button>
                      )}
                      
                      {currentStage === "in_progress" && (
                        <>
                          <Button 
                            type="button"
                            onClick={() => handleWorkflowAction("won")} 
                            size="sm" 
                            className="h-7 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] rounded shadow-sm cursor-pointer"
                          >
                            Marquer comme Gagné
                          </Button>
                          <Button 
                            type="button"
                            onClick={() => handleWorkflowAction("new")} 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-3 text-slate-600 hover:text-slate-800 border-slate-200 bg-white font-medium text-[11px] rounded shadow-sm cursor-pointer"
                          >
                            Remettre à l'étape Nouveau
                          </Button>
                        </>
                      )}

                      {currentStage === "won" && (
                        <Button 
                          type="button"
                          onClick={() => handleWorkflowAction("in_progress")} 
                          variant="outline" 
                          size="sm" 
                          className="h-7 px-3 text-purple-700 hover:bg-purple-50 border-purple-200 bg-white font-medium text-[11px] rounded shadow-sm cursor-pointer"
                        >
                          Réactiver (Retour En Cours)
                        </Button>
                      )}
                  </div>
              </div>    
            )}               
            
        </div>
    )
}
