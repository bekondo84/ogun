import { icons } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function WorkflowKpiResume ({resume}) 
{
   useEffect(() => {
        //console.log('WorkflowKpiResume.useEffect -------------------- '+JSON.stringify(resume))
    }, [resume])

    const Icon = icons[resume.icon] ??  null       
    const Color = resume.color ?? null

    return (
        <div className="flex items-center gap-3 p-3 bg-purple-50/30 dark:bg-purple-950/10 rounded-xl border border-purple-100/50 dark:border-purple-900/20">
            <div className={`p-2 bg-purple-100 ${Color} rounded-lg`}>
                {Icon && <Icon className="h-4 w-4" />}
            </div>
            <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">{resume.label}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{resume.message}</p>
            </div>
        </div>
    )
}