import React, { useEffect, useState } from "react";
import { icons, Circle } from "lucide-react"
import { executedPostMethod } from "@/axios/DataService";
import { convertFiltersToPredicats } from "@/utils/Utils";

export default function Shutcut({meta, item, shutcut, Icon, onAction}) {
   const [counter, setCounter] = useState(0)

   useEffect( () => {
       getCounter ()
   }, [shutcut, item])

  const getCounter = async() => {
      var predicates = convertFiltersToPredicats(shutcut?.filters, item)
      const response =  await executedPostMethod(meta.action, "count", {
           typeCode: shutcut.type,
           predicates: predicates
      })
      setCounter(response.data)
  }


    return (
          <button
                  key={shutcut.code}
                  type="button"
                  onClick={() => onAction(shutcut)}
                  className="flex items-center gap-2 px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-purple-700 text-xs font-medium cursor-pointer shadow-sm min-w-[90px]"
                >
                  <Icon className="h-3.5 w-3.5 text-slate-400" />
                  <div className="text-left leading-none">
                    <span className="block font-bold text-slate-900 dark:text-white text-xs">{counter}</span>
                    <span className="block text-[9px] text-slate-400 font-medium mt-0.5">{shutcut.label}</span>
                  </div>
          </button>
    )
}