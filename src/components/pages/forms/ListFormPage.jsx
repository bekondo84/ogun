import React, { useState } from "react"
import { DataControls, TableView, KanbanView } from "@/components/widgets/list"

export default function ListDataModule({
  onCreate,
  onDelete,
  onSelected
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("table")
  const [selectedIds, setSelectedIds] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  
  // ⚡ ÉTAT DU TRI : Stocke la colonne active et la direction (asc ou desc)
  const [sortConfig, setSortConfig] = useState({ key: "company", direction: "asc" })

  // 📋 MÉTA-DONNÉES DU TABLEAU (Mise à jour : Ajout du paramètre sortable)
  const CLIENT_COLUMNS = [
    { 
      key: "company", 
      label: "Société / Structure", 
      sortable: true, // Active le tri interactif sur cette colonne
      className: "font-semibold text-slate-900 dark:text-white group-hover/row:text-purple-700 dark:group-hover/row:text-purple-400 transition-colors" 
    },
    { 
      key: "contact", 
      label: "Interlocuteur", 
      sortable: true,
      className: "text-slate-600 dark:text-slate-400" 
    },
    { 
      key: "email", 
      label: "Adresse E-mail", 
      sortable: false, // Colonne non triable
      className: "font-mono text-slate-400 dark:text-slate-500 antialiased" 
    },
    { 
      key: "value", 
      label: "Opportunité", 
      sortable: true,
      align: "right",
      render: (value) => (
        <span className="font-mono font-bold text-slate-900 dark:text-white">
          {Number(value).toLocaleString("fr-FR")} €
        </span>
      )
    }
  ]

  const MOCK_DATA = [
    { id: 1, company: "Alstom France", contact: "Marc Letellier", email: "m.letellier@alstom.com", value: 45000 },
    { id: 2, company: "TotalEnergies", contact: "Sophie Dubois", email: "s.dubois@total.com", value: 120000 },
    { id: 3, company: "Schneider Electric", contact: "Paul Martin", email: "p.martin@schneider.com", value: 85000 },
    { id: 4, company: "Capgemini SE", contact: "Julie Laurent", email: "j.laurent@capgemini.fr", value: 32000 },
  ]

  // 1. Filtrage textuel standard
  const filteredData = MOCK_DATA.filter(item => 
    item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.contact.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 2. MOTEUR DE TRI DYNAMIQUE (Trie les lignes à la volée)
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    
    let aValue = a[key]
    let bValue = b[key]

    // Normalisation pour éviter les erreurs de casse sur les textes
    if (typeof aValue === "string") aValue = aValue.toLowerCase()
    if (typeof bValue === "string") bValue = bValue.toLowerCase()

    if (aValue < bValue) return direction === "asc" ? -1 : 1
    if (aValue > bValue) return direction === "asc" ? 1 : -1
    return 0
  })

  // 3. Gestion du clic sur un en-tête de colonne
  const handleSort = (columnKey) => {
    let direction = "asc"
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key: columnKey, direction })
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col antialiased">
      <DataControls
        title="Gestion du Pipeline CRM"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedCount={selectedIds.length}
        onDeleteSelected={() => onDelete(selectedIds)}
        onCreate={() => onCreate()}
        currentPage={currentPage}
        totalPages={1}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto overflow-y-auto">
        {viewMode === "table" ? (
          <TableView
            columns={CLIENT_COLUMNS}
            data={sortedData} // On injecte les données triées
            selectedIds={selectedIds}
            sortConfig={sortConfig}
            onSort={handleSort}
            onToggleSelectAll={() => setSelectedIds(selectedIds.length === sortedData.length ? [] : sortedData.map(i => i.id))}
            onToggleSelectRow={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
            onRowClick={(id) => onSelected(id)}
          />
        ) : (
          <KanbanView
            data={sortedData}
            selectedIds={selectedIds}
            onToggleSelectRow={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
            onCardClick={(id) => onSelected(id)}
          />
        )}
      </main>
    </div>
  )
}