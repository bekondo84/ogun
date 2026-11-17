import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

/**
 * @param {Array<{ label: string, href?: string }>} items Liste des étapes du fil d'Ariane.
 * @param {string} [className] Classes Tailwind additionnelles pour le conteneur.
 * @param {function} [onAction] Callback déclenché au clic sur une étape parente.
 */
export default function Breadcrumb({ items = [], className = '', onAction }) {
  if (!items || items.length === 0) return null;

  const handleItemClick = (e, item) => {
    e.preventDefault();
    onAction?.(item);
  };

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center text-xs text-slate-500 dark:text-slate-400 select-none ${className}`}
    >
      <ol className="inline-flex items-center gap-1 flex-wrap">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          return (
            <li key={item.href || `${item.label}-${index}`} className="inline-flex items-center">
              {/* Séparateur Chevron */}
              {!isFirst && (
                <ChevronRight 
                  className="w-3.5 h-3.5 mx-0.5 text-slate-300 dark:text-slate-600 shrink-0" 
                  aria-hidden="true"
                />
              )}

              {/* Élément actif (dernier) vs Liens cliquables */}
              {isLast ? (
                <span 
                  className="font-semibold text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] bg-[var(--brand-soft)] dark:bg-[var(--brand-soft-dark)] border border-[var(--brand-border)] px-2.5 py-0.5 rounded-md inline-flex items-center gap-1.5 shadow-2xs transition-colors"
                  aria-current="page"
                >
                  {isFirst && <Home className="w-3.5 h-3.5 shrink-0" />}
                  <span>{item.label}</span>
                </span>
              ) : (
                <a
                  href={item.href || '#'}
                  onClick={(e) => handleItemClick(e, item)}
                  className="group inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400 hover:text-[var(--brand-primary)] dark:hover:text-[var(--brand-primary-dark)] px-2 py-0.5 rounded-md hover:bg-[var(--brand-soft)]/60 dark:hover:bg-[var(--brand-soft-dark)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/30 transition-all cursor-pointer"
                >
                  {isFirst && (
                    <Home className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-[var(--brand-primary)] dark:group-hover:text-[var(--brand-primary-dark)] shrink-0 transition-colors" />
                  )}
                  <span>{item.label}</span>
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}