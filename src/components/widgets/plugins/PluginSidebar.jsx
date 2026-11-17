import React, { useState } from "react"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import MenuNode from "./MenuNode"

export default function PluginSidebar({
  menus = [],
  activeMenu,
  setActiveMenu,
  isCollapsed,
  setIsCollapsed,
  moduleTitle = "Navigation Module"
}) {
  const [openGroups, setOpenGroups] = useState({})

  const toggleGroup = (groupId) => {
    if (isCollapsed) return
    setOpenGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }))
  }

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-md transition-all duration-300 select-none shrink-0 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Liseré d'accentuation subtil tout en haut de la sidebar */}
      <div className="h-[2px] w-full bg-[var(--brand-primary)] dark:bg-[var(--brand-primary-dark)] opacity-80" />

      {/* En-tête de la Sidebar */}
      <div className="h-14 px-3 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2 truncate px-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] dark:bg-[var(--brand-primary-dark)] shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              {moduleTitle}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-[var(--brand-primary)] dark:hover:text-[var(--brand-primary-dark)] hover:bg-[var(--brand-soft)] dark:hover:bg-[var(--brand-soft-dark)] transition-colors cursor-pointer ${
            isCollapsed ? "mx-auto" : "ml-auto"
          }`}
          title={isCollapsed ? "Agrandir la barre latérale" : "Réduire la barre latérale"}
        >
          {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {/* Arborescence des Menus */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {Array.isArray(menus) && menus.map((menu, index) => {
          const rootPrefix = `root-${index}`
          const rootKey = menu?.seqnumber ?? menu?.id ?? menu?.code ?? menu?.label ?? rootPrefix
          
          return (
            <MenuNode
              key={String(rootKey)}
              item={menu}
              depth={1}
              fallbackPrefix={rootPrefix}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              isCollapsed={isCollapsed}
              openGroups={openGroups}
              toggleGroup={toggleGroup}
            />
          )
        })}
      </nav>
    </aside>
  )
}