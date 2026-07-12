import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FormSection from "./FormSection"
import { Calendar, CreditCard, Layers3, MessageSquare } from "lucide-react"

const STAT_BUTTONS = [
  { id: "meetings", label: "Réunions", value: "3", icon: Calendar },
  { id: "invoices", label: "Factures", value: "1", icon: CreditCard },
  { id: "tasks", label: "Tâches", value: "12", icon: Layers3 },
]

export default function DynamicForm({ schema, values, onChange, disabled }) {
  return (
    // "shadow-sm border rounded-xl" imite la balise <sheet> d'Odoo
    <div className="w-full space-y-8 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 p-6 md:p-8 shadow-sm relative">
      
      {/* Raccourcis hauts (Stat-Buttons) */}
      <div className="flex flex-wrap items-center justify-end gap-1 border-b border-slate-100 dark:border-slate-800 pb-4 mb-2">
        {STAT_BUTTONS.map((btn) => {
          const Icon = btn.icon
          return (
            <button
              key={btn.id}
              type="button"
              onClick={() => alert(`Navigation : ${btn.label}`)}
              className="flex items-center gap-2 px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-purple-700 text-xs font-medium cursor-pointer shadow-sm min-w-[90px]"
            >
              <Icon className="h-3.5 w-3.5 text-slate-400" />
              <div className="text-left leading-none">
                <span className="block font-bold text-slate-900 dark:text-white text-xs">{btn.value}</span>
                <span className="block text-[9px] text-slate-400 font-medium mt-0.5">{btn.label}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Sections Globales */}
      {schema.sections && schema.sections.map((section, idx) => (
        <FormSection key={idx} section={section} values={values} onChange={onChange} disabled={disabled} />
      ))}

      {/* 🚀 CORRECTION : Rendu des Onglets Style Notebook Odoo */}
      {schema.tabs && schema.tabs.length > 0 && (
        <Tabs defaultValue={schema.tabs[0]?.id} className="w-full space-y-6 pt-4">
          
          {/* Liste d'onglets plats (Bordure basse grise, pas de fond gris de conteneur) */}
          <TabsList className="justify-start w-full border-b rounded-none h-9 p-0 gap-0 bg-transparent border-slate-200 dark:border-slate-800">
            {schema.tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="text-xs font-bold text-slate-500 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white rounded-none bg-transparent shadow-none border-b-2 border-transparent h-9 px-4 transition-all cursor-pointer hover:text-slate-800"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Zones de contenus des onglets */}
          {schema.tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6 outline-none focus:ring-0 pt-2 animate-in fade-in-50 duration-200">
              {tab.sections.map((section, idx) => (
                <FormSection key={idx} section={section} values={values} onChange={onChange} disabled={disabled} />
              ))}
            </TabsContent>
          ))}
          
        </Tabs>
      )}

    </div>
  )
}