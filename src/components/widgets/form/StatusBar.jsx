import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { fieldValueStr, getFormFields, visible } from "@/utils/FormUtils";

const SUCCESS_STATES = ["won", "done", "validated", "approved"];

// Jeu de données par défaut pour les états du workflow
export const DEFAULT_STATES = [
  { value: "new", label: "Nouveau" },
  { value: "qualified", label: "Qualifié" },
  { value: "in_progress", label: "En Cours" },
  { value: "review", label: "En Révision" },
  { value: "won", label: "Gagné" },
];

export default function StatusBar({
  data,
  metadata,
  onStageChange,
}) {
  const [states, setStates] = useState(DEFAULT_STATES);
  const [show, setShow] = useState(true);
  const [field, setField] = useState(null);
  const [currentStage, setCurrentStage] = useState(null);
  const [fields, setFields] = useState([])

  useEffect(() => {
    const editorarea = metadata?.editorarea;
    const stateCompo = editorarea?.states;
    setFields(getFormFields(editorarea));

    if (stateCompo) {
        setField(stateCompo.field);
        if (stateCompo.states.length > 0) {
            setStates(stateCompo.states);
        }
       setCurrentStage(fieldValueStr(stateCompo?.field, data));
       //console.log('StatusBar.useEffect ------------------ '+JSON.stringify(stateCompo)+'--------'+JSON.stringify(fieldValueStr(stateCompo.field, data)))
    } 

    if (typeof metadata?.showStatusBar === "boolean") {
      setShow(metadata.showStatusBar);
    }
  }, [metadata]);

  if (!show || states.length === 0) {
    return null;
  }

  const getStepStyle = (stateValue) => {
    const isActive = currentStage === stateValue;
    //console.log('StatusBar.getStepStyle --------------- '+currentStage+' --------- '+stateValue+' ---------- '+isActive)
    if (!isActive) {
      return "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70";
    }

    const isSuccess = SUCCESS_STATES.includes(String(stateValue).toLowerCase());
    if (isSuccess) {
      return "bg-emerald-600 text-white font-bold";
    }

    return "bg-[var(--brand-primary,#6d28d9)] dark:bg-[var(--brand-primary-dark,#7c3aed)] text-white font-bold";
  };

  return (
    <div className="inline-flex items-center border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden bg-slate-50/50 dark:bg-slate-950 font-medium text-[11px]">
      {states.map((state, index) => {
        const value = state.code ;         
        const label = state.name;          
        const isLast = index === states.length - 1;

        return (
          <React.Fragment key={value || index}>
            { visible(fields, state.visibleWhen, data) ? (
            <button
              type="button"
              onClick={() => onStageChange?.(value, state)}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${getStepStyle(
                value
              )}`}
            >
              {label}
            </button>) : null}

            {!isLast && visible(fields, state.visibleWhen, data) && (
              <div className="flex items-center self-stretch text-slate-300 dark:text-slate-700 bg-white dark:bg-slate-900 px-0.5">
                <ChevronRight className="h-3 w-3" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}