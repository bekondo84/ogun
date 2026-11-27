import { Calendar, LayoutGrid, Table } from "lucide-react";
import React from "react";

export default function AllowedViews ({
         viewMode,
         setViewMode,
         allowedViews,
}) {

    return (
        <div className="flex items-center border border-slate-200 dark:border-slate-700 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-900">
          {/*1. Affichage condition du bouton List */}
          {allowedViews?.includes("list") && (
              <button onClick={() => setViewMode("list")} className={`p-1 rounded-md cursor-pointer bg-transparent border-0 ${viewMode === "list" ? "bg-white text-[var(--brand-primary)] shadow-sm" : "text-slate-500"}`}>
                <Table className="h-4 w-4" />
              </button>          
          )}
          {allowedViews?.includes("kaban") && (
                <button onClick={() => setViewMode("kanban")} className={`p-1 rounded-md cursor-pointer bg-transparent border-0 ${viewMode === "kanban" ? "bg-white text-[var(--brand-primary)] shadow-sm" : "text-slate-500"}`}>
                  <LayoutGrid className="h-4 w-4" />
                </button>
          )}
          {allowedViews?.includes("calendar") && (
              <button onClick={() => setViewMode("calendar")} className={`p-1 rounded-md cursor-pointer bg-transparent border-0 ${viewMode === "calendar" ? "bg-white text-[var(--brand-primary)] shadow-sm" : "text-slate-500"}`}>
                <Calendar className="h-4 w-4" />
              </button>
          )}
        </div>
    )
}