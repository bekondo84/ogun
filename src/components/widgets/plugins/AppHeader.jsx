import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Search, LayoutGrid, Filter, Check } from "lucide-react"
import LoginWidget from "@/components/pages/security/LoginWidget"
import { useTranslation } from "react-i18next"

export default function AppHeader({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  companyLogo,
  companyName = "Ogun",
  companySigle = "ERP",
  categories = [] 
}) {
  const currentCategoryName = categories.find(c => c.id === selectedCategory)?.name || "Filtrer"
  const navigate = useNavigate() 
  const [logoError, setLogoError] = useState(false)
  const {t, i18n} = useTranslation();
  // Vérifie si on a un logo valide (URL, image importée ou composant React)
  const hasLogo = Boolean(companyLogo) && !logoError

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-3 flex items-center justify-between gap-4">
      
      {/* 1. Logo & Titre */}
      <div 
        onClick={() => navigate("/")} 
        className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
      >   
            <div className="flex h-9 w-9 items-center justify-center rounded-lg ">
              <img
                  src={companyLogo}
                  alt={companyName}
                  onError={() => setLogoError(true)}
                  className="h-15 w-15 w-auto max-w-[120px] object-contain"
                />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white hidden sm:inline">
              {companyName}<span className="text-purple-700 dark:text-purple-400">{companySigle}</span>
            </span>
      </div>

      {/* 2. Barre de recherche & Filtre */}
      <div className="flex flex-1 max-w-xl items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            type="text" 
            placeholder={t('search_lb')} 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="h-10 pl-9 rounded-lg" 
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="h-10 px-4 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="hidden md:inline">{currentCategoryName}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1">
            <div className="px-2 py-1.5 text-xs font-semibold text-slate-500">{t('filter_categories')}</div>
            <DropdownMenuSeparator />
            {categories.map((c) => (
              <DropdownMenuItem key={c.id} onClick={() => setSelectedCategory(c.id)} className="cursor-pointer">
                {c.name} {selectedCategory === c.id && <Check className="ml-auto h-4 w-4 text-purple-700" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 3. User Menu */}
      <LoginWidget />
    </header>
  )
}