const ICON_COLORS = {
        green: "text-emerald-600 dark:text-emerald-400",
        success: "text-emerald-600 dark:text-emerald-400",
        blue: "text-sky-600 dark:text-sky-400",
        info: "text-sky-600 dark:text-sky-400",
        orange: "text-amber-600 dark:text-amber-400",
        warning: "text-amber-600 dark:text-amber-400",
        red: "text-red-600 dark:text-red-400",
        purple: "text-purple-600 dark:text-purple-400",
    };

    const FILLED_BUTTONS = {
        danger: "bg-red-600 hover:bg-red-700 border-red-600 text-white dark:bg-red-700 dark:hover:bg-red-600",
        primary: "bg-[var(--brand-primary,#6d28d9)] hover:bg-[var(--brand-hover,#5b21b6)] border-[var(--brand-primary,#6d28d9)] text-white",
    };

    export const DEFAULT_BTN =
    "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 hover:text-slate-800 dark:text-slate-300";

    export const isFilled = (key) => {
        return Boolean(FILLED_BUTTONS[key]);
    }

    export const getFilledButtons = (key) => {
        return FILLED_BUTTONS[key];
    }

    export const getIconColor = (key) => {
        return ICON_COLORS[key];
    }

    export const isRawCss = (key) => {
        return key ? ( key.startsWith("#") || key.startsWith("rgb") ) : false;
    }