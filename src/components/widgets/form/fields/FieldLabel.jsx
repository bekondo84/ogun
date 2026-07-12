import React from "react"
import { Label } from "@/components/ui/label"

export default function FieldLabel({ id, label, required }) {
  return (
    <Label htmlFor={id} className="text-xs font-bold text-slate-500 dark:text-slate-400 sm:w-1/3 shrink-0 pt-2 select-none">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
  )
}