import React, { useRef, useEffect } from "react"
import { AlignLeft } from "lucide-react"

export default function TextAreaField({
  field,
  value = "",
  onChange,
  error = {},
  placeholder = "Saisissez votre texte ici...",
  maxLength,
  rows = 4,
  className = "",
  disabled = false
}) {
  // 🚀 RÉFÉRENCE : Pour manipuler directement la hauteur du nœud HTML
  const textareaRef = useRef(null)

  // SÉCURITÉ : Isolation et calcul synchrone instantané
  const errorMessage = error && field ? error[field.fieldName] : null
  const hasError = !!errorMessage
  const currentLength = value ? String(value).length : 0

  // 🚀 HOOK D'AUTO-AJUSTEMENT DE LA HAUTEUR
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // 1. Sauvegarde des positions du curseur avant le recalcul graphique
    const selectionStart = textarea.selectionStart
    const selectionEnd = textarea.selectionEnd

    // 2. Réinitialisation et calcul basé sur la hauteur réelle du texte (scrollHeight)
    textarea.style.height = "auto"
    textarea.style.height = `${textarea.scrollHeight}px`

    // 3. Restauration immédiate du curseur pour éviter les sauts de focus
    textarea.setSelectionRange(selectionStart, selectionEnd)
    
  }, [value]) // Se déclenche de manière fluide à chaque modification de la valeur [A]

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      
      {/* Label de l'en-tête */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <AlignLeft className="h-3.5 w-3.5 text-slate-400" />
          <span>{field?.label || field?.fieldName}</span>
          {field?.mandatory && <span className="text-red-500">*</span>}
        </label>
        
        {maxLength && (
          <span className={`text-[10px] font-mono ${
            currentLength >= maxLength ? "text-red-500 font-bold" : "text-slate-400"
          }`}>
            {currentLength} / {maxLength}
          </span>
        )}
      </div>

      {/* Zone de texte auto-extensible */}
      <textarea
        ref={textareaRef} // 🚀 Liaison du script à l'élément HTML
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(field, e.target.value)}
        // Note visuelle : "resize-none" retire la poignée manuelle qui briserait l'auto-hauteur.
        // "overflow-hidden" masque les barres de défilement temporaires pendant l'agrandissement.
        className={`w-full p-3 text-xs rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none transition-shadow overflow-hidden resize-none min-h-[80px] disabled:opacity-50 disabled:cursor-not-allowed ${
          hasError 
            ? "border-red-500 focus:ring-1 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-900" 
            : "border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-purple-600 focus:bg-white dark:focus:bg-slate-900"
        }`}
      />

      {/* Message d'erreur */}
      {hasError && (
        <span className="text-[11px] text-red-500 font-medium animate-in fade-in duration-150">
          {errorMessage}
        </span>
      )}
    </div>
  )
}
