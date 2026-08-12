import { ArrowLeft } from "lucide-react";

export default function FormHeaderTitle ({metadata, item, onCancel}) {



    return (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Bouton de retour optionnel */}
            <button 
              onClick={() => onCancel()} 
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              title="Retour"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight  tracking-wider font-mono">
                {metadata?.formViewTitle} / {item?.stringValue}
              </h2>
            </div>
          </div>
          
          {/* Métadonnées de suivi rapides (Style ERP Odoo/Salesforce) */}
          {item?.updatedAt && (
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono text-left sm:text-right">
              Dernière mise à jour : {new Date(item.updatedAt).toLocaleDateString("fr-FR")}
            </div>
          )}
        </div>

    )

}