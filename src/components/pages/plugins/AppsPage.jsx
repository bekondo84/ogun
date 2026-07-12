import React, { useState } from "react"
import AppHeader from "@/components/widgets/plugins/AppHeader"
import AppCard from "@/components/widgets/plugins/AppCard"
import { useNavigate } from "react-router-dom"

import { 
  Briefcase, ShoppingCart, Users, FileText, 
  BarChart3, Settings, Package, Truck 
} from "lucide-react"

const AVAILABLE_PLUGINS = [
  { id: "crm", name: "CRM", description: "Suivi des pistes, opportunités et prévisions de ventes.", icon: Briefcase, color: "#10b981", category: "sales", isInstalled: true },
  { id: "sales", name: "Ventes", description: "Création de devis, factures proforma et contrats clients.", icon: ShoppingCart, color: "#2563eb", category: "sales", isInstalled: true },
  { id: "inventory", name: "Inventaire", description: "Gestion des stocks en double entrée et traçabilité.", icon: Package, color: "#f59e0b", category: "operations", isInstalled: true },
  { id: "accounting", name: "Comptabilité", description: "Suivi bancaire, bilans et rapports financiers automatisés.", icon: BarChart3, color: "#dc2626", category: "finance", isInstalled: false },
  { id: "hr", name: "Employés / RH", description: "Gestion des contrats, présences et fiches de paie.", icon: Users, color: "#7c3aed", category: "human_resources", isInstalled: true },
  { id: "invoicing", name: "Facturation", description: "Édition de factures clients et suivi des paiements.", icon: FileText, color: "#06b6d4", category: "finance", isInstalled: true },
  { id: "purchase", name: "Achats", description: "Gestion des appels d'offres et commandes fournisseurs.", icon: Truck, color: "#ea580c", category: "operations", isInstalled: false },
]

const CATEGORIES = [
  { id: "all", name: "Tous les modules" },
  { id: "sales", name: "Ventes & CRM" },
  { id: "operations", name: "Opérations & Logistique" },
  { id: "finance", name: "Finances & Factures" },
]

export default function AppsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const navigate = useNavigate()

  const handleLaunchApp = (appId) => {
    navigate(`/apps/${appId}`)
  }

  const filteredApps = AVAILABLE_PLUGINS.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || app.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col antialiased">
      <AppHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={CATEGORIES}
      />

      <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto space-y-6">
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