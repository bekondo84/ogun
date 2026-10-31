import React, { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FormSection from "./FormSection"
import { icons, Circle } from "lucide-react"
import Shutcut from "./Shutcut"
import { getFormFields, visible } from "@/utils/FormUtils"

export default function DynamicForm({ 
  meta, 
  schema, 
  fields = [],
  values, 
  errors, 
  resources,
  setResources,
  onChange, 
  disabled, 
  editMode, 
  shutcutAction }) {
  const [shutcuts, setShutcuts] = useState([])
  
  useEffect (() => {
     setShutcuts(schema?.shutcuts)
     //  console.log('-------.??????---------------- /////////// : '+fieldList?.length)
    }, [schema])

  return (
    // "shadow-sm border rounded-xl" imite la balise <sheet> d'Odoo
    <div className="w-full space-y-8 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 p-6 md:p-8 shadow-sm relative">
      
      {/* Raccourcis hauts (Stat-Buttons) */}
      <div className="flex flex-wrap items-center justify-end gap-1 border-b border-slate-100 dark:border-slate-800 pb-4 mb-2">
        {shutcuts?.map((btn) => {
          const Icon = icons[btn.icon] ?? Circle
          return (
            <Shutcut shutcut={btn} Icon={Icon} onAction={shutcutAction} meta={meta} item={values}/>
          )
        })}
      </div>

      {/* Sections Globales */}
      {schema?.form && schema?.form.sections && schema?.form.sections.map((section, idx) => (
        visible(fields, section.visibleWhen, values) ? (<FormSection 
            key={idx} 
            section={section} 
            values={values} 
            errors={errors}
            resources={resources}
            setResources={setResources}
            onChange={onChange} 
            disabled={disabled}
            editMode={editMode} 
            fields={fields}/>
        ): null
      ))}

      {/* 🚀 CORRECTION : Rendu des Onglets Style Notebook Odoo */}
      {schema?.tabs && schema?.tabs.length > 0 && (
        <Tabs defaultValue={schema.tabs[0]?.id} className="w-full space-y-6 pt-4">
          
          {/* Liste d'onglets plats (Bordure basse grise, pas de fond gris de conteneur) */}
          <TabsList className="justify-start w-full border-b rounded-none h-9 p-0 gap-0 bg-transparent border-slate-200 dark:border-slate-800">
            {schema.tabs.map((tab) => (
              visible(fields, tab.visibleWhen, values) ? (<TabsTrigger
                key={tab.name}
                value={tab.name}
                className="text-xs font-bold text-slate-500 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white rounded-none bg-transparent shadow-none border-b-2 border-transparent h-9 px-4 transition-all cursor-pointer hover:text-slate-800"
              >
                {tab.title}
              </TabsTrigger>) : null
            ))}
          </TabsList>

          {/* Zones de contenus des onglets */}
          {schema.tabs.map((tab) => (
            visible(fields, tab.visibleWhen, values) ? (<TabsContent key={tab.name} value={tab.name} className="space-y-6 outline-none focus:ring-0 pt-2 animate-in fade-in-50 duration-200">
              {tab.sections.map((section, idx) => (
                visible(fields, section.visibleWhen, values) ? (<FormSection 
                     key={idx} 
                     section={section} 
                     values={values} 
                     errors={errors} 
                     resources={resources}
                     setResources={setResources}
                     onChange={onChange} 
                     disabled={disabled}
                     fields={fields} />) : null
              ))}
            </TabsContent>) : null
          ))}
          
        </Tabs>
      )}

    </div>
  )
}