import React from "react"
import { FileText, Image as ImageIcon } from "lucide-react"
import FieldLabel from "./FieldLabel"

export default function FileUpload({ field, value, onChange, disabled }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 w-full min-h-[44px]">
      <FieldLabel id={field.id} label={field.label} required={field.required} />
      <div className="sm:w-2/3 w-full">
        <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-md p-2 bg-slate-50/20 flex items-center gap-2 cursor-pointer h-9 relative hover:bg-slate-50 transition-colors">
          <input type="file" disabled={disabled} onChange={(e) => onChange(field.id, e.target.files?.name || "")} className="absolute inset-0 opacity-0 cursor-pointer" />
          {field.type === "image" ? <ImageIcon className="h-4 w-4 text-slate-400" /> : <FileText className="h-4 w-4 text-slate-400" />}
          <span className="text-xs font-medium text-slate-500 truncate">{value || "Téléverser un document"}</span>
        </div>
      </div>
    </div>
  )
}