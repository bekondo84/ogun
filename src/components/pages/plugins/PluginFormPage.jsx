import React, { useState, useEffect } from "react"
import { toast } from "sonner"
import { useParams } from "react-router-dom"
import { useGetPlugin } from "@/hooks/usePlugin"
import PluginHeader from "@/components/widgets/plugins/PluginHeader"
import ListFormPage from "@/components/pages/forms/ListFormPage"
import FormPage from "@/components/pages/forms/FormPage"
import { Loader2, AlertTriangle } from "lucide-react"
import { getMeta, getMetaFromTypeCode } from "@/axios/MetaService"
import { executedPostMethod, uploadFile } from "@/axios/DataService"
import DashboardPage from "../dashbord/DashboardPage"
import { refreshBreadcrumbs, refreshSnapshaps, removeLastsystemSnapshaps, updateSystemSnapshaps } from "@/utils/Utils"
import { useOdooModal } from "@/components/widgets/notification/useOdooModal"

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
  const [resources, setResources] = useState([]) //contains formData for upload files
  const [searchConfig, setSearchConfig] = useState({})
  const [predicates, setPredicates] = useState([])
  const [sortConfig, setSortConfig] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [viewMode, setViewMode] = useState("list")
  const [allowedViews, setAllowedViews] = useState("")
  const [editMode, setEditMode] = useState('V')
  const [snapshotstore, setSnapshotstore] = useState([])
  const [breadcrumbs, setBreadcrumbs] = useState([])
  const [modal, ModalElement] = useOdooModal();
  
  
  
  useEffect(() => {
      //console.log('-------Change of resource are detected size :::::: '+resources.length+' ----------- '+JSON.stringify(data))
  }, [resources])
  //For every change of th snapshots update the breadcrumps 
  useEffect(() => {
      setBreadcrumbs(refreshBreadcrumbs(snapshotstore))
      //console.log('+++++++++++++++++++++++++++++'+JSON.stringify(refreshBreadcrumbs(snapshotstore)))
  }, [snapshotstore])
  //SYNCHRONISATION : Dés que l'API renvoie les menus du serveur, on charge le premier par défaut
  useEffect(() => {
    if (plugin && plugin.menus && plugin.menus.length > 0) {
      const firstMenu = getFirstMenuItem(plugin.menus[0])

      if (firstMenu) {
        setActiveMenu(firstMenu)
        handleMenuChange (firstMenu)
        // On utilise le "viewMode" configuré par le serveur (ex: 'list' ou 'form')
        setViewType(firstMenu.viewMode || "list")
        setAllowedViews(firstMenu.viewMode)
      }
    }
  }, [plugin])

  const getFirstMenuItem =  (menu) => {
      if (menu && menu.type) {
        return menu;
      } else if (menu.navigations.length > 0) {
           return getFirstMenuItem(menu.navigations[0])
      }
      return null;
  }
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
         await fetchData (pageNumer, metadata, predicat, sortrules)    
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
         setSnapshotstore(removeLastsystemSnapshaps(snapshotstore))
     } finally {
       setIsLoading(false)
     }
  }

  const handleSelected = async(record) => {
      setResources([])
      setIsLoading(true)
      try {
         if (metadata !== null && activeMenu.viewMode.includes('view')) {
          setViewMode('view')
          setEditMode('V')
          //var item = data.data.filter(d => d.seqnumber == record.seqnumber)[0]
          const response = await executedPostMethod(metadata.action, "fetchitem", {
              data: record,
              plugin: null,
              class: metadata.type,
              typeCode: metadata.typeCode
          })
          setData(response.data)
        //console.log('----------Vous avez selectionner : '+JSON.stringify(response.data))
        setSnapshotstore(updateSystemSnapshaps(snapshotstore, record.stringValue, metadata, response.data,[],'view'))
       }
      } finally {
         setIsLoading(false)
      }  
  }

  const handleSave = async(mode, item) => {
    
    if (mode === 'V') {
       setEditMode('U')
    }
    if (mode === 'C' || mode ==='U') {
        try {
          setIsLoading(true)
          const response = await executedPostMethod(metadata.action, "save", {
            data: item,
            typeCode:metadata.typeCode
          })
          //Upload resource and clean if exist
          for (var index in resources) {
            const resource = new FormData()
            resource.append('file', resources[index].file)
            resource.append('name', resources[index].name)
            //console.log('-------------------- File recieve---- '+JSON.stringify(resources[res].file))
              await uploadFile(resource)
          }
          setResources([])
        } finally {
          setIsLoading(false)
          setEditMode('V')
        }
    }
    
  }

  const handleOnCreate = async() => {
    setIsLoading(true)
    try {
      setViewMode("view")
      setEditMode('C')
      const response = await executedPostMethod(metadata.action, "create", {
          typeCode:metadata.typeCode
      })
      setData(response.data)
    } finally {
      setIsLoading(false)
    }
    
  }

  const onBreadcrumbAction = async(breadcrumb) => {
     try {
        setIsLoading(true)
        const context = snapshotstore[breadcrumb.key]
        const meta = context.meta
        const data = context.data
        const viewMode = context.viewmode
        setMetadata(meta)
        setViewMode(viewMode)
        setAllowedViews(meta.viewMode)
        //console.log('------------------------------------------ '+JSON.stringify(context.meta))
        if (context.data != null) {
           const response = await executedPostMethod(meta.action, "fetchitem", {
              data: data,
              plugin: null,
              class: meta.type,
              typeCode: meta.typeCode
          })
          setData(response.data)
        } else {
          await fetchData(1, meta, [], [])
        }
       //console.log('Click detected on breadcrumb  ::: '+JSON.stringify(breadcrumb.key)+'----------'+snapshotstore.length+' -----'+snapshotstore.slice(0,breadcrumb.key+1).length)
       setSnapshotstore(updateSystemSnapshaps(refreshSnapshaps(breadcrumb.key, snapshotstore), context.label, meta, data, [], viewMode))
     } finally {
        setIsLoading(false)
     }
  }

  const handleOnDelete = (indexs) => {
   // console.log('--------Detection dune demande de tri'+JSON.stringify(searchConfig))
    alert("delete ids : " + indexs)
  }

  const handleOnAction = async(metadata, data, action) => {
    //console.log('Custom user action detected ---------------')
     const isConfirmed = await modal({
      title: "Confirmation de suppression",
      message: `Êtes-vous sûr de vouloir supprimer l'élément  ? Cette action est irréversible.`,
      variant: "danger",
      confirmText: "Oui, supprimer",
      cancelText: "Annuler",
      showCancel: true
    });

    if (!isConfirmed) return;
    console.log('User confirm the execution of the action ---------------')
  }

  const handleShutcutAction = async(shutcut)  => {
           
    setIsLoading(true)
           try {
                 setSelectedIds([])
                 const meta = await getMetaFromTypeCode(shutcut.type)
                 setMetadata(meta)
                 await fetchData(1, meta, [], [])
                 const targetView = meta.viewMode.split(',')[0]
                //console.log("Changement de vue ERP : " +menuObject.viewMode)
                setViewMode(targetView)
                setAllowedViews(meta.viewMode)
                if (targetView === "list") {
                      // setFormData({ company: "", contact: "", email: "", value: "" })
                  setSelectedIds([])
                }  
                let label = targetView != 'view' ? meta.listViewTitle : meta.formViewTitle
                //Initialize the 
                setSnapshotstore(updateSystemSnapshaps(snapshotstore, label, meta, null, [], targetView))

           } finally {
              setIsLoading(false)
           }
  }

  const fetchData = async(page, meta, predicates, sortConf) => {
       setCurrentPage(page)
      const response = await executedPostMethod(meta.action, "fetchitems", {
        startIndex:(page - 1) * meta.pageSize,
        pageSize : meta.pageSize,
        predicates : !!predicates ? predicates : [] ,
        sort:sortConf,
        typeCode:meta.typeCode
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
        await fetchData(1, meta, [], [])
      }
      //console.log (data)
      
      setActiveMenu(menuObject)
      const targetView = meta.viewMode.split(',')[0]
      //console.log("Changement de vue ERP : " +menuObject.viewMode)
      setViewMode(targetView)
      setAllowedViews(meta.viewMode)
      
      // Nettoyage de l'espace de travail lors du changement d'onglet de liste
      if (targetView === "list") {
      // setFormData({ company: "", contact: "", email: "", value: "" })
        setSelectedIds([])
      }  
      //Initialize the 
      setSnapshotstore(updateSystemSnapshaps([], menuObject.label, meta, null, [], targetView))
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
                viewMode !== "view" && viewMode !== "dashboard"  ? (
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
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  totalPages={totalPages}
                  viewMode={viewMode}
                  allowedViews={allowedViews}
                  breadcrumbs={breadcrumbs}
                  setViewMode={setViewMode}
                  onCreate={handleOnCreate}
                  onDelete={handleOnDelete}
                  onSelected={handleSelected}
                  onRefresh={onRefresh}
                  onBreadcrumbAction={onBreadcrumbAction}
                />
              ) : viewMode ==="dashboard" ? (
                   <DashboardPage metadata={{ type: "global", action: "analytics" }} />
              ) :(
                <FormPage 
                  metadata={metadata}
                  item={data}
                  breadcrumbs={breadcrumbs}
                  editMode={editMode}
                  isLoading={isLoading}
                  setFormValues={setData}
                  resources={resources}
                  setResources={setResources}
                  onSave={handleSave}
                  onCancel={handleCancel} 
                  onAction={handleOnAction}
                  shutcutAction={handleShutcutAction}
                  onBreadcrumbAction={onBreadcrumbAction}
                />
              )
            )}
          </div>
          {ModalElement}
        </div>
      </main>

    </div>
  )
}