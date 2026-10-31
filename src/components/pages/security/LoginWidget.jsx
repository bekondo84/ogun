import React, { useEffect, useState } from "react"
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
import { getInitials } from "@/utils/Utils"
import { useTranslation } from "react-i18next"

export default function LoginWidget ({

}) {

     const [username, setUsername] = useState(null)
     const [initials, setInitials] = useState(null)
     const {t, i18n} = useTranslation()
     
     const navigate = useNavigate()
     
     useEffect(() => {
          setUsername(localStorage.getItem('user_name'))
          setInitials(getInitials(localStorage.getItem('user_name')))
     }, [])
     

    return (
        <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer text-sm font-semibold text-purple-700">
            {initials}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1">
            <div className="px-2 py-1.5 text-xs font-semibold text-slate-400">{username}</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2.5 text-sm"><HelpCircle className="h-4 w-4 text-slate-500" />Aide & Docs</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2.5 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5"><Activity className="h-4 w-4 text-slate-500" />Status Système</div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1" />
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2.5 text-sm"><Settings className="h-4 w-4 text-slate-500" />Préférences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/")} className="cursor-pointer gap-2.5 text-sm text-red-600 focus:text-red-700 focus:bg-red-50">
              <LogOut className="h-4 w-4" />
              <span>{t('logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    )
}