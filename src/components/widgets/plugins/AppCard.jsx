import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, ArrowUpRight } from "lucide-react"

export default function AppCard({ app, onLaunch }) {
  const { id, name, description, icon: Icon, color, isInstalled } = app

  return (
    <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all rounded-lg overflow-hidden group">
      <CardContent className="p-5 flex flex-col h-full justify-between space-y-4">
        
        {/* En-tête de la carte : Icône et Titre */}
        <div className="flex items-start gap-4">
          <div 
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
            style={{ backgroundColor: color }}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-slate-900 text-sm tracking-tight group-hover:text-purple-700 transition-colors">
              {name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Pied de la carte : Actions de chargement / installation style Odoo */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-50 text-xs">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            isInstalled ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          }`}>
            {isInstalled ? "Installé" : "Disponible"}
          </span>

          {isInstalled ? (
            <Button 
              onClick={() => onLaunch(id)}
              size="sm" 
              variant="ghost" 
              className="h-8 text-purple-700 hover:text-purple-800 hover:bg-purple-50 font-medium gap-1"
            >
              Ouvrir <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="h-8 bg-purple-600 hover:bg-purple-700 text-white font-medium gap-1"
            >
              Installer <Download className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

      </CardContent>
    </Card>
  )
}