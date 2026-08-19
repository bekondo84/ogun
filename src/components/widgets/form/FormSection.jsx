import React, { useEffect } from "react"
import FormField from "./FormField"

export default function FormSection({ section, values, errors, onChange, disabled, editMode }) {

  useEffect (() => {
           //console.log('----------------------- /+===========================x   : '+JSON.stringify(errors)+' ------- : '+values)
        }, [section, values])

    const gridColumnsMap = {
        1: "md:grid-cols-1",
        2: "md:grid-cols-2",
        3: "md:grid-cols-3",
        4: "md:grid-cols-4"
    }

    const gridClass = gridColumnsMap[section?.columns] || "md:grid-cols-3"

  return (
    <div className="space-y-4 pb-2">
      {section.header && (
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
          {section.title}
        </h3>
      )}
      
      {/* Espacement horizontal large pour séparer proprement la colonne de gauche de celle de droite */}
      <div className={`grid grid-cols-1 ${gridClass} gap-x-12 gap-y-3`}>
        {section.fields.map((field) => {
          return <FormField 
             key={field.fieldName} 
             field={field} 
             value={values[field.fieldName]} 
             error={errors}
             onChange={onChange} 
             disabled={disabled} 
             editMode={editMode}/>
        })}
        {section.sections.map((sec, idx) => (
            <FormSection 
               key={idx} 
               section={sec} 
               values={values} 
               errors={errors}
               onChange={onChange} 
               disabled={disabled} 
               editMode={editMode}/>
        ))}
      </div>
    </div>
  )
}