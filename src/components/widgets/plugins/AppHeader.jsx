import React from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Search, LayoutGrid, User, LogOut, Info, Settings, Filter, ChevronDown, Check } from "lucide-react"
import LoginWidget from "@/components/pages/security/LoginWidget"

// --- COMPOSANT CORRIGÉ ---
export default function AppHeader({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  categories 
}) {
  const currentCategoryName = categories.find(c => c.id === selectedCategory)?.name || "Filtrer"

  const navigate = useNavigate() 

  const handleLogout = () => {
    // Nettoyez ici d'éventuels tokens de session plus tard
    navigate("/") 
  }


  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-md px-6 py-3 flex items-center justify-between gap-4">
      {/* 1. Logo & Titre */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-700 text-white"><LayoutGrid className="h-5 w-5" /></div>
        <span className="text-lg font-bold tracking-tight text-slate-900 hidden sm:inline">Ogun<span className="text-purple-700">SAP</span></span>
      </div>

      {/* 2. Barre de recherche & Filtre */}
      <div className="flex flex-1 max-w-xl items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-10 pl-9 rounded-lg" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="h-10 px-4 border rounded-lg flex items-center gap-2 text-sm text-slate-700 bg-white">
            <Filter className="h-4 w-4" />
            <span className="hidden md:inline">{currentCategoryName}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1">
            {/* 💡 Correction : div à la place de DropdownMenuLabel */}
            <div className="px-2 py-1.5 text-xs font-semibold text-slate-500">Filtrer par catégorie</div>
            <DropdownMenuSeparator />
            {categories.map((c) => (
              <DropdownMenuItem key={c.id} onClick={() => setSelectedCategory(c.id)}>
                {c.name} {selectedCategory === c.id && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 3. User Menu */}
      <LoginWidget  />
    </header>
  )
}