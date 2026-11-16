import { create } from 'zustand';
import { persist } from "zustand/middleware";

/**
export const useErpStore = create((set) => ({
  erpTemplate: localStorage.getItem("erp_template") || "NAV_PLUGIN_002",
  setErpTemplate: (newTemplate) => {
    localStorage.setItem("erp_template", newTemplate);
    set({ erpTemplate: newTemplate });
    //console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& : '+newTemplate)
  },
}));
*/


// Utilisation dans n'importe quel composant :
// const { erpTemplate, setErpTemplate } = useErpStore();

// Fonction utilitaire qui applique physiquement le thème sur la balise <html>
const applyThemeToDom = (mode, accent) => {
  const root = document.documentElement;

  // 1. Gestion du mode Clair / Sombre
  const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = mode === "dark" || (mode === "system" && isSystemDark);

  root.classList.toggle("dark", shouldBeDark);

  // 2. Gestion de la couleur d'accentuation
  root.setAttribute("data-accent", accent);
};

export const useErpStore = create(
  persist(
    (set, get) => ({
      erpTemplate: "NAV_PLUGIN_002",
      themeMode: "light",      // 'light' | 'dark' | 'system'
      accentColor: "purple",   // 'purple' | 'blue' | 'emerald'

      setErpTemplate: (newTemplate) => set({ erpTemplate: newTemplate }),

      setThemeMode: (mode) => {
        applyThemeToDom(mode, get().accentColor);
        set({ themeMode: mode });
      },

      setAccentColor: (accent) => {
        applyThemeToDom(get().themeMode, accent);
        set({ accentColor: accent });
      },

      // À appeler une fois au démarrage de l'application
      initTheme: () => {
        const { themeMode, accentColor } = get();
        applyThemeToDom(themeMode, accentColor);
      },
    }),
    {
      name: "erp-global-storage",
      onRehydrateStorage: () => (state) => {
        // Réapplique automatiquement le thème sauvegardé dès le chargement de la page
        state?.initTheme();
      },
    }
  )
)

