import React from "react"
import { useNavigate } from "react-router-dom"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { HelpCircle, Settings, LogOut, ChevronDown, Activity, Menu, ArrowLeft, LayoutGrid } from "lucide-react"

import DesktopMenu from "./DesktopMenu"
import MobileMenu from "./MobileMenu"

export default function PluginHeader({ pluginName, menus, activeMenu, setActiveMenu }) {
  const navigate = useNavigate()

  return (
    <div className="w-full border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-6 py-2 flex items-center justify-between shadow-sm">
      
      {/* ZONE GAUCHE : Navigation, Retour Dashboard & Menu Burger */}
      <div className="flex items-center gap-4 overflow-hidden">
        
        {/* 1. ✨ NOUVEAU : Bouton de retour vers la page des applications (Style Odoo Home) */}
        <button 
          onClick={() => navigate("/apps")}
          title="Retour aux applications"
          className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-all cursor-pointer flex items-center justify-center shrink-0 border border-slate-100 shadow-sm"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>

        {/* Déclencheur Mobile */}
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger className="p-2 text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer flex items-center">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-white dark:bg-slate-900 overflow-y-auto">
              <SheetHeader className="border-b pb-4 mb-4">
                <SheetTitle className="text-left text-sm font-bold text-purple-700 uppercase tracking-wider">
                  {pluginName}
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-0.5">
                {menus.map((menu) => (
                  <MobileMenu 
                    key={menu.id} 
                    item={menu} 
                    setActiveMenu={setActiveMenu} 
                    activeMenu={activeMenu} 
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Titre Desktop */}
        <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight border-r border-slate-200 dark:border-slate-700 pr-6 hidden sm:inline-block">
          {pluginName}
        </span>

        {/* Navigation Desktop */}
        <nav className="hidden sm:flex items-center gap-1 text-sm font-medium">
          {menus.map((menu) => {
            const hasChildren = menu.children && menu.children.length > 0

            if (!hasChildren) {
              return (
                <button
                  key={menu.id}
                  onClick={() => setActiveMenu(menu)}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    activeMenu === menu.id
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {menu.label}
                </button>
              )
            }

            return (
              <DropdownMenu key={menu.id}>
                <DropdownMenuTrigger className="px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 font-medium inline-flex items-center gap-1 transition-all focus:outline-none dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer">
                  <span>{menu.label}</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-1">
                  {menu.children.map((child) => (
                    <DesktopMenu 
                      key={child.id} 
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
      </div>

      {/* ZONE DROITE : Compte utilisateur harmonisé */}
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer text-sm font-semibold text-purple-700">
            JD
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1">
            <div className="px-2 py-1.5 text-xs font-semibold text-slate-400">John Doe</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2.5 text-sm"><HelpCircle className="h-4 w-4 text-slate-500" />Aide & Docs</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2.5 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5"><Activity className="h-4 w-4 text-slate-500" />Status Système</div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1" />
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2.5 text-sm"><Settings className="h-4 w-4 text-slate-500" />Préférences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/apps")} className="cursor-pointer gap-2.5 text-sm text-red-600 focus:text-red-700 focus:bg-red-50">
              <LogOut className="h-4 w-4" />
              <span>Quitter le plugin</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </div>
  )
}