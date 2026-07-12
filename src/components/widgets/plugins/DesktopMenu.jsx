import React from "react"
import { 
  DropdownMenuItem, 
  DropdownMenuSub, 
  DropdownMenuSubTrigger, 
  DropdownMenuSubContent 
} from "@/components/ui/dropdown-menu"

export default function DesktopMenu({ item, setActiveMenu, activeMenu }) {
  const hasChildren = item.children && item.children.length > 0

  if (!hasChildren) {
    return (
      <DropdownMenuItem 
        onClick={() => setActiveMenu(item.id)} 
        className={`cursor-pointer ${activeMenu === item.id ? "bg-purple-50 text-purple-700 font-semibold" : ""}`}
      >
        {item.label}
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="cursor-pointer">
        {item.label}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-52">
        {item.children.map((child) => (
          <DesktopMenu 
            key={child.id} 
            item={child} 
            setActiveMenu={setActiveMenu} 
            activeMenu={activeMenu} 
          />
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}