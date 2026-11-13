import React, { useState } from "react"
import { 
  ChevronRight, 
  ChevronDown, 
  PanelLeftClose, 
  PanelLeftOpen, 
  LayoutDashboard, 
  FolderTree, 
  FileText,
  Layers
} from "lucide-react"

export default function PluginSidebar({ 
  menus = [], 
  activeMenu, 
  setActiveMenu, 
  isCollapsed, 
  setIsCollapsed 
}) {
  // Gère l'ouverture/fermeture des sous-menus en mode accordéon
  const [openGroups, setOpenGroups] = useState({})

  const toggleGroup = (seqnumber) => {
    if (isCollapsed) return // Pas d'accordéon si la sidebar est réduite
    setOpenGroups(prev => ({
      ...prev,
      [seqnumber]: !prev[seqnumber]
    }))
  }

  // Vérifie si un menu ou l'un de ses enfants est actif
  const isMenuActive = (menu) => {
    if (activeMenu?.seqnumber === menu.seqnumber || activeMenu === menu.seqnumber) return true
    if (menu.navigations) {
      return menu.navigations.some(child => child.seqnumber === activeMenu?.seqnumber || child === activeMenu)
    }
    return false
  }

  return (
    <aside 
      className={`relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-300 select-none shrink-0 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* 1. En-tête de la Sidebar & Bouton de bascule (Collapse / Expand) */}
      <div className="h-14 px-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        {!isCollapsed && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate px-2">
            Navigation Module
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer mx-auto"
          title={isCollapsed ? "Agrandir la barre latérale" : "Réduire la barre latérale"}
        >
          {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {/* 2. Liste des Menus (Style Odoo) */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {menus.map((menu) => {
          const hasChildren = menu.navigations && menu.navigations.length > 0
          const active = isMenuActive(menu)
          const isOpen = openGroups[menu.seqnumber] || active // S'ouvre automatiquement si actif

          if (!hasChildren) {
            return (
              <button
                key={menu.seqnumber}
                onClick={() => setActiveMenu(menu)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group ${
                  active
                    ? "bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-slate-800/60"
                }`}
                title={isCollapsed ? menu.label : undefined}
              >
                <div className={`shrink-0 ${active ? "text-purple-600 dark:text-purple-400" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500"}`}>
                  <FileText className="h-4 w-4" />
                </div>
                {!isCollapsed && <span className="truncate text-left">{menu.label}</span>}
              </button>
            )
          }

          return (
            <div key={menu.seqnumber} className="space-y-1">
              {/* Menu parent avec accordéon */}
              <button
                onClick={() => toggleGroup(menu.seqnumber)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group ${
                  active
                    ? "bg-purple-50 text-purple-900 dark:bg-purple-950/40 dark:text-purple-300"
                    : "text-slate-700 hover:bg-slate-200/50 dark:text-slate-200 dark:hover:bg-slate-800/60"
                }`}
                title={isCollapsed ? menu.label : undefined}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`shrink-0 ${active ? "text-purple-600 dark:text-purple-400" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500"}`}>
                    <FolderTree className="h-4 w-4" />
                  </div>
                  {!isCollapsed && <span className="truncate">{menu.label}</span>}
                </div>
                {!isCollapsed && (
                  <div className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </div>
                )}
              </button>

              {/* Sous-menus (affichés si ouvert et non réduit) */}
              {!isCollapsed && isOpen && (
                <div className="pl-4 ml-3 space-y-1 border-l border-slate-200 dark:border-slate-800 my-1">
                  {menu.navigations.map((child) => {
                    const isChildActive = activeMenu?.seqnumber === child.seqnumber || activeMenu === child
                    return (
                      <button
                        key={child.seqnumber}
                        onClick={() => setActiveMenu(child)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                          isChildActive
                            ? "bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 font-semibold"
                            : "text-slate-600 hover:bg-slate-200/40 dark:text-slate-400 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isChildActive ? "bg-purple-600 dark:bg-purple-400" : "bg-slate-300 dark:bg-slate-700"}`} />
                        <span className="truncate text-left">{child.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}