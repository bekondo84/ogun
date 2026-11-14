import React from "react"
import { 
  ChevronRight, 
  ChevronDown, 
  FolderTree, 
  FileText 
} from "lucide-react"

const MAX_DEPTH = 5

const getSafeId = (item, fallback) => {
  if (!item || typeof item !== "object") return String(fallback)
  return String(item.seqnumber ?? item.id ?? item.code ?? item.label ?? fallback)
}

const isItemExactActive = (item, itemId, activeMenu) => {
  if (!activeMenu) return false
  if (activeMenu === item) return true
  if (typeof activeMenu === "object") {
    const activeId = getSafeId(activeMenu, "")
    return activeId !== "" && activeId === itemId
  }
  return String(activeMenu) === itemId
}

const hasActiveDescendant = (item, fallbackPrefix, activeMenu, depth = 1) => {
  if (!item || depth > MAX_DEPTH) return false
  const itemId = getSafeId(item, fallbackPrefix)

  if (isItemExactActive(item, itemId, activeMenu)) return true

  if (Array.isArray(item.navigations) && depth < MAX_DEPTH) {
    return item.navigations.some((child, idx) =>
      hasActiveDescendant(child, `${itemId}-${idx}`, activeMenu, depth + 1)
    )
  }
  return false
}

export default function MenuNode({
  item,
  depth = 1,
  fallbackPrefix = "node-0",
  activeMenu,
  setActiveMenu,
  isCollapsed,
  openGroups,
  toggleGroup
}) {
  if (!item || depth > MAX_DEPTH) return null

  const itemId = getSafeId(item, fallbackPrefix)
  const validChildren = Array.isArray(item.navigations)
    ? item.navigations.filter(Boolean)
    : []

  const hasChildren = validChildren.length > 0 && depth < MAX_DEPTH
  const isExactActive = isItemExactActive(item, itemId, activeMenu)
  const isBranchActive = hasActiveDescendant(item, fallbackPrefix, activeMenu, depth)
  const isOpen = openGroups[itemId] ?? isBranchActive

  if (!hasChildren) {
    return (
      <button
        onClick={() => setActiveMenu?.(item)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer group ${
          depth === 1 ? "text-sm font-medium py-2.5" : "text-xs font-medium"
        } ${
          isExactActive
            ? "bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 font-semibold shadow-sm"
            : "text-slate-600 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-slate-800/60"
        }`}
        title={isCollapsed ? (item.label || "") : undefined}
      >
        {depth === 1 ? (
          <div className={`shrink-0 ${isExactActive ? "text-purple-600 dark:text-purple-400" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500"}`}>
            <FileText className="h-4 w-4" />
          </div>
        ) : (
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isExactActive ? "bg-purple-600 dark:bg-purple-400" : "bg-slate-300 dark:bg-slate-700"}`} />
        )}

        {!isCollapsed && (
          <span className="truncate text-left">{item.label || "Sans titre"}</span>
        )}
      </button>
    )
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => toggleGroup(itemId)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer group ${
          depth === 1 ? "text-sm font-medium py-2.5" : "text-xs font-medium"
        } ${
          isBranchActive
            ? "bg-purple-50 text-purple-900 dark:bg-purple-950/40 dark:text-purple-300"
            : "text-slate-700 hover:bg-slate-200/50 dark:text-slate-200 dark:hover:bg-slate-800/60"
        }`}
        title={isCollapsed ? (item.label || "") : undefined}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {depth === 1 ? (
            <div className={`shrink-0 ${isBranchActive ? "text-purple-600 dark:text-purple-400" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500"}`}>
              <FolderTree className="h-4 w-4" />
            </div>
          ) : (
            <span className={`w-1.5 h-1.5 rounded-sm shrink-0 ${isBranchActive ? "bg-purple-600 dark:bg-purple-400" : "bg-slate-400 dark:bg-slate-600"}`} />
          )}

          {!isCollapsed && (
            <span className="truncate text-left">{item.label || "Sans titre"}</span>
          )}
        </div>

        {!isCollapsed && (
          <div className="text-slate-400 shrink-0 ml-1">
            {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </div>
        )}
      </button>

      {!isCollapsed && isOpen && (
        <div className="pl-3 ml-2.5 space-y-1 border-l border-slate-200 dark:border-slate-800 my-1">
          {validChildren.map((child, childIndex) => {
            const childPrefix = `${itemId}-d${depth + 1}-${childIndex}`
            return (
              <MenuNode
                key={getSafeId(child, childPrefix)}
                item={child}
                depth={depth + 1}
                fallbackPrefix={childPrefix}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                isCollapsed={isCollapsed}
                openGroups={openGroups}
                toggleGroup={toggleGroup}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}