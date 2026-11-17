import React, { useEffect, useRef, useState } from "react"
import { FileText, Image as ImageIcon, X, Download } from "lucide-react"
import FieldLabel from "./FieldLabel"
import { download } from "@/axios/DataService"
import { MAX_FILE_SIZE, uuidFileName } from "@/utils/Utils"

export default function FileUpload({ 
  field, 
  value, 
  error,
  resources,
  setResources,
  onChange, 
  disabled 
}) {
  const [hasError, setHasError] = useState(false)
  const [fileRef, setFileRef] = useState(null)
  
  useEffect(() => {
    setHasError(!!error?.[field?.fieldName])
  }, [field, value, error])

  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE * 1024 * 1024) {
      toast.error(t('filesize_warning'), {
        description: `${t('filesize_warning_message')} ${MAX_FILE_SIZE} Mo.`
      })
      return
    }

    setFileRef(file) 
    const files = [...(resources || [])]
    let filename = value

    if (filename == null || filename === undefined) {
      filename = uuidFileName(file)
    }
    
    onChange(field, filename)

    const filedata = {
      name: filename,
      file: file,        
    }
    const index = files.map(ig => ig.name).indexOf(value)
    if (index >= 0) {
      files.splice(index, 1)
    }
    files.push(filedata)
    setResources(files)
  }

  const handleClear = (e) => {
    e.stopPropagation()

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setFileRef(null) 

    const files = [...(resources || [])]
    const index = files.map(ig => ig.name).indexOf(value)
    if (index >= 0) {
      files.splice(index, 1)
    }
    setResources(files)

    if (onChange) {
      onChange(field, null) 
    }
  }

  const handleDownloadClick = async (e) => {
    e.stopPropagation()
    let url = null

    if (!fileRef) {
      url = await download(value)
    } else if (fileRef instanceof File) {
      url = URL.createObjectURL(fileRef) 
    }
      
    if (url) {
      const a = document.createElement("a")
      a.href = url
      a.download = value
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      if (fileRef instanceof File) {
        URL.revokeObjectURL(url)
      }
    }
  }

  const displayFileName = value instanceof File ? value.name : (value || "Téléverser un document")

  return (
    <div className="flex flex-col w-full gap-1">
      <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 w-full min-h-[44px]">
        <FieldLabel id={field.fieldName} label={field.label} required={field.mandatory} />
        
        <div className="sm:w-2/3 w-full">
          <div 
            onClick={() => !disabled && fileInputRef.current?.click()}
            className={`group border border-dashed rounded-md p-2 flex items-center justify-between gap-2 h-9 relative transition-all ${
              disabled 
                ? "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-60" 
                : hasError
                  ? "border-red-400 dark:border-red-500/70 bg-red-50/30 dark:bg-red-950/20 cursor-pointer"
                  : value
                    ? "border-[var(--brand-primary)]/50 bg-[var(--brand-soft)]/50 dark:bg-[var(--brand-soft-dark)] hover:border-[var(--brand-primary)] cursor-pointer"
                    : "border-slate-300 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/40 hover:border-[var(--brand-primary)] hover:bg-[var(--brand-soft)]/40 dark:hover:bg-[var(--brand-soft-dark)] cursor-pointer"
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              disabled={disabled} 
              onChange={handleFileChange} 
              className="hidden" 
              required={field.mandatory && !value}
              accept={field.type === "image" ? "image/*" : "*/*"}
            />

            <div className="flex items-center gap-2 truncate flex-1">
              {field.type === "image" ? (
                <ImageIcon 
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    value 
                      ? "text-[var(--brand-primary)]" 
                      : "text-slate-400 dark:text-slate-500 group-hover:text-[var(--brand-primary)]"
                  }`} 
                />
              ) : (
                <FileText 
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    value 
                      ? "text-[var(--brand-primary)]" 
                      : "text-slate-400 dark:text-slate-500 group-hover:text-[var(--brand-primary)]"
                  }`} 
                />
              )}
              <span className={`text-xs font-medium truncate ${value ? "text-slate-900 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"}`}>
                {displayFileName}
              </span>
            </div>

            {/* Actions : Télécharger et Supprimer */}
            {value && (
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={handleDownloadClick}
                  className="p-1 text-slate-400 dark:text-slate-500 hover:text-[var(--brand-primary)] hover:bg-white/60 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                  title="Télécharger le fichier"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>

                {!disabled && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-white/60 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                    title="Supprimer le fichier"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Affichage de l'erreur proprement en dessous du composant */}
          {hasError && (
            <span className="text-[11px] text-red-500 dark:text-red-400 font-medium mt-1 block animate-in fade-in duration-150">
              {error[field.fieldName]}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}