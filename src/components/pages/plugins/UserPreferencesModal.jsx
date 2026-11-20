import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  SlidersHorizontal,
  Sun,
  Moon,
  Monitor,
  Check,
  RotateCcw,
  LayoutTemplate,
  Palette,
  PanelLeft,
  PanelTop,
  Loader2,
} from "lucide-react";
import { useErpStore } from "@/lib/useErpStore";

const TEMPLATE_OPTIONS = [
  {
    id: "NAV_PLUGIN_001",
    label: "Classique (Latéral)",
    description: "Navigation principale en barre latérale verticale",
  },
  {
    id: "NAV_PLUGIN_002",
    label: "Hybride (Haut + Latéral)",
    description: "Menus du module en haut et sous-menus à gauche",
  },
  {
    id: "NAV_PLUGIN_003",
    label: "Multi-Plugins",
    description: "Sélecteur d'applications en haut et arbre latéral",
  },
];

const THEME_MODE_OPTIONS = [
  { id: "light", label: "Clair", icon: Sun },
  { id: "dark", label: "Sombre", icon: Moon },
  { id: "system", label: "Système", icon: Monitor },
];

const ACCENT_OPTIONS = [
  { id: "purple", label: "Violet", hex: "#7e22ce" },
  { id: "blue", label: "Bleu", hex: "#2563eb" },
  { id: "emerald", label: "Émeraude", hex: "#059669" },
  { id: "indigo", label: "Indigo", hex: "#4f46e5" },
  { id: "amber", label: "Ambre", hex: "#d97706" },
  { id: "rose", label: "Rose", hex: "#e11d48" },
  { id: "slate", label: "Ardoise", hex: "#334155" },
];

const NAV_SURFACE_OPTIONS = [
  {
    id: "default",
    label: "Auto",
    swatch: "linear-gradient(135deg, #f8fafc 50%, #0f172a 50%)",
    border: "#cbd5e1",
  },
  { id: "light", label: "Clair", swatch: "#ffffff", border: "#cbd5e1" },
  { id: "dark", label: "Sombre", swatch: "#0f172a", border: "#334155" },
  { id: "brand", label: "Accent", swatch: "var(--brand-primary)", border: "transparent" },
  { id: "purple", label: "Violet", swatch: "#6b21a8", border: "transparent" },
  { id: "blue", label: "Bleu", swatch: "#1e40af", border: "transparent" },
  { id: "emerald", label: "Émeraude", swatch: "#065f46", border: "transparent" },
  { id: "indigo", label: "Indigo", swatch: "#3730a3", border: "transparent" },
  { id: "amber", label: "Ambre", swatch: "#92400e", border: "transparent" },
  { id: "rose", label: "Rose", swatch: "#9f1239", border: "transparent" },
  { id: "slate", label: "Ardoise", swatch: "#1e293b", border: "transparent" },
];

