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

  // 1. NŒUD FEUILLE (Élément cliquable final)
  if (!hasChildren) {
    return (
      <button
        type="button"
        onClick={() => setActiveMenu?.(item)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer group ${
          depth === 1 ? "text-sm font-medium py-2.5" : "text-xs font-medium"
        } ${
          isExactActive
            ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] font-semibold shadow-2xs"
            : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)]"
        }`}
        title={isCollapsed ? (item.label || "") : undefined}
      >
        {depth === 1 ? (
          <div
            className={`shrink-0 transition-colors ${
              isExactActive
                ? "text-[var(--sidebar-indicator)]"
                : "text-[var(--sidebar-text-muted)] group-hover:text-[var(--sidebar-active-text)]"
            }`}
          >
            <FileText className="h-4 w-4" />
          </div>
        ) : (
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${
              isExactActive
                ? "bg-[var(--sidebar-indicator)] scale-125"
                : "bg-[var(--sidebar-text-muted)] opacity-60 group-hover:opacity-100 group-hover:bg-[var(--sidebar-indicator)]"
            }`}
          />
        )}

        {!isCollapsed && (
          <span className="truncate text-left">{item.label || "Sans titre"}</span>
        )}
      </button>
    )
  }

  // 2. NŒUD GROUPE (Dossier / Sous-menu dépliable)
  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => toggleGroup(itemId)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer group ${
          depth === 1 ? "text-sm font-medium py-2.5" : "text-xs font-medium"
        } ${
          isBranchActive
            ? "bg-[var(--sidebar-active-bg)]/60 text-[var(--sidebar-active-text)] font-semibold"
            : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)]"
        }`}
        title={isCollapsed ? (item.label || "") : undefined}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {depth === 1 ? (
            <div
              className={`shrink-0 transition-colors ${
                isBranchActive
                  ? "text-[var(--sidebar-indicator)]"
                  : "text-[var(--sidebar-text-muted)] group-hover:text-[var(--sidebar-active-text)]"
              }`}
            >
              <FolderTree className="h-4 w-4" />
            </div>
          ) : (
            <span
              className={`w-1.5 h-1.5 rounded-sm shrink-0 transition-colors ${
                isBranchActive
                  ? "bg-[var(--sidebar-indicator)]"
                  : "bg-[var(--sidebar-text-muted)] opacity-60 group-hover:opacity-100 group-hover:bg-[var(--sidebar-indicator)]"
              }`}
            />
          )}

          {!isCollapsed && (
            <span className="truncate text-left">{item.label || "Sans titre"}</span>
          )}
        </div>

        {!isCollapsed && (
          <div
            className={`shrink-0 ml-1 transition-colors ${
              isBranchActive
                ? "text-[var(--sidebar-indicator)]"
                : "text-[var(--sidebar-text-muted)] group-hover:text-[var(--sidebar-text)]"
            }`}
          >
            {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </div>
        )}
      </button>

      {/* Conteneur des enfants avec filet vertical dynamique */}
      {!isCollapsed && isOpen && (
        <div
          className={`pl-3 ml-2.5 space-y-1 border-l my-1 transition-colors ${
            isBranchActive
              ? "border-[var(--sidebar-indicator)]/40"
              : "border-[var(--sidebar-border)]"
          }`}
        >
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