import React, { useEffect, useState } from "react"
import { useGetSessionPlugins, useGetPluginCategories } from "@/hooks/usePlugin"
import AppHeader from "@/components/widgets/plugins/AppHeader"
import AppCard from "@/components/widgets/plugins/AppCard"
import { useNavigate } from "react-router-dom"
import ogunLogoImage from "@/assets/ogun.png"

import { 
  Briefcase, ShoppingCart, Users, FileText, 
  BarChart3, Settings, Package, Truck 
} from "lucide-react"
import { useTranslation } from "react-i18next"


export default function AppsPage({
  erpTemplate
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { data: plugins = [], isLoading, isError, error, refetch } = useGetSessionPlugins()
  const {data: categories = [], isCategoriesLoading, isCategoriesError, categorieserror, categoriesrefetch} = useGetPluginCategories()
  const navigate = useNavigate()
  const [appTitle, setAppTitle] = useState(localStorage.getItem('erp_name') || "Ogun")
  const [appSigle, setAppSigle] = useState('ERP')
  const {t, i18n} = useTranslation()
  const ALLCATEGORIE = [
      { id: "all", name: t('all_plugins') },
  ]
  const CATEGORIES = [...ALLCATEGORIE, ...categories] ;

  useEffect(() => {
      if (appTitle && appTitle != 'Ogun') {
            setAppSigle(localStorage.getItem('erp_sigle'));
      }
  }, [appTitle])
  
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
        companyLogo={ogunLogoImage}
        companyName={appTitle}
        companySigle= {appSigle}
      />

      <main className="flex-1 p-6 md:p-10 max-w-none w-full mx-auto space-y-6  overflow-y-auto">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">{t('available_plugins')}</h2>
          <p className="text-xs text-slate-500">{t('plugin_0001')}</p>
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
            <p className="mt-4 text-sm font-medium text-slate-900">{t('no_result')}</p>
            <p className="text-xs text-slate-400 mt-1">{t('try_change_search_criteria')}</p>
          </div>
        )}
      </main>
    </div>
  )
}