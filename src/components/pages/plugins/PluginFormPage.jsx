import React, { useState, useEffect } from "react"
import { toast } from "sonner"
import { useParams } from "react-router-dom"
import { useGetPlugin } from "@/hooks/usePlugin"
import PluginHeader from "@/components/widgets/plugins/PluginHeader"
import ListFormPage from "@/components/pages/forms/ListFormPage"
import FormPage from "@/components/pages/forms/FormPage"
import { Loader2, AlertTriangle } from "lucide-react"
import { getMeta } from "@/axios/MetaService"
import { executedPostMethod } from "@/axios/DataService"

export default function PluginFormPage() {
  const { id } = useParams()
  
  // 🚀 Appel API REST TanStack Query sécurisé (Ne se lance que si l'ID de route existe)
  const { 
    data: plugin = {}, 
    isLoading: isPluginLoading, 
    isError: isPluginError, 
    error: pluginError 
  } = useGetPlugin(id)

  // États de l'interface ERP
  const [activeMenu, setActiveMenu] = useState(null)
  const [viewType, setViewType] = useState("list") // 'list' ou 'form'
  const [formData, setFormData] = useState({ company: "", contact: "", email: "", value: "" })
  const [selectedIds, setSelectedIds] = useState([])
  const [metadata, setMetadata] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({})
  const [searchConfig, setSearchConfig] = useState({})
  const [predicates, setPredicates] = useState([])
  const [sortConfig, setSortConfig] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [viewMode, setViewMode] = useState("list")
  const [allowedViews, setAllowedViews] = useState("")
  const [editMode, setEditMode] = useState(false)
    
  
  // 🚀 SYNCHRONISATION : Dés que l'API renvoie les menus du serveur, on charge le premier par défaut
  useEffect(() => {
    if (plugin && plugin.menus && plugin.menus.length > 0) {
      const firstMenu = plugin.menus[0]
      setActiveMenu(firstMenu)
      //handleMenuChange (firstMenu)
      // On utilise le "viewMode" configuré par le serveur (ex: 'list' ou 'form')
      setViewType(firstMenu.viewMode || "list")
      setAllowedViews(firstMenu.viewMode)
    }
  }, [plugin])
  // Gestion des actions de bascule
  const onRefresh = async (sortConf, predicat, page)  => {
    setIsLoading(true);

    if (predicat !== null) {
       setPredicates(predicat)
    }
    var sortrules = []
    if(sortConf !== null && sortConf.key !== null) {
      setSortConfig(sortConf)
      sortrules = [sortConf.key+':'+sortConf.direction]
    }
    var pageNumer = 1;
    if (page !== null) {
       pageNumer = page;
    }
    //console.log('-----------------------------! '+currentPage)
    try {
      if (metadata !== null) {
         await fetchData (pageNumer, metadata)    
      }
    } finally {
      setIsLoading(false);
    }
  }
  const handleCancel = async() => {
     setIsLoading(true)

     try {
         await fetchData(currentPage, metadata)
         setViewMode("list")
     } finally {
       setIsLoading(false)
     }
  }

  const handleSelected = async(record) => {
      setIsLoading(true)
      try {
         if (metadata !== null && activeMenu.viewMode.includes('view')) {
          setViewMode('view')
          setEditMode(false)
          //var item = data.data.filter(d => d.seqnumber == record.seqnumber)[0]
          const response = await executedPostMethod(metadata.action, "fetchitem", {
              data: record,
              plugin: null,
              class: metadata.type
          })
          setData(response.data)
        //console.log('----------Vous avez selectionner : '+JSON.stringify(response.data))
       }
      } finally {
         setIsLoading(false)
      }  
  }

  const handleSave = async(mode, item) => {
   // console.log('---------------PluginFormPage.handleSave ----------------------- '+JSON.stringify(metadata))
    
    setEditMode(!mode)
    if (mode) {
        try {
          setIsLoading(true)
          const response = await executedPostMethod(metadata.action, "save", {
            data: item,
            class:metadata.type
          })
        } finally {
          setIsLoading(false)
        }
    }
    
  }

  const handleOnCreate = async() => {
    setIsLoading(true)
    try {
      setViewMode("view")
      setEditMode(true)
      const response = await executedPostMethod(metadata.action, "create", {
          class: metadata.type
      })
      setData(response.data)
    } finally {
      setIsLoading(false)
    }
    
  }

  const handleOnDelete = (indexs) => {
    console.log('--------Detection dune demande de tri'+JSON.stringify(searchConfig))
    alert("delete ids : " + indexs)
  }

  const handleOnAction = () => {
     console.log('----------Dectection of OnAction Event ---------')
  }

  const fetchData = async(page, meta) => {
       setCurrentPage(page)
      const response = await executedPostMethod(meta.action, "fetchitems", {
        startIndex:(page - 1) * meta.pageSize,
        pageSize : meta.pageSize,
        predicates : [],
        class : meta.type
      })
      setData(response)
      setTotalPages(Math.ceil(response.nbreofitems / meta.pageSize))
  }
  // Déclencheur lors d'un clic sur le menu ou sous-menu récursif
  const handleMenuChange = async (menuObject) => {

    try {
      //console.log(menuObject)
      if (!menuObject) return
      
      setIsLoading(true)
      //Inti searchConfig, predicates et sortConfig elements
      setSearchConfig({})
      setSortConfig({})
      setPredicates([])
      const meta = await getMeta(menuObject.code)
      
      if (meta !== null) {
        setMetadata (meta)
        await fetchData(1, meta)
      }
      //console.log (data)
      
      setActiveMenu(menuObject)
      const targetView = menuObject.viewMode.split(',')[0]
      //console.log("Changement de vue ERP : " +menuObject.viewMode)
      setViewMode(targetView)
      setAllowedViews(menuObject.viewMode)
      
      // Nettoyage de l'espace de travail lors du changement d'onglet de liste
      if (targetView === "list") {
      // setFormData({ company: "", contact: "", email: "", value: "" })
        setSelectedIds([])
      }  
      
    } finally {
      setIsLoading(false)
    } /* (error) {
        //console.log(' Error detail ----- :'+JSON.stringify(error))
        const serverMessage = error?.message || "Impossible de charger les menus du plugin."
        toast.error("Echec du chargement", {
          description: `${serverMessage} (code: ${error?.status || 'Serveur'})`
        })
    }*/
    
  }

  // 2. Gestion des anomalies de route
  if (isPluginError) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-red-50 text-red-700 p-4 text-center gap-2">
        <AlertTriangle className="h-6 w-6" />
        <span className="text-xs font-bold">Échec du chargement du plugin</span>
        <span className="text-[11px] opacity-80">{pluginError?.message}</span>
      </div>
    )
  }

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col antialiased overflow-hidden">
      
      {/* Inclusion de l'en-tête dynamique alimenté par le serveur */}
      <PluginHeader 
        pluginName={plugin.label || "Application"} 
        menus={plugin.menus || []} 
        activeMenu={activeMenu} 
        setActiveMenu={(menuId, obj) => handleMenuChange(obj || menuId)} 
      />
      
      {/* Zone principale figée (Désactivation du scroll principal de la page) */}
      <main className="flex-1 bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-0 md:p-0 scrollbar-thin">
          <div className="max-w-none w-full mx-auto animate-in fade-in duration-150">
            
              {metadata && (
                viewMode !== "view"  ? (
                <ListFormPage
                  predicates={predicates}
                  setPredicates={setPredicates} 
                  sortConfig={sortConfig}
                  setSortConfig={setSortConfig}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  items={data.data}
                  metadata={metadata}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                  viewMode={viewMode}
                  allowedViews={allowedViews}
                  setViewMode={setViewMode}
                  onCreate={handleOnCreate}
                  onDelete={handleOnDelete}
                  onSelected={handleSelected}
                  onRefresh={onRefresh}
                  onAction={handleOnAction}
                />
              ) : (
                <FormPage 
                  metadata={metadata}
                  item={data}
                  editMode={editMode}
                  isLoading={isLoading}
                  setFormValues={setData}
                  onSave={handleSave}
                  onCancel={handleCancel} 
                />
              )
            )}

          </div>
        </div>
      </main>

    </div>
  )
}