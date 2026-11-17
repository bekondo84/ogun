import React, { useState, useRef, useEffect } from "react"
import { UploadCloud, X, RefreshCw, FileImage } from "lucide-react"
import { toast } from "sonner"
import { useSearchMoreModal } from "../../notification/useSearchMoreModal"
import { download } from "@/axios/DataService"

export default function MediaField({ 
  value,           
  onChange,        
  field ,
  maxSizeInMB = 5,
  disabled = false,
  widthClass = "w-full max-w-sm", 
  heightClass = "h-48"
}) {
  const [previewUrl, setPreviewUrl] = useState(value || null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const [modal, ModalElement] = useSearchMoreModal()
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)

   useEffect(() => {
      //console.log('-----ManyToOneInput ----------------------------------- :'+JSON.stringify(value))
      if (value && field?.meta) {
        setInputValue(value?.stringValue)
        setSelectedItem(value)
        setSuggestions(value)
      } else {
        setSelectedItem(null)
        setInputValue("")
        setSuggestions(null)
      }
      downloadFile(value)
    }, [value, field /*, onFindById*/])

    const downloadFile = async(media) => {
      var file = media?.url
      try {
          if (!file) {
            return;
          }
          var isMounted = true
          const objectUrl = await download(file)
          // console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&& : '+JSON.stringify(objectUrl))
            
          if (isMounted && objectUrl != null) {
            setPreviewUrl(objectUrl)
          }
      } catch (error) {
        //console.error("Erreur lors du chargement de l'image sécurisée :", error);
       // if (isMounted) setLoading(false);
      }     
      return () => {
          isMounted = false;
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
          }
        };  
    }

    const handleSelect = async(item) => {
     // console.log('***************************** : '+JSON.stringify(item))
      setSelectedItem(item)
      setInputValue(item.stringValue)
      onChange(field, item)
      setIsOpen(false)
      await downloadFile(item)
      //setIsModalOpen(false)
    }

  const handleMediaChange = async() => {
      setIsOpen(true);         
      try {
          const result = await modal({
              isOpen: true, // 
              onClose: () => setIsOpen(false),
              meta: field?.meta,
              data: suggestions,
              onSelect: handleSelect
          });
          
          // Si votre hook retourne les données sélectionnées via la promesse :
          if (result) {
              handleSubmit(result);
          }
      } catch (error) {
          console.log("Modale fermée ou annulée", error);
      } finally {
          setIsOpen(false);
      }
    //console.log('------------ HandleMedia detected ------------------')
  }

  const handleClear = (e) => {
    e.stopPropagation() 
    setPreviewUrl(null)
    if (onChange) onChange(field, null)
  }

  return (
    //Utilisation de widthClass pour contrôler la largeur du bloc entier
    <div className={`flex flex-col gap-1.5 ${widthClass}`}>
      
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
        <FileImage className="h-3.5 w-3.5 text-[var(--brand-primary)] shrink-0" />
        {field.fieldName}
      </span>

      {/* Injection dynamique de heightClass pour contrôler la hauteur de la zone */}
      <div 
         onClick={handleMediaChange}
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
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-200 backdrop-blur-[1px]">
              <button
                type="button"
                onClick={handleMediaChange}
                className="p-2 bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 hover:text-[var(--brand-primary)] rounded-full hover:scale-110 shadow-md transition-all cursor-pointer"
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
            <div className="p-2.5 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 rounded-xl text-slate-400 dark:text-slate-400 group-hover:text-[var(--brand-primary)] group-hover:border-[var(--brand-border)] shadow-2xs transition-colors">
              <UploadCloud className="h-4 w-4" />
            </div>
            {/* Masquage intelligent du sous-texte sur les très petits formats de hauteur (ex: h-24) */}
            <div className="space-y-0.5 max-w-[90%]">
              <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 line-clamp-2">
                Cliquer ou <span className="text-[var(--brand-primary)] font-bold">parcourez</span>
              </p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 hidden sm:block">
                Max {maxSizeInMB} Mo
              </p>
            </div>
          </div>
        )}
      </div>
       {ModalElement}
    </div>
  )
}
