import React, { useState } from "react"
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  Filter, 
  SlidersHorizontal, 
  Plus, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users2,
  Activity,
  Table as TableIcon,
  BarChart3,
  ArrowUpRight
} from "lucide-react"

export default function EnterpriseDashboardLayout() {
  const [sidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      
      {/* 1. SIDEBAR DE NAVIGATION ERP */}
      <aside className={`flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"}`}>
        <div className="h-14 flex items-center px-4 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center text-white justify-center font-bold text-sm shrink-0 shadow-xs">
            E
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold truncate">Enterprise ERP</span>
              <span className="text-[10px] text-slate-400 truncate">Core v1.0.0</span>
            </div>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          <NavItem icon={<LayoutDashboard className="w-4 h-4" />} label="Tableau de bord" active />
          <NavItem icon={<Package className="w-4 h-4" />} label="Catalogue & Stocks" />
          <NavItem icon={<Users className="w-4 h-4" />} label="Clients & Ventes" />
          <NavItem icon={<BarChart3 className="w-4 h-4" />} label="Analytique & Rapports" />
          <NavItem icon={<Settings className="w-4 h-4" />} label="Paramètres Système" />
        </nav>
      </aside>

      {/* ZONE PRINCIPALE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        
        {/* 2. TOPBAR GLOBALE */}
        <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3 w-96 max-w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Recherche globale (Command + K)..." 
                className="w-full h-9 pl-9 pr-4 text-xs bg-slate-100 dark:bg-slate-800/60 border-0 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-600 rounded-full" />
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center font-semibold text-xs shadow-xs">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE & ARTEFACTS */}
        <main className="flex-1 flex flex-col p-6 gap-6 max-w-[1600px] w-full mx-auto">
          
          {/* Fil d'Ariane & Titre */}
          <div className="flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span>Vues principales</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-700 dark:text-slate-200 font-medium">Vue d'ensemble</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Tableau de bord Exécutif
              </h1>
            </div>

            <button 
              type="button" 
              className="h-9 px-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-xs inline-flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Générer un rapport</span>
            </button>
          </div>

          {/* 3. SECTION DES Kpis & CARTES DE MÉTRIQUES (Artefacts clés ERP) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard 
              title="Chiffre d'Affaires (Mois)" 
              value="128,430 €" 
              evolution="+12.4%" 
              isPositive={true} 
              icon={<DollarSign className="w-4 h-4 text-emerald-600" />} 
              bgColor="bg-emerald-50 dark:bg-emerald-950/40"
            />
            <KpiCard 
              title="Commandes Traitées" 
              value="1,429" 
              evolution="+4.1%" 
              isPositive={true} 
              icon={<ShoppingCart className="w-4 h-4 text-purple-600" />} 
              bgColor="bg-purple-50 dark:bg-purple-950/40"
            />
            <KpiCard 
              title="Nouveaux Clients" 
              value="312" 
              evolution="-2.3%" 
              isPositive={false} 
              icon={<Users2 className="w-4 h-4 text-blue-600" />} 
              bgColor="bg-blue-50 dark:bg-blue-950/40"
            />
            <KpiCard 
              title="Taux de Conversion" 
              value="4.82%" 
              evolution="+0.8%" 
              isPositive={true} 
              icon={<Activity className="w-4 h-4 text-amber-600" />} 
              bgColor="bg-amber-50 dark:bg-amber-950/40"
            />
          </div>

          {/* 4. SECTION DES GRAPHIQUES & COURBES (Artefacts visuels) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Graphique principal (Courbe des ventes) */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Évolution du Chiffre d'Affaires</h3>
                  <p className="text-[11px] text-slate-400">Comparaison N vs N-1 sur les flux logistiques et commandes</p>
                </div>
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-md">
                  Année 2026
                </span>
              </div>
              
              {/* Simulation visuelle de courbe / graphique (Artefact UI pur CSS/SVG) */}
              <div className="h-64 w-full flex items-end justify-between gap-3 pt-8 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
                {[40, 65, 45, 80, 55, 90, 75, 95, 85, 110, 100, 130].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div 
                      style={{ height: `${(val / 130) * 100}%` }} 
                      className="w-full bg-purple-500/80 group-hover:bg-purple-600 rounded-t-sm transition-all duration-300 relative cursor-pointer"
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {val}k €
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Répartition / Camembert ou Barres secondaires */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col shadow-xs justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Performance par Canal</h3>
                <p className="text-[11px] text-slate-400 mb-4">Répartition des volumes de ventes</p>
                
                <div className="space-y-3">
                  <ProgressBar label="E-Commerce B2C (Hybris)" percentage={58} color="bg-purple-600" />
                  <ProgressBar label="Plateforme B2B (ERP)" percentage={28} color="bg-blue-600" />
                  <ProgressBar label="Ventes Directes / POS" percentage={14} color="bg-emerald-600" />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">Mise à jour en temps réel</span>
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> Synchronisé
                </span>
              </div>
            </div>

          </div>

          {/* 5. TABLEAU DE DONNÉES RÉCENTES (TableView d'entreprise) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Dernières Transactions & Commandes</h3>
              <div className="flex items-center gap-2">
                <button type="button" className="h-7 px-2.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Filtrer
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-b border-slate-200 dark:border-slate-800 font-medium">
                    <th className="py-2.5 px-4">Référence</th>
                    <th className="py-2.5 px-4">Client / Partenaire</th>
                    <th className="py-2.5 px-4">Montant</th>
                    <th className="py-2.5 px-4">Statut</th>
                    <th className="py-2.5 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                  <TableRow refId="CMD-2026-089" client="Acme Corp Logistics" amount="4,250.00 €" status="Validé" statusColor="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" date="Il y a 5 min" />
                  <TableRow refId="CMD-2026-088" client="Global Tech Retail" amount="1,120.50 €" status="En cours" statusColor="bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400" date="Il y a 22 min" />
                  <TableRow refId="CMD-2026-087" client="Nova Systems SA" amount="12,890.00 €" status="Validé" statusColor="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" date="Il y a 1 heure" />
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

    </div>
  )
}

// --- SOUS-COMPOSANTS D'UI PROFESSIONNELLE ---

function NavItem({ icon, label, active }) {
  return (
    <button 
      type="button"
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
        active 
          ? "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 font-semibold" 
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  )
}

function KpiCard({ title, value, evolution, isPositive, icon, bgColor }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500">{title}</span>
        <div className={`p-2 rounded-lg ${bgColor}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{value}</span>
        <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {evolution}
        </span>
      </div>
    </div>
  )
}

function ProgressBar({ label, percentage, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-600 dark:text-slate-400 font-medium">{label}</span>
        <span className="font-bold text-slate-900 dark:text-white">{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div style={{ width: `${percentage}%` }} className={`h-full rounded-full ${color}`} />
      </div>
    </div>
  )
}

function TableRow({ refId, client, amount, status, statusColor, date }) {
  return (
    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
      <td className="py-3 px-4 font-semibold text-purple-600 dark:text-purple-400">{refId}</td>
      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{client}</td>
      <td className="py-3 px-4 font-semibold">{amount}</td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor}`}>
          {status}
        </span>
      </td>
      <td className="py-3 px-4 text-right text-slate-400">{date}</td>
    </tr>
  )
}