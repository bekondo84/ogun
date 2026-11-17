import React from "react"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import FieldLabel from "./FieldLabel"

export default function Toggle({ field, value, onChange, disabled }) {
  const fieldId = String(field.fieldName ?? field.seqnumber ?? "")
  const isChecked = Boolean(value)

  const handleCheckedChange = (val) => {
    if (!disabled) {
      onChange?.(field, val)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 w-full min-h-[44px]">
      <FieldLabel id={fieldId} label={field.label} required={field.mandatory} />

      <div className="sm:w-2/3 w-full flex items-center gap-2.5 pt-1">
        {field.widget === "switch" ? (
          <Switch
            id={fieldId}
            checked={isChecked}
            onCheckedChange={handleCheckedChange}
            disabled={disabled}
            className="cursor-pointer transition-colors data-[state=checked]:bg-[var(--brand-primary)] dark:data-[state=checked]:bg-[var(--brand-primary-dark)] data-[state=unchecked]:bg-slate-200 dark:data-[state=unchecked]:bg-slate-800 focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/30 disabled:opacity-50"
          />
        ) : (
          <Checkbox
            id={fieldId}
            checked={isChecked}
            onCheckedChange={handleCheckedChange}
            disabled={disabled}
            className="h-4 w-4 rounded-[4px] cursor-pointer transition-all border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-[var(--brand-primary)] dark:hover:border-[var(--brand-primary-dark)] data-[state=checked]:bg-[var(--brand-primary)] dark:data-[state=checked]:bg-[var(--brand-primary-dark)] data-[state=checked]:border-[var(--brand-primary)] dark:data-[state=checked]:border-[var(--brand-primary-dark)] data-[state=checked]:text-white dark:data-[state=checked]:text-slate-950 focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/30 disabled:opacity-50"
          />
        )}

        {/* Texte d'aide / description courte optionnelle du champ */}
        {field.description && (
          <label
            htmlFor={fieldId}
            className={`text-xs select-none transition-colors ${
              disabled
                ? "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                : isChecked
                  ? "text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                  : "text-slate-500 dark:text-slate-400 cursor-pointer"
            }`}
          >
            {field.description}
          </label>
        )}
      </div>
    </div>
  )
}