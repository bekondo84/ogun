import React, { useState } from "react"
import PluginHeader from "@/components/widgets/plugins/PluginHeader"
import ListFormPage from "@/components/pages/forms/ListFormPage"
import FormPage from "@/components/pages/forms/FormPage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldAlert, History, FileText } from "lucide-react"
import { useParams } from "react-router-dom"


const CONFIG_MENUS = [
  { id: "leads", label: "Pistes de Vente", defaultView: "list"},
  { id: "pipeline", label: "Mon Pipeline", defaultView: "form" },
  { 
    id: "customers", 
    label: "Clients & Contacts", 
    children: [
      { id: "all-customers", label: "Tous les Clients", defaultView: "list" },
      { id: "companies", label: "Sociétés", defaultView: "list" },
      { 
        id: "segmentation", 
        label: "Segmentation", 
        children: [
          { id: "vip-clients", label: "Clients VIP", defaultView: "list"},
          { id: "inactive-clients", label: "Clients Inactifs", defaultView: "list" }
        ]
      }
    ]
  },
  { 
    id: "plus", 
    label: "Plus", 
    children: [
      { id: "analytics", label: "Analyses Globales", defaultView: "list" },
      {
        id: "configuration",
        label: "Configuration",
        children: [
          { id: "teams", label: "Équipes de Ventes", defaultView: "list" },
          {
            id: "advanced",
            label: "Paramètres Avancés",
            children: [
              { id: "rules", label: "Règles d'attribution", defaultView: "list" },
              {
                id: "security",
                label: "Sécurité & Logs",
                children: [
                  { id: "history", label: "Historique des accès", defaultView: "list" },
                  { id: "errors", label: "Rapports d'erreurs", defaultView: "list" }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]

export default function PluginFormPage() {
  const [activeMenu, setActiveMenu] = useState({})
  const [formData, setFormData] = useState({ company: "", contact: "", email: "", value: "" })
  const [viewType, setViewType] = useState("list") // Mode actif
  const [formValues, setFormValues] = useState({})
   const [selectedIds, setSelectedIds] = useState([])
  //const [currentMenu, setCurrentMenu] = useState({})
  const { id } = useParams()

  const handleCancel = () => {
        setViewType('list')
  }

  const handleSelected = (id) => {
     setViewType('form')
     console.log('Selected ID is : '+id)
  }

  const handleSave = (e) => {
   // e.preventDefault()
    alert(`Données sauvegardées !`)
  }

  const handleOnCreate = () => {
     setViewType('form')
  }

  const handleOnDelete = (indexs) => {
       alert ("delete ids : "+indexs)
  }

   // Déclencheur personnalisé lors d'un clic sur le menu ou sous-menu du PluginHeader
  const handleMenuChange = (menu, targetMenuObject) => {
   // alert("clik on menu "+menuId)
    setActiveMenu(menu)
    //console.log(menu)
    // On extrait le mode d'affichage par défaut configuré (défaut sur 'list' si non spécifié)
    const defaultView = menu?.defaultView || "list"
    console.log("ViewType ::: "+defaultView)
    setViewType(defaultView)
    
    // Si on bascule sur un nouveau menu de liste, on nettoie les fiches d'édition et sélections
    if (defaultView === "list") {
      setFormValues({})
      setSelectedIds([])
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col antialiased">
      <PluginHeader pluginName="CRM & Ventes" menus={CONFIG_MENUS} activeMenu={activeMenu} setActiveMenu={(menuId, obj) => handleMenuChange(menuId, obj)} />
      
      <main className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col antialiased overflow-y-auto">
        {viewType === 'list' ? (
             <ListFormPage 
                 onCreate ={ handleOnCreate }
                 onDelete={ (indexs) => handleOnDelete(indexs)}
                 onSelected= { (id)  => handleSelected(id)}/>
        ) : (
           <FormPage 
               onSave={ () => handleSave()}
               onCancel={ () => handleCancel()} />
        )}
      </main>
    </div>
  )
}