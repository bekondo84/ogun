import React from "react"
import FieldLabel from "./FieldLabel"

export default function TextArea({ field, value, onChange, disabled }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 w-full col-span-2 min-h-[70px]">
      <FieldLabel id={field.id} label={field.label} required={field.required} />
      <div className="sm:w-2/3 w-full">
        <textarea
          id={field.id}
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          disabled={disabled}
          rows={field.type === "textarea" ? 3 : 5}
          className="w-full text-xs p-1.5 rounded-none border-t-0 border-l-0 border-r-0 border-b border-slate-200/80 bg-transparent focus:outline-none focus:border-purple-600 transition-all text-slate-900 dark:text-slate-100 dark:border-slate-800"
          required={field.required}
        />
      </div>
    </div>
  )
}