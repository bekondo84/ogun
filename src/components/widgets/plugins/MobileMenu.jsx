import React from "react"

export default function MobileMenu({ item, setActiveMenu, activeMenu, depth = 0 }) {
  const hasChildren = item.navigations  && item.navigations.length > 0

  return (
    <div className="flex flex-col w-full">
      {!hasChildren ? (
        <button
          onClick={() => setActiveMenu(item)}
          style={{ paddingLeft: `${(depth * 12) + 12}px` }}
          className={`w-full text-left py-2 text-sm rounded-md transition-all ${
            activeMenu === item.seqnumber ? "bg-purple-700 text-white font-medium" : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          {item.label}
        </button>
      ) : (
        <>
          <div 
            style={{ paddingLeft: `${(depth * 12) + 12}px` }}
            className="w-full text-left py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mt-2"
          >
            {item.label}
          </div>
          {item.navigations.map((child) => (
            <MobileMenu 
              key={child.seqnumber} 
              item={child} 
              setActiveMenu={setActiveMenu} 
              activeMenu={activeMenu} 
              depth={depth + 1} 
            />
          ))}
        </>
      )}
    </div>
  )
}