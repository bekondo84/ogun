import React from "react"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import FieldLabel from "./FieldLabel"

export default function Toggle({ field, value, onChange, disabled }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 w-full min-h-[44px]">
      <FieldLabel id={field.seqnumber} label={field.label} required={field.mandatory} />
      <div className="sm:w-2/3 w-full flex items-center pt-1">
        {field.widget === "switch" ? (
          <Switch id={field.seqnumber} checked={!!value} onCheckedChange={(val) => onChange(field, val)} disabled={disabled} />
        ) : (
          <Checkbox id={field.seqnumber} checked={!!value} onCheckedChange={(val) => onChange(field, val)} disabled={disabled} />
        )}
      </div>
    </div>
  )
}