import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ChevronDown, Menu } from "lucide-react"

import DesktopMenu from "./DesktopMenu"
import MobileMenu from "./MobileMenu"
import LoginWidget from "@/components/pages/security/LoginWidget"
import { getSessionPlugins, loadPlugin } from "@/axios/DataService"

const isNodeOrDescendantActive = (item, activeMenu) => {
  if (!item || !activeMenu) return false
  const activeId = typeof activeMenu === "object" ? activeMenu.seqnumber : activeMenu
  if (item.seqnumber != null && item.seqnumber === activeId) return true
  if (Array.isArray(item.navigations)) {
    return item.navigations.some((child) => isNodeOrDescendantActive(child, activeMenu))
  }
  return false
}

export default function PluginHeader({
  pluginName, 
  menus = [], 
  activeMenu, 
  setActiveMenu,
  setPlugin,
  companyLogo = null,
  companyName = "Entreprise",
  erpTemplate
}) {
  const navigate = useNavigate()
  const [logoError, setLogoError] = useState(false)
  const [plugins, setPlugins] = useState([])
  const [activePluginId, setActivePluginId] = useState(null)

  const hasValidLogo = Boolean(companyLogo) && !logoError

  useEffect(() => {    
    if (erpTemplate == "NAV_PLUGIN_003") {
      loadSessionPlugins()
    }
  }, [erpTemplate])

  useEffect(() => {
    if (plugins && Array.isArray(plugins) && plugins.length > 0) {
      getPluginForid(plugins[0].id ?? plugins[0])
    } 
  }, [plugins])

  const getPluginForid = async (id) => {
    const targetId = typeof id === "object" ? id.id : id
    setActivePluginId(targetId)
    const plug = await loadPlugin(targetId)
    if (setPlugin) {
      setPlugin(plug)
    }
  }

  const loadSessionPlugins = async () => {
    const result = await getSessionPlugins()
    setPlugins(result || [])
  }

  const showPluginHeader = () => erpTemplate == "NAV_PLUGIN_002"

  return (
    <header className="w-full border-b border-[var(--topbar-border)] bg-[var(--topbar-bg)] text-[var(--topbar-text)] px-6 py-2 flex items-center justify-between shadow-2xs transition-colors">
      
      {/* ZONE GAUCHE : Logo, Menu Mobile, Titre & Navigation Horizontale */}
      <div className="flex items-center gap-3.5 overflow-hidden">
        
        {/* 1. Logo de l'entreprise */}
        {hasValidLogo && (
          <div 
            onClick={() => navigate("/apps")}
            title={companyName}
            className="flex items-center shrink-0 cursor-pointer pr-3 border-r border-[var(--topbar-border)] transition-colors"
          >
            <img
              src={companyLogo}
              alt={companyName}
              onError={() => setLogoError(true)}
              className="h-11 w-auto max-w-[130px] object-contain"
            />
          </div>
        )}

        {/* 2. Déclencheur Mobile */}
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger className="p-2 text-[var(--topbar-text)] hover:bg-[var(--topbar-hover)] rounded-md cursor-pointer flex items-center transition-colors">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
              <SheetHeader className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                {hasValidLogo && (
                  <div className="mb-2">
                    <img
                      src={companyLogo}
                      alt={companyName}
                      className="h-7 w-auto max-w-[140px] object-contain"
                    />
                  </div>
                )}
                <SheetTitle className="text-left text-sm font-bold text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] uppercase tracking-wider">
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
                      isPlugin={true}
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

        {/* 3. Titre du Plugin (Desktop) */}
        <span className="text-base font-bold text-[var(--topbar-text)] tracking-tight border-r border-[var(--topbar-border)] pr-5 hidden sm:inline-block shrink-0 transition-colors">
          {pluginName}
        </span>

        {/* 4. Liens de Navigation Desktop */}
        {showPluginHeader() ? (
          <nav className="hidden sm:flex items-center gap-1 text-sm font-medium">
            {menus.map((menu) => {
              const hasChildren = Array.isArray(menu.navigations) && menu.navigations.length > 0
              const isActive = isNodeOrDescendantActive(menu, activeMenu)

              if (!hasChildren) {
                return (
                  <button
                    type="button"
                    key={menu.seqnumber}
                    onClick={() => setActiveMenu(menu)}
                    className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-[var(--topbar-active-bg)] text-[var(--topbar-active-text)] font-semibold shadow-2xs"
                        : "text-[var(--topbar-text)] hover:bg-[var(--topbar-hover)]"
                    }`}
                  >
                    {menu.label}
                  </button>
                )
              }

              return (
                <DropdownMenu key={menu.seqnumber}>
                  <DropdownMenuTrigger
                    className={`px-3 py-1.5 rounded-md font-medium inline-flex items-center gap-1 transition-all focus:outline-none cursor-pointer ${
                      isActive
                        ? "bg-[var(--topbar-active-bg)] text-[var(--topbar-active-text)] font-semibold"
                        : "text-[var(--topbar-text)] hover:bg-[var(--topbar-hover)]"
                    }`}
                  >
                    <span>{menu.label}</span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-75" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-56 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg"
                  >
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
              const isPluginActive = activePluginId === plugin.id || activeMenu === plugin.id
              return (
                <button
                  type="button"
                  key={plugin.id}
                  onClick={() => getPluginForid(plugin.id)}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    isPluginActive
                      ? "bg-[var(--topbar-active-bg)] text-[var(--topbar-active-text)] font-semibold shadow-2xs"
                      : "text-[var(--topbar-text)] hover:bg-[var(--topbar-hover)]"
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
    </header>
  )
}