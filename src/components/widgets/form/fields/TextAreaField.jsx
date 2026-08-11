import React from "react"
import { AlignLeft } from "lucide-react"

export default function TextAreaField({
  field,
  value = "",
  onChange,
  error,
  placeholder = "Saisissez votre texte ici...",
  maxLength, // Optionnel : ex: 500 pour limiter la saisie
  rows = 4,   // Nombre de lignes de hauteur par défaut
  className = ""
}) {
  const hasError = !!error
  const currentLength = value ? String(value).length : 0

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      
      {/* Label avec indicateur de champ obligatoire */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <AlignLeft className="h-3.5 w-3.5 text-slate-400" />
          <span>{field?.fieldName}</span>
          {field?.mandatory && <span className="text-red-500">*</span>}
        </label>
        
        {/* Compteur de caractères optionnel (uniquement si maxLength est fourni) */}
        {maxLength && (
          <span className={`text-[10px] font-mono ${
            currentLength >= maxLength ? "text-red-500 font-bold" : "text-slate-400"
          }`}>
            {currentLength} / {maxLength}
          </span>
        )}
      </div>

      {/* Zone de texte de saisie */}
      <textarea
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className={`w-full p-3 text-xs rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none transition-all resize-y min-h-[80px] ${
          hasError 
            ? "border-red-500 focus:ring-1 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-900" 
            : "border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600 focus:bg-white dark:focus:bg-slate-900"
        }`}
      />

      {/* Message d'erreur dynamique sous le composant */}
      {hasError && (
        <span className="text-[11px] text-red-500 font-medium animate-in fade-in duration-150">
          {error}
        </span>
      )}
    </div>
  )
}
