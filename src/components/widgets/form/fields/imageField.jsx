import React, { useState, useRef, useEffect } from "react"
import { UploadCloud, X, RefreshCw, FileImage } from "lucide-react"
import { toast } from "sonner"
import { MAX_FILE_SIZE, uuidFileName } from "@/utils/Utils"
import { download } from "@/axios/DataService"
import { useOdooModal } from "../../notification/useOdooModal"
import { useTranslation } from "react-i18next"

export default function ImageField({ 
  value,           
  onChange,        
  field,
  widthClass = "w-full max-w-sm", 
  heightClass = "h-48",
  resources,
  setResources,
  disabled = false
}) {
  const [previewUrl, setPreviewUrl] = useState(value || null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [modal, ModalElement] = useOdooModal()
  const [localChange, setLocalChange] = useState(false)

  const { t } = useTranslation()

  useEffect(() => {
    let isMounted = true
    let fetchedUrl = null

    const fetchImage = async () => {
      if (!value) {
        setPreviewUrl(null)
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        fetchedUrl = await download(value)
        if (isMounted && fetchedUrl != null) {
          setPreviewUrl(fetchedUrl)
        }
      } catch (error) {
        // Erreur silencieuse gérée par le fallback UI
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (!localChange) {
      fetchImage()
    }

    return () => {
      isMounted = false
      if (fetchedUrl) {
        URL.revokeObjectURL(fetchedUrl)
      }
    }
  }, [value, localChange])

  const handleFileChange = (file) => {
    if (!file || disabled) return

    if (!file.type.startsWith("image/")) {
      toast.error("Format invalide", {
        description: "Seuls les fichiers de type image (PNG, JPG, WEBP) sont autorisés."
      })
      return
    }

    if (file.size > MAX_FILE_SIZE * 1024 * 1024) {
      toast.error(t('filesize_warning'), {
        description: `${t('filesize_warning_message')} ${MAX_FILE_SIZE} Mo.`
      })
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setLocalChange(true)
    
    const images = [...(resources || [])]
    let imageuuid = value

    if (imageuuid == null || imageuuid === undefined) {
      imageuuid = uuidFileName(file)
    }

    if (onChange) {
      onChange(field, imageuuid)
    }

    const data = {
      name: imageuuid,
      description: '',
      action: 'create',
      file: file,
      previewUrl: objectUrl
    }

    const index = images.map(ig => ig.name).indexOf(value)
    if (index >= 0) {
      images.splice(index, 1)
    }
    images.push(data)
    setResources(images)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files[0]) {
      setLocalChange(true)
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleClear = (e) => {
    e.stopPropagation() 
    setPreviewUrl(null)
    setLocalChange(false)
    if (fileInputRef.current) fileInputRef.current.value = ""

    const images = [...(resources || [])]
    const index = images.map(ig => ig.name).indexOf(value)
    if (index >= 0) {
      images.splice(index, 1)
    }
    setResources(images)

    if (onChange) {
      onChange(field, null)
    }
  }

  return (
    <div className={`flex flex-col gap-1.5 ${widthClass}`}>
      
      {/* Libellé avec icône réactive au thème */}
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
        <FileImage className="h-3.5 w-3.5 text-[var(--brand-primary)] shrink-0" />
        {field?.label || field?.fieldName}
      </span>

      <input 
        type="file" 
        ref={fileInputRef}
        disabled={disabled}
        onChange={(e) => handleFileChange(e.target.files?.[0])}
        accept="image/*"
        className="hidden"
      />

      {/* Zone de dépôt / Aperçu */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden group transition-all ${heightClass} ${
          disabled
            ? "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-60"
            : isDragging 
              ? "border-[var(--brand-primary)] bg-[var(--brand-soft)] dark:bg-[var(--brand-soft-dark)] scale-[1.01] cursor-pointer" 
              : previewUrl
                ? "border-[var(--brand-border)] bg-slate-50/50 dark:bg-slate-900/40 hover:border-[var(--brand-primary)] cursor-pointer"
                : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-[var(--brand-primary)] hover:bg-[var(--brand-soft)]/40 dark:hover:bg-[var(--brand-soft-dark)] cursor-pointer"
        }`}
      >
        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt="Aperçu" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setPreviewUrl(null)}
            />
            {!disabled && (
              <div className="absolute inset-0 bg-slate-950/45 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2.5 transition-opacity duration-200 backdrop-blur-[1px]">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  title="Remplacer l'image"
                  className="p-2 bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 hover:text-[var(--brand-primary)] rounded-full hover:scale-110 shadow-md transition-all cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  title="Supprimer l'image"
                  className="p-2 bg-red-600/90 text-white rounded-full hover:bg-red-600 hover:scale-110 shadow-md transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-3 space-y-1.5 select-none animate-in fade-in duration-200">
            <div className="p-2.5 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 rounded-xl text-slate-400 dark:text-slate-400 group-hover:text-[var(--brand-primary)] group-hover:border-[var(--brand-border)] shadow-2xs transition-colors">
              <UploadCloud className="h-4 w-4" />
            </div>
            <div className="space-y-0.5 max-w-[90%]">
              <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 line-clamp-2">
                Glissez ou <span className="text-[var(--brand-primary)] font-bold underline decoration-[var(--brand-border)] underline-offset-2">parcourez</span>
              </p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 hidden sm:block">
                Max {MAX_FILE_SIZE} Mo
              </p>
            </div>
          </div>
        )}
      </div>

      {ModalElement}
    </div>
  )
}