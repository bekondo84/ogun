import React, { useState } from "react"
import { useGetSessionPlugins, useGetPluginCategories } from "@/hooks/usePlugin"
import AppHeader from "@/components/widgets/plugins/AppHeader"
import AppCard from "@/components/widgets/plugins/AppCard"
import { useNavigate } from "react-router-dom"

import { 
  Briefcase, ShoppingCart, Users, FileText, 
  BarChart3, Settings, Package, Truck 
} from "lucide-react"

const ALLCATEGORIE = [
     { id: "all", name: "Tous les modules" },
]

export default function AppsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { data: plugins = [], isLoading, isError, error, refetch } = useGetSessionPlugins()
  const {data: categories = [], isCategoriesLoading, isCategoriesError, categorieserror, categoriesrefetch} = useGetPluginCategories()
  const CATEGORIES = [...ALLCATEGORIE, ...categories]  
  const navigate = useNavigate()

  const handleLaunchApp = (appId) => {
    navigate(`/apps/${appId}`)
  }
  // console.log(categories)
  const filteredApps =  plugins.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || app.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col antialiased">
      <AppHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={CATEGORIES}
      />

      <main className="flex-1 p-6 md:p-10 max-w-none w-full mx-auto space-y-6  overflow-y-auto">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Applications disponibles</h2>
          <p className="text-xs text-slate-500">Cliquez sur un module pour charger l'environnement de travail.</p>
        </div>

        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredApps.map((app) => (
              <AppCard 
                key={app.id} 
                app={app} 
                onLaunch={handleLaunchApp} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-200 bg-white rounded-xl text-center">
            <Settings className="h-10 w-10 text-slate-300 animate-spin" />
            <p className="mt-4 text-sm font-medium text-slate-900">Aucun résultat</p>
            <p className="text-xs text-slate-400 mt-1">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </main>
    </div>
  )
}