import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import FieldLabel from "./FieldLabel"

export default function BaseInput({ field, type, value, error, onChange, disabled }) {

  const [hasError, setHasError] = useState(false)

  useEffect (() => {
        console.log('----------------------- /++++++ : '+JSON.stringify(error)+' ------- : '+value)
        setHasError(!!error[field.fieldName])
      }, [field, value, error])

  return (
    <div className="flex flex-row items-center gap-4 w-full min-h-[44px]">
      <div className="w-1/3 min-w-[120px] shrink-0">
        <FieldLabel id={field.fieldName} label={field.label} required={field.mandatory} />
      </div>      
      <div className="flex-1">
        <Input
          id={field.fieldName}
          type={type}
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          disabled={disabled}
          className="h-8 text-xs border-t-0 border-l-0 border-r-0 border-b border-slate-200/80 bg-transparent focus-visible:ring-0 focus-visible:border-purple-600 rounded-none shadow-none px-0 transition-all dark:border-slate-800 w-full"
          required={field.mandatory}
        />
        {hasError && (
                <span className="text-[11px] text-red-500 font-medium animate-in fade-in duration-150">
                  {error[field.fieldName]}
                </span>
              )}
      </div>
    </div>
  )
}