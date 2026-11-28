import { DEFAULT_BTN, getFilledButtons, getIconColor, isFilled, isRawCss } from "@/utils/ColorUtils";
import { Button } from "@base-ui/react";
import { icons } from "lucide-react";
import React from "react";

export default function ActionsBar ({
        metadata,
        item,
        actions,
        onAction
}) {
    return (
        <div className="flex items-center gap-1.5">
            {actions?.map((action, index) => {
                const Icon = icons[action.icon] ?? null;
                const key = String(action.color || "").toLowerCase().trim();
        
                return (
                <Button
                    key={action.code ?? action.name ?? index}
                    type="button"
                    onClick={() => onAction(metadata, item, action)}
                    size="sm"
                    className={`h-auto py-1.5 px-3 flex flex-col items-center justify-center gap-1 border font-medium text-[11px] leading-none rounded shadow-sm transition-colors cursor-pointer ${isFilled(key) ? getFilledButtons(key) : DEFAULT_BTN}`}
                >
                    {Icon && <Icon 
                        style={!isFilled (key) && isRawCss (key) ? { color: action.color } : undefined}
                        className={`h-3.5 w-3.5 shrink-0 ${isFilled(key) ? "text-white" : getIconColor(key) || "text-slate-400 dark:text-slate-500"}`}
                     />}
                    <span className="truncate">{action.name}</span>
                </Button>
                );
            })}
        </div>
    )
}