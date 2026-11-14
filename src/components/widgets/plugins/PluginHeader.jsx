import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ChevronDown, Menu, LayoutGrid } from "lucide-react"

import DesktopMenu from "./DesktopMenu"
import MobileMenu from "./MobileMenu"
import LoginWidget from "@/components/pages/security/LoginWidget"
import { getSessionPlugins, loadPlugin } from "@/axios/DataService"

export default function PluginHeader({
  pluginName, 
  menus = [], 
  activeMenu, 
  setActiveMenu,
  setPlugin,
  companyLogo = null,      // URL ou import du logo de l'entreprise
  companyName = "Entreprise",
  erpTemplate // Nom pour l'accessibilité (alt / title)
}) {
  const navigate = useNavigate()
  const [logoError, setLogoError] = useState(false)

  // Affiche le logo uniquement s'il est fourni et valide
  const hasValidLogo = Boolean(companyLogo) && !logoError

  const [plugins, setPlugins] = useState([]);

  useEffect(() => {    
       if (erpTemplate == 'NAV_PLUGIN_003') {
           loadSessionPlugins();
       }
  }, [erpTemplate])

  useEffect(() => {
      if (plugins && Array.isArray(plugins) && plugins.length > 0 ) {
          getPluginForid(plugins[0]);
      } 
  }, [plugins])

  const getPluginForid = async(id) => {
     const plug = await loadPlugin(id);
     if (setPlugin) {
       setPlugin (plug);
     }
  }
   /**
   * 
   */
  const loadSessionPlugins = async() => {
     const result = await getSessionPlugins();
     setPlugins(result);
     //console.log('PluginHeader ................................ '+JSON.stringify(result))
  }

  const showPluginHeader = () => {
        return erpTemplate == 'NAV_PLUGIN_002'
  }

  const handleLaunchApp = (appId) => {
    console.log('<<<<< : '+appId)
    navigate(`/apps/${appId}`)
  }
  

  return (
    <div className="w-full border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-6 py-2 flex items-center justify-between shadow-sm">
      
      {/* ZONE GAUCHE : Navigation, Logo, Retour Dashboard & Menu Burger */}
      <div className="flex items-center gap-3.5 overflow-hidden">
        
        {/* 1. Bouton de retour vers la page des applications (Style Odoo Home) 
        <button 
          onClick={() => navigate("/apps")}
          title="Retour aux applications"
          className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-md transition-all cursor-pointer flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
*/}
        {/* 2. Logo de l'entreprise (Cliquable vers l'accueil) */}
        {hasValidLogo && (
          <div 
            onClick={() => navigate("/apps")}
            title={companyName}
            className="flex items-center shrink-0 cursor-pointer pr-3 border-r border-slate-200 dark:border-slate-700"
          >
            <img
              src={companyLogo}
              alt={companyName}
              onError={() => setLogoError(true)}
              className="h-11 w-auto max-w-[130px] object-contain"
            />
          </div>
        )}

        {/* 3. Déclencheur Mobile */}
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger className="p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md cursor-pointer flex items-center">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-white dark:bg-slate-900 overflow-y-auto">
              <SheetHeader className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                {/* Rappel du logo dans le tiroir mobile */}
                {hasValidLogo && (
                  <div className="mb-2">
                    <img
                      src={companyLogo}
                      alt={companyName}
                      className="h-7 w-auto max-w-[140px] object-contain"
                    />
                  </div>
                )}
                <SheetTitle className="text-left text-sm font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                  {pluginName}
                </SheetTitle>
              </SheetHeader>
              {showPluginHeader() ? (
                <nav className="flex flex-col gap-0.5">
                  {menus.map((menu) => (
                    <MobileMenu 
                      key={menu.seqnumber} 
                      item={menu} 
                      setActiveMenu={setActiveMenu} 
                      activeMenu={activeMenu} 
                    />
                  ))}
                </nav>
              ) : (
                 <nav className="flex flex-col gap-0.5">
                    {plugins.map((plugin) => (
                      <MobileMenu 
                        key={plugin.id} 
                        item={plugin} 
                        isPlugin = {true}
                        setActiveMenu={setActiveMenu} 
                        activeMenu={activeMenu} 
                        loadPlugin={getPluginForid}
                      />
                    ))}
                  </nav>
              )}
              
            </SheetContent>
          </Sheet>
        </div>

        {/* 4. Titre du Plugin (Desktop) */}
        <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight border-r border-slate-200 dark:border-slate-700 pr-5 hidden sm:inline-block shrink-0">
          {pluginName}
        </span>

        {showPluginHeader() ? (
           <nav className="hidden sm:flex items-center gap-1 text-sm font-medium">
              {menus.map((menu) => {
                const hasChildren = menu.navigations && menu.navigations.length > 0

                if (!hasChildren) {
                  return (
                    <button
                      key={menu.seqnumber}
                      onClick={() => setActiveMenu(menu)}
                      className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                        activeMenu === menu.seqnumber
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      {menu.label}
                    </button>
                  )
                }

                return (
                  <DropdownMenu key={menu.seqnumber}>
                    <DropdownMenuTrigger className="px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 font-medium inline-flex items-center gap-1 transition-all focus:outline-none dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer">
                      <span>{menu.label}</span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 p-1">
                      {menu.navigations.map((child) => (
                        <DesktopMenu 
                          key={child.seqnumber} 
                          item={child} 
                          setActiveMenu={setActiveMenu} 
                          activeMenu={activeMenu} 
                        />
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              })}
          </nav>
        ) : (
             <nav className="hidden sm:flex items-center gap-1 text-sm font-medium">
              {plugins.map((plugin) => {
                return (
                    <button
                      key={plugin.id}
                      onClick={() => getPluginForid(plugin.id)}
                      className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                        activeMenu === plugin.id
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      {plugin.name}
                    </button>
                  )
               
              })}
          </nav>
        )}
        
      </div>

      {/* ZONE DROITE : Compte utilisateur harmonisé */}
      <LoginWidget />
    </div>
  )
}