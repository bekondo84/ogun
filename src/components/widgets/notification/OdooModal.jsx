import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, Info, XCircle, HelpCircle } from 'lucide-react';

/**
 * Composant Modal style Odoo Moderne
 */
export default function OdooModal({
  isOpen,
  title,
  message,
  children, // Permet d'injecter du contenu personnalisé si besoin
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "info", // 'info' | 'success' | 'warning' | 'danger' | 'default'
  showCancel = true,
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  // Empêcher la fermeture via Échap si c'est une modale critique, ou fermer par défaut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onCancel?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  // Configuration des icônes et couleurs selon la variante (Style Odoo)
  const variantConfig = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      badgeBg: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-100 dark:border-emerald-900/50",
      confirmBtn: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500",
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      badgeBg: "bg-amber-50 dark:bg-amber-950/50 border-amber-100 dark:border-amber-900/50",
      confirmBtn: "bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500",
    },
    danger: {
      icon: <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
      badgeBg: "bg-red-50 dark:bg-red-950/50 border-red-100 dark:border-red-900/50",
      confirmBtn: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      badgeBg: "bg-blue-50 dark:bg-blue-950/50 border-blue-100 dark:border-blue-900/50",
      confirmBtn: "bg-purple-700 hover:bg-purple-800 text-white focus:ring-purple-500",
    },
    default: {
      icon: <HelpCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />,
      badgeBg: "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700",
      confirmBtn: "bg-purple-700 hover:bg-purple-800 text-white focus:ring-purple-500",
    },
  }[variant] || variantConfig.info;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* EN-TÊTE STYLE ODOO */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${variantConfig.badgeBg}`}>
              {variantConfig.icon}
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h3>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CORPS DE LA MODALE */}
        <div className="p-6 text-sm text-slate-600 dark:text-slate-300 space-y-3">
          {message && <p className="leading-relaxed">{message}</p>}
          {children}
        </div>

        {/* PIED DE PAGE (ACTIONS) */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          {showCancel && (
            <button
              type="button"
              disabled={isLoading}
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer inline-flex items-center gap-2 ${variantConfig.confirmBtn} disabled:opacity-50`}
          >
            {isLoading && (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}