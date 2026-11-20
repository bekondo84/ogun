import { create } from "zustand";
import { persist } from "zustand/middleware";

// Fonction utilitaire qui applique physiquement le thème complet sur la balise <html>
const applyThemeToDom = (
  mode = "light",
  accent = "purple",
  sidebarStyle = "default",
  topbarStyle = "default"
) => {
  const root = document.documentElement;

  // 1. Gestion du mode Clair / Sombre
  const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = mode === "dark" || (mode === "system" && isSystemDark);

  root.classList.toggle("dark", shouldBeDark);

  // 2. Gestion de la couleur d'accentuation
  root.setAttribute("data-accent", accent);

  // 3. Gestion indépendante des surfaces de navigation
  root.setAttribute("data-sidebar", sidebarStyle);
  root.setAttribute("data-topbar", topbarStyle);
};

export const useErpStore = create(
  persist(
    (set, get) => ({
      erpTemplate: "NAV_PLUGIN_002",
      themeMode: "light",      // 'light' | 'dark' | 'system'
      accentColor: "purple",   // 'purple' | 'blue' | 'emerald' | 'indigo' | 'amber' | 'rose' | 'slate'
      sidebarStyle: "default", // 'default' | 'light' | 'dark' | 'brand'
      topbarStyle: "default",  // 'default' | 'light' | 'dark' | 'brand'

      setErpTemplate: (newTemplate) => set({ erpTemplate: newTemplate }),

      setThemeMode: (mode) => {
        const { accentColor, sidebarStyle, topbarStyle } = get();
        applyThemeToDom(mode, accentColor, sidebarStyle, topbarStyle);
        set({ themeMode: mode });
      },

      setAccentColor: (accent) => {
        const { themeMode, sidebarStyle, topbarStyle } = get();
        applyThemeToDom(themeMode, accent, sidebarStyle, topbarStyle);
        set({ accentColor: accent });
      },

      setSidebarStyle: (sidebarStyle) => {
        document.documentElement.setAttribute("data-sidebar", sidebarStyle);
        set({ sidebarStyle });
      },

      setTopbarStyle: (topbarStyle) => {
        document.documentElement.setAttribute("data-topbar", topbarStyle);
        set({ topbarStyle });
      },

      // À appeler une fois au démarrage de l'application et à la réhydratation
      initTheme: () => {
        const {
          themeMode = "light",
          accentColor = "purple",
          sidebarStyle = "default",
          topbarStyle = "default",
        } = get();
        applyThemeToDom(themeMode, accentColor, sidebarStyle, topbarStyle);
      },
    }),
    {
      name: "erp-global-storage",
      onRehydrateStorage: () => (state) => {
        state?.initTheme();
      },
    }
  )
);