import React from "react";
import { icons, Circle } from "lucide-react"

export default function Shutcut({shutcut, Icon, onAction}) {

    return (
          <button
                  key={shutcut.code}
                  type="button"
                  onClick={() => onAction(shutcut)}
                  className="flex items-center gap-2 px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-purple-700 text-xs font-medium cursor-pointer shadow-sm min-w-[90px]"
                >
                  <Icon className="h-3.5 w-3.5 text-slate-400" />
                  <div className="text-left leading-none">
                    <span className="block font-bold text-slate-900 dark:text-white text-xs">{shutcut.counter}</span>
                    <span className="block text-[9px] text-slate-400 font-medium mt-0.5">{shutcut.label}</span>
                  </div>
          </button>
    )
}