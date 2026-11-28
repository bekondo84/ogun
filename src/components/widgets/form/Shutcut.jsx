import React, { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { executedPostMethod } from "@/axios/DataService";
import { convertFiltersToPredicats } from "@/utils/Utils";
import { DEFAULT_BTN, getFilledButtons, getIconColor, isFilled, isRawCss } from "@/utils/ColorUtils";

export default function Shutcut({ meta, item, shutcut, Icon = Circle, onAction }) {
  const [counter, setCounter] = useState(0);
  const [predicates, setPredicates] = useState([]);

  useEffect(() => {
    getCounter();
  }, [shutcut, item]);

  const getCounter = async () => {
    const preds = convertFiltersToPredicats(shutcut?.filters, item);
    setPredicates(preds);
    const response = await executedPostMethod(meta.action, "count", {
      typeCode: shutcut.type,
      predicates: preds,
    });
    setCounter(response.data ?? 0);
  };

  const colorKey = String(shutcut?.color || "").toLowerCase().trim();
  const filled = isFilled(colorKey);

  return (
    <button
      type="button"
      onClick={() => onAction(shutcut, predicates)}
      className={`min-w-[110px] h-10 px-3 flex items-center justify-start gap-2.5 border font-medium text-[11px] rounded shadow-sm transition-colors cursor-pointer ${
        filled ? getFilledButtons(colorKey) : DEFAULT_BTN
      }`}
    >
      {Icon && (
        <Icon
          style={!filled && isRawCss(colorKey) ? { color: shutcut.color } : undefined}
          className={`h-4 w-4 shrink-0 ${
            filled
              ? "text-white"
              : getIconColor(colorKey) || "text-slate-400 dark:text-slate-500"
          }`}
        />
      )}

      <div className="flex flex-col items-start justify-center text-left leading-tight overflow-hidden">
        <span
          className={`font-bold text-xs leading-none ${
            filled ? "text-white" : "text-slate-900 dark:text-white"
          }`}
        >
          {counter}
        </span>
        <span
          className={`text-[10px] font-medium truncate max-w-[110px] mt-0.5 ${
            filled ? "text-white/85" : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {shutcut.label}
        </span>
      </div>
    </button>
  );
}