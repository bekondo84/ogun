import { ArrowLeft } from "lucide-react";
import Breadcrumb from "../Breadcrumb";

export default function FormHeaderTitle ({metadata, item, breadcrumbs, onCancel, onBreadcrumbAction}) {



    return (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 shadow-sm">
          {/* Bloc de gauche : Fil d'Ariane (au-dessus) + Titre et retour (en-dessous) */}
          <div className="flex flex-col gap-1.5">
              {/* 1. Fil d'Ariane */}
              <Breadcrumb items={breadcrumbs}  onAction={onBreadcrumbAction}/>

              {/* 2. Bouton retour & Titre */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onCancel()} 
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                  title="Retour"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="space-y-0.5">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-wider font-mono">
                    {metadata?.formViewTitle} / {item?.stringValue}
                  </h2>
                </div>
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