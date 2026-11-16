import React, { createContext, useContext, useState } from "react";

// 1. Création du contexte
const ErpContext = createContext();

// 2. Création du Provider (qui va englober ton application)
export function ErpProvider({ children }) {
  // Initialisation propre depuis le localStorage (une seule fois au montage)
  const [erpTemplate, setErpTemplateState] = useState(() => {
    return localStorage.getItem("erp_template") || "NAV_PLUGIN_002";
  });

  // Fonction globale pour modifier la variable ET mettre à jour le localStorage
  const updateErpTemplate = (newTemplate) => {
    localStorage.setItem("erp_template", newTemplate);
    setErpTemplateState(newTemplate);
   // console.log('ErpContext.updateErpTemplate ------------------- '+newTemplate)
  };

  return (
    <ErpContext.Provider value={{ erpTemplate, updateErpTemplate }}>
      {children}
    </ErpContext.Provider>
  );
}

// 3. Hook personnalisé pour consommer la variable facilement partout
export function useErp() {
  const context = useContext(ErpContext);
  if (!context) {
    throw new Error("useErp doit être utilisé à l'intérieur d'un ErpProvider");
  }
  return context;
}