function NavSurfacePicker({ icon: Icon, title, value, onChange }) {
  const currentLabel = NAV_SURFACE_OPTIONS.find((opt) => opt.id === value)?.label || value;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Icon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
          {title}
        </span>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--brand-soft)] dark:bg-[var(--brand-soft-dark)] text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)]">
          {currentLabel}
        </span>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
        {NAV_SURFACE_OPTIONS.map((option) => {
          const isSelected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              title={option.label}
              className={`group relative h-7 w-full rounded-md transition-all cursor-pointer flex items-center justify-center ${
                isSelected
                  ? "ring-2 ring-[var(--brand-primary)] dark:ring-[var(--brand-primary-dark)] ring-offset-2 dark:ring-offset-slate-950 scale-105"
                  : "hover:scale-105 opacity-90 hover:opacity-100"
              }`}
              style={{
                background: option.swatch,
                border: `1px solid ${option.border}`,
              }}
            >
              {isSelected && (
                <Check
                  className={`h-3.5 w-3.5 stroke-[2.5] ${
                    option.id === "light"
                      ? "text-[var(--brand-primary)]"
                      : option.id === "default"
                        ? "text-amber-500"
                        : "text-white"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function UserPreferencesModal({
  isOpen,
  onClose,
  onSaveToServer, // Optionnel : async (prefs) => await api.patch('/ui-preferences/me', prefs)
}) {
  const {
    erpTemplate,
    themeMode,
    accentColor,
    sidebarStyle,
    topbarStyle,
    setErpTemplate,
    setThemeMode,
    setAccentColor,
    setSidebarStyle,
    setTopbarStyle,
  } = useErpStore();

  const [isSaving, setIsSaving] = useState(false);
  const initialSnapshotRef = useRef(null);

  // Capture l'état initial à l'ouverture pour pouvoir annuler proprement
  useEffect(() => {
    if (isOpen) {
      initialSnapshotRef.current = {
        erpTemplate,
        themeMode,
        accentColor,
        sidebarStyle,
        topbarStyle,
      };
    }
  }, [isOpen]);

  const handleCancel = () => {
    const snap = initialSnapshotRef.current;
    if (snap) {
      setErpTemplate(snap.erpTemplate);
      setThemeMode(snap.themeMode);
      setAccentColor(snap.accentColor);
      setSidebarStyle(snap.sidebarStyle);
      setTopbarStyle(snap.topbarStyle);
    }
    onClose();
  };

  const handleResetDefaults = () => {
    setErpTemplate("NAV_PLUGIN_002");
    setThemeMode("light");
    setAccentColor("purple");
    setSidebarStyle("default");
    setTopbarStyle("default");
  };

  const handleConfirmSave = async () => {
    const payload = {
      erpTemplate,
      themeMode,
      accentColor,
      sidebarStyle,
      topbarStyle,
    };

    try {
      setIsSaving(true);
      if (onSaveToServer) {
        await onSaveToServer(payload);
      }
      initialSnapshotRef.current = payload;
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[660px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl p-0 gap-0">
        {/* Liseré d'accentuation supérieur */}
        <div className="h-[3px] w-full rounded-t-lg bg-[var(--brand-primary)] dark:bg-[var(--brand-primary-dark)]" />

        <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-base font-semibold text-slate-800 dark:text-slate-100">
              <div className="p-1.5 rounded-lg bg-[var(--brand-soft)] dark:bg-[var(--brand-soft-dark)] text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)]">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
              <span>Préférences d'affichage et d'interface</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Personnalisez la disposition, le thème et les couleurs de navigation de votre espace de travail.
            </DialogDescription>
          </DialogHeader>

          {/* Aperçu miniature en temps réel */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs bg-slate-100/70 dark:bg-slate-900/50">
            {/* Mini Topbar */}
            <div className="h-7 px-3 flex items-center justify-between border-b border-[var(--topbar-border)] bg-[var(--topbar-bg)] text-[var(--topbar-text)] transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--topbar-indicator)]" />
                <span className="text-[10px] font-bold tracking-wide uppercase opacity-90">
                  {erpTemplate}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-8 rounded-full bg-[var(--topbar-active-bg)]" />
                <span className="h-2 w-6 rounded-full opacity-30 bg-current" />
              </div>
            </div>

            {/* Mini Corps (Sidebar + Zone Contenu) */}
            <div className="flex h-20">
              <div className="w-28 p-2 space-y-1.5 border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] transition-colors">
                <div className="h-2.5 w-full rounded bg-[var(--sidebar-active-bg)] flex items-center px-1.5">
                  <span className="h-1 w-10 rounded-full bg-[var(--sidebar-active-text)]" />
                </div>
                <div className="h-2 w-4/5 rounded opacity-25 bg-current" />
                <div className="h-2 w-3/5 rounded opacity-25 bg-current" />
              </div>

              <div className="flex-1 p-2.5 bg-white dark:bg-slate-950 flex flex-col justify-between transition-colors">
                <div className="flex items-center justify-between">
                  <span className="h-2.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                  <span className="h-4 px-2 rounded text-[9px] font-semibold text-white bg-[var(--brand-primary)] dark:bg-[var(--brand-primary-dark)] inline-flex items-center">
                    Action
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-7 rounded border border-[var(--brand-border)] bg-[var(--brand-soft)] dark:bg-[var(--brand-soft-dark)]" />
                  <div className="h-7 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900" />
                  <div className="h-7 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900" />
                </div>
              </div>
            </div>
          </div>

          {/* 1. Choix du Template de Navigation */}
          <div className="space-y-2">
            <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <LayoutTemplate className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              Disposition de navigation (Template)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {TEMPLATE_OPTIONS.map((tpl) => {
                const isSelected = erpTemplate === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setErpTemplate(tpl.id)}
                    className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "border-[var(--brand-primary)] dark:border-[var(--brand-primary-dark)] bg-[var(--brand-soft)]/70 dark:bg-[var(--brand-soft-dark)]/70 shadow-2xs"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-[var(--brand-border)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-xs font-semibold ${
                          isSelected
                            ? "text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)]"
                            : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {tpl.label}
                      </span>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] shrink-0" />
                      )}
                    </div>
                    <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                      {tpl.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800" />

          {/* 2. Mode de Thème & Couleur d'accentuation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mode Clair / Sombre / Système */}
            <div className="space-y-2">
              <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Sun className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                Mode d'affichage
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                {THEME_MODE_OPTIONS.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = themeMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setThemeMode(mode.id)}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-white dark:bg-slate-800 text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] font-semibold shadow-2xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Couleur d'accentuation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Palette className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  Couleur d'accentuation
                </label>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {ACCENT_OPTIONS.find((a) => a.id === accentColor)?.label}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1.5 pt-1">
                {ACCENT_OPTIONS.map((accent) => {
                  const isSelected = accentColor === accent.id;
                  return (
                    <button
                      key={accent.id}
                      type="button"
                      onClick={() => setAccentColor(accent.id)}
                      title={accent.label}
                      className={`h-7 w-7 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? "ring-2 ring-offset-2 dark:ring-offset-slate-950 scale-110"
                          : "hover:scale-110 opacity-85 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: accent.hex,
                        ringColor: accent.hex,
                      }}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5 text-white stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800" />

          {/* 3. Couleurs indépendantes des menus */}
          <div className="space-y-4">
            <NavSurfacePicker
              icon={PanelLeft}
              title="Couleur du menu vertical (Sidebar)"
              value={sidebarStyle}
              onChange={setSidebarStyle}
            />

            <NavSurfacePicker
              icon={PanelTop}
              title="Couleur du menu horizontal (Topbar)"
              value={topbarStyle}
              onChange={setTopbarStyle}
            />
          </div>

          {/* Pied de page */}
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={handleResetDefaults}
              disabled={isSaving}
              className="h-9 px-3 text-xs font-medium leading-none text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-none rounded-md inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Réinitialiser</span>
            </Button>

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={isSaving}
                className="h-9 px-3.5 text-xs font-medium leading-none text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-none rounded-md cursor-pointer"
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleConfirmSave}
                disabled={isSaving}
                className="h-9 px-4 text-xs font-semibold leading-none bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-white border-none rounded-md inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Enregistrer les préférences</span>
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}