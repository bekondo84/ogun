import React from "react"
import FormSectionSkeleton from "./FormSectionSkeleton"

export default function FormPageSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      
      {/* 1. Squelette du Header / Fil d'ariane (Breadcrumb) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 animate-pulse">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-5 w-48 bg-slate-300 dark:bg-slate-700 rounded" />
        </div>
        {/* Faux boutons d'action (Enregistrer / Annuler) */}
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-8 w-24 bg-purple-200 dark:bg-purple-900/40 rounded-md" />
        </div>
      </div>

      {/* 2. Squelette de la Zone Formulaire Globale */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 space-y-10 shadow-sm">
        
        {/* Section 1 : Informations Générales (Grille à 3 colonnes) */}
        <FormSectionSkeleton columns={3} fieldsCount={6} />
        
        {/* Section 2 : Configuration Avancée (Grille à 2 colonnes) */}
        <FormSectionSkeleton columns={2} fieldsCount={4} />

        {/* Section 3 : Simulation d'un bloc Onglet / Tableau de lignes (OneToMany) */}
        <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-800 animate-pulse">
          <div className="flex justify-between items-center pb-2">
            <div className="h-3 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-7 w-28 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
          {/* Faux en-tête de tableau */}
          <div className="h-8 w-full bg-slate-50 dark:bg-slate-800/40 rounded-t-md" />
          {/* Fausses lignes de données */}
          <div className="h-20 w-full bg-slate-200/30 dark:bg-slate-800/10 rounded-b-md border border-slate-100 dark:border-slate-800" />
        </div>

      </div>
    </div>
  )
}
