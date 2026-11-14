import React, { useState } from "react"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import MenuNode from "./MenuNode"

export default function PluginSidebar({
  menus = [],
  activeMenu,
  setActiveMenu,
  isCollapsed,
  setIsCollapsed
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
      className={`relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-300 select-none shrink-0 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* En-tête de la Sidebar */}
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