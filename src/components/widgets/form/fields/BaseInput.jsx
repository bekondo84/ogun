import React from "react"
import { Input } from "@/components/ui/input"
import FieldLabel from "./FieldLabel"

export default function BaseInput({ field, value, onChange, disabled }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 w-full min-h-[44px]">
      <FieldLabel id={field.id} label={field.label} required={field.required} />
      <div className="sm:w-2/3 w-full">
        <Input
          id={field.id}
          type={field.type}
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          disabled={disabled}
          className="h-8 text-xs border-t-0 border-l-0 border-r-0 border-b border-slate-200/80 bg-transparent focus-visible:ring-0 focus-visible:border-purple-600 rounded-none shadow-none px-0 transition-all dark:border-slate-800 w-full"
          required={field.required}
        />
      </div>
    </div>
  )
}