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
    disabled }) {

  const [hasError, setHasError] = useState(false)
  const [fileRef, setFileRef] = useState(null)
  
  useEffect(() => {
    setHasError(!!error[field?.fieldName])
  }, [field, value, error])

  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]

    if (file.size > MAX_FILE_SIZE * 1024 * 1024) {
      toast.error(t('filesize_warning'), {
        description: `${t('filesize_warning_message')} ${maxSizeInMB} Mo.`
      })
      return
    }


    if (file) {
      setFileRef(file) 
      const files = [...resources || []]
      var filename = value

      if (filename == null || filename == undefined) {
        filename = uuidFileName(file)
      }
      
      onChange(field, filename)

      var filedata = {
        name: filename,
        file: file,        
      }
      var index = files.map(ig => ig.name).indexOf(value)
      if (index >= 0) {
        files.splice(index, 1)
      }
      files.push(filedata)
      setResources(files)
    }
  }

  const handleClear = (e) => {
    e.stopPropagation()

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setFileRef(null) 

    var files = [...resources || []]
    var index = files.map(ig => ig.name).indexOf(value)
    if (index >= 0) {
      files.splice(index, 1)
    }
    setResources(files)

    if (onChange) {
      onChange(field, null) 
    }
  }

  // Gestion du téléchargement
  const handleDownloadClick = async (e) => {
    e.stopPropagation()
    var url = null

    if (!fileRef) {
      // Si le fichier vient du serveur (pas de fileRef local), on appelle l'API de téléchargement
      url = await download(value)
    } else if (fileRef instanceof File) {
      // Téléchargement direct si c'est un fichier local tout juste sélectionné
      url = URL.createObjectURL(fileRef) 
    }
      
    if (url) {
      const a = document.createElement("a")
      a.href = url
      a.download = value //instanceof File ? value.name : (value || "document")
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
            className={`border border-dashed rounded-md p-2 flex items-center justify-between gap-2 h-9 relative transition-colors ${
              disabled 
                ? "bg-slate-100 dark:bg-slate-900 border-slate-200 cursor-not-allowed opacity-60" 
                : "border-slate-200 dark:border-slate-800 bg-slate-50/20 hover:bg-slate-50 dark:hover:bg-slate-900/40 cursor-pointer"
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
                <ImageIcon className="h-4 w-4 text-slate-400 shrink-0" />
              ) : (
                <FileText className="h-4 w-4 text-slate-400 shrink-0" />
              )}
              <span className={`text-xs font-medium truncate ${value ? "text-slate-900 dark:text-slate-100" : "text-slate-400"}`}>
                {displayFileName}
              </span>
            </div>

            {/* Actions : Télécharger et Supprimer */}
            {value && (
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={handleDownloadClick}
                  className="p-1 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  title="Télécharger le fichier"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>

                {!disabled && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
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
            <span className="text-[11px] text-red-500 font-medium mt-1 block animate-in fade-in duration-150">
              {error[field.fieldName]}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}