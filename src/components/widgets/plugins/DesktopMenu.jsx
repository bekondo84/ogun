import React from "react"
import { 
  DropdownMenuItem, 
  DropdownMenuSub, 
  DropdownMenuSubTrigger, 
  DropdownMenuSubContent 
} from "@/components/ui/dropdown-menu"

export default function DesktopMenu({ item, setActiveMenu, activeMenu }) {
  const hasChildren = item.navigations  && item.navigations.length > 0

  if (!hasChildren) {
    return (
      <DropdownMenuItem 
        onClick={() => setActiveMenu(item)} 
        className={`cursor-pointer ${activeMenu === item.seqnumber ? "bg-purple-50 text-purple-700 font-semibold" : ""}`}
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
        {item.navigations.map((child) => (
          <DesktopMenu 
            key={child.seqnumber} 
            item={child} 
            setActiveMenu={setActiveMenu} 
            activeMenu={activeMenu} 
          />
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}