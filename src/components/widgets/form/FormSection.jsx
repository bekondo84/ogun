import React from "react"
import FormField from "./FormField"
import RelationTable from "./RelationTable"

export default function FormSection({ section, values, onChange, disabled }) {
  return (
    <div className="space-y-4 pb-2">
      {section.title && (
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
          {section.title}
        </h3>
      )}
      
      {/* Espacement horizontal large pour séparer proprement la colonne de gauche de celle de droite */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-3">
        {section.fields.map((field) => {
          if (field.type === "onetomany" || field.type === "manytomanylist") {
            return <RelationTable key={field.id} field={field} value={values[field.id]} onChange={onChange} disabled={disabled} />
          }
          return <FormField key={field.id} field={field} value={values[field.id]} onChange={onChange} disabled={disabled} />
        })}
      </div>
    </div>
  )
}