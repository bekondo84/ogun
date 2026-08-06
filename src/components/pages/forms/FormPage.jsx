import React, { useEffect, useState } from "react"
import DynamicForm from "@/components/widgets/form/DynamicForm"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { ChevronRight, Settings2, Copy, Trash2, Archive } from "lucide-react"

export default function FormDataModule({
         metadata,
         item,
         setFormValues,
         onSave,
         onCancel
}) {
  const [currentStage, setCurrentStage] = useState("in_progress") // États : new, in_progress, won

  useEffect (() => {
     
  }, [metadata, item])
  const handleFieldChange = (field, value) => {
    //console.log('Handle change of field ---- : '+field+' --------------- value : '+value)
    if (field) {
       setFormValues(prev => ({ ...prev, [field?.fieldName]: value }))
    }
     
  }

  return (
    <div className="h-screen w-full bg-slate-100 dark:bg-slate-950 flex flex-col antialiased">
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 text-xs ">
        
        {/* 🛠️ BARRE STATUSBAR COMBINÉE (Style Odoo 17 Enterprise) */}
        <div className="bg-white dark:bg-slate-900 px-6 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0 gap-3 z-10 shadow-sm">
            
            {/* Actions système de gauche */}
            <div className="flex items-center gap-2">
            <Button onClick={() => onSave()} size="sm" className="bg-purple-700 hover:bg-purple-800 h-8 text-white font-semibold rounded-md text-xs cursor-pointer shadow-sm">
                Sauvegarder
            </Button>
            <Button onClick={() => onCancel()} variant="outline" size="sm" className="h-8 text-slate-600 text-xs rounded-md cursor-pointer">
                Annuler
            </Button>

            {/* ✨ NOUVEAU : Menu Déroulant Actions Contextuelles */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button  variant="ghost" size="sm" className="h-8 border border-slate-200 text-slate-700 dark:text-slate-300 gap-1.5 cursor-pointer text-xs rounded-md">
                    <Settings2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>Actions</span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-44 p-1">
                <DropdownMenuItem onClick={() => alert("Duplication")} className="cursor-pointer gap-2 text-xs"><Copy className="h-3.5 w-3.5 text-slate-500" /> Dupliquer la fiche</DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert("Archivage")} className="cursor-pointer gap-2 text-xs"><Archive className="h-3.5 w-3.5 text-slate-500" /> Archiver la fiche</DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert("Suppression")} className="cursor-pointer gap-2 text-xs text-red-600 focus:text-red-700 focus:bg-red-50"><Trash2 className="h-3.5 w-3.5" /> Supprimer</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>

            {/* ✨ NOUVEAU : Fil d'Ariane d'étapes (Stages workflow) à droite */}
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

        {/* Rendu automatique du formulaire */}
        <DynamicForm schema={metadata?.editorarea} values={item} onChange={handleFieldChange} disabled={false} />
        </div>
    </div>
  )
}