import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import FieldLabel from "./FieldLabel"

export default function Selection({ field, value, onChange, disabled }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 w-full min-h-[44px]">
      <FieldLabel id={field.id} label={field.label} required={field.required} />
      <div className="sm:w-2/3 w-full">
        <Select value={value || ""} onValueChange={(val) => onChange(field.id, val)} disabled={disabled}>
          <SelectTrigger className="h-8 text-xs border-t-0 border-l-0 border-r-0 border-b border-slate-200/80 bg-transparent rounded-none shadow-none px-0 focus:ring-0 dark:border-slate-800">
            <SelectValue placeholder={field.placeholder || "Sélectionner..."} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}