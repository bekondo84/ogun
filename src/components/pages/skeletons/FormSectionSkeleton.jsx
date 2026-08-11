import React from "react"

export default function FormSectionSkeleton({ columns = 3, fieldsCount = 6 }) {
  // Détermination de la classe de grille correspondante à votre système
  const gridColumnsMap = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4"
  }
  const gridClass = gridColumnsMap[columns] || "md:grid-cols-3"

  // Créer un tableau fictif pour boucler sur le nombre de champs
  const skeletonFields = Array.from({ length: fieldsCount })

  return (
    <div className="space-y-6 pb-4 animate-pulse">
      {/* Squelette du Titre de la Section */}
      <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
      
      {/* Grille imitant votre formulaire */}
      <div className={`grid grid-cols-1 ${gridClass} gap-x-12 gap-y-4`}>
        {skeletonFields.map((_, index) => (
          <div key={index} className="flex flex-row items-center gap-4 w-full h-[44px]">
            
            {/* Faux Label à gauche (1/3 de la largeur) */}
            <div className="w-1/3 min-w-[120px] shrink-0">
              <div className="h-2.5 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
            
            {/* Faux Input à droite (Ligne inférieure épurée style Odoo) */}
            <div className="flex-1 border-b border-slate-100 dark:border-slate-800 py-2">
              <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-800/60 rounded" />
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
