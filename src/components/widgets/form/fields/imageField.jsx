import React, { useState, useRef, useEffect } from "react"
import { UploadCloud, X, RefreshCw, FileImage } from "lucide-react"
import { toast } from "sonner"
import { extension, uuidFileName } from "@/utils/Utils"
import { download } from "@/axios/DataService"
import { useOdooModal } from "../../notification/useOdooModal"
import { useTranslation } from "react-i18next"

export default function ImageField({ 
  value,           
  onChange,        
  field ,
  maxSizeInMB = 5,
  widthClass = "w-full max-w-sm", 
  heightClass = "h-48",
  resources,
  setResources,
}) {
  const [previewUrl, setPreviewUrl] = useState(value || null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [modal, ModalElement] = useOdooModal();

  const {t, i18n} = useTranslation()

  useEffect(() => {
        downloadFile(value)
        
  }, [value])

 const downloadFile = async(file) => {
      try {
        if (!file) {
          setLoading(false);
          return;
        }
        var isMounted = true
        const objectUrl = await download(file)
       // console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&& : '+JSON.stringify(objectUrl))
          
        if (isMounted && objectUrl != null) {
          setPreviewUrl(objectUrl)
          setLoading(false)
        }
      } catch (error) {
        //console.error("Erreur lors du chargement de l'image sécurisée :", error);
        if (isMounted) setLoading(false);
      }     
      return () => {
          isMounted = false;
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
          }
        };  
 }
  const handleFileChange = (file) => {
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Format invalide", {
        description: "Seuls les fichiers de type image (PNG, JPG, WEBP) sont autorisés."
      })
      return
    }

    if (file.size > maxSizeInMB * 1024 * 1024) {
      toast.error("Fichier trop lourd", {
        description: `La taille de l'image ne doit pas dépasser ${maxSizeInMB} Mo.`
      })
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    
    const images = [...resources]
    
    var imageuuid = value //uuidFileName(file)

    if (imageuuid == null || imageuuid == undefined) {
        imageuuid = uuidFileName(file)
    }

    if (onChange) {
      onChange(field, imageuuid)
    }

    var data = {
        name: imageuuid,
        description: '',
        action:'create',
        file: file,
        previewUrl: URL.createObjectURL(file)
    }
    var index = images.map(ig => ig.name).indexOf(value)
    //Remove if exist
    if (index >=0) {
      images.splice(index, 1)
    }
    images.push(data)
    setResources(images)
    //console.log('-----------------handleFileChange ------------------'+uuidFileName(file))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleClear = async(e) => {
    e.stopPropagation() 
    setPreviewUrl(null)
    if (onChange) onChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    //Remove if exist

    var images = [...resources]
    var index = images.map(ig => ig.name).indexOf(value)
    if (index >=0) {
      images[index].action='delete'
    }
    setResources(images)

    if (onChange) {
      onChange(field, null)
    }
    //console.log('-----------------handleClear ------------------'+images.length)
  }

  return (
    //Utilisation de widthClass pour contrôler la largeur du bloc entier
    <div className={`flex flex-col gap-1.5 ${widthClass}`}>
      
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
        <FileImage className="h-3.5 w-3.5 text-slate-400" />
        {field.fieldName}
      </span>

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e.target.files[0])}
        accept="image/*"
        className="hidden"
      />

      {/* Injection dynamique de heightClass pour contrôler la hauteur de la zone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden cursor-pointer group bg-slate-50/50 dark:bg-slate-950/20 transition-all ${heightClass} ${
          isDragging 
            ? "border-purple-600 bg-purple-50/20 dark:bg-purple-950/10" 
            : "border-slate-200 dark:border-slate-800 hover:border-purple-500/60"
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
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-200 backdrop-blur-[1px]">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="p-2 bg-white/90 text-slate-700 rounded-full hover:bg-white hover:scale-110 shadow-md transition-all"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-2 bg-red-600/90 text-white rounded-full hover:bg-red-600 hover:scale-110 shadow-md transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-3 space-y-1 select-none animate-in fade-in duration-200">
            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-400 group-hover:text-purple-600 transition-colors">
              <UploadCloud className="h-4 w-4" />
            </div>
            {/* Masquage intelligent du sous-texte sur les très petits formats de hauteur (ex: h-24) */}
            <div className="space-y-0.5 max-w-[90%]">
              <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 line-clamp-2">
                Glissez ou <span className="text-purple-700 dark:text-purple-400 font-bold">parcourez</span>
              </p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 hidden sm:block">
                Max {maxSizeInMB} Mo
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
