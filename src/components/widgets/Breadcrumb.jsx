import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

/**
 * @param {Array<{ label: string, href?: string }>} items - Liste des étapes du fil d'Ariane.
 * @param {React.ReactNode} [homeIcon] - Icône personnalisée pour l'accueil (optionnelle).
 * @param {string} [className] - Classes Tailwind additionnelles pour le conteneur.
 */
export default function Breadcrumb({ items = [], className = '',onAction }) {
  if (!items || items.length === 0) return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center text-xs text-slate-500 dark:text-slate-400 ${className}`}
    >
      <ol className="inline-flex items-center space-x-1 sm:space-x-1.5 flex-wrap">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center">
              {/* Séparateur Chevron pour tous les éléments sauf le premier */}
              {!isFirst && (
                <ChevronRight className="w-3.5 h-3.5 mx-1 text-slate-400 dark:text-slate-600 shrink-0 select-none" />
              )}

              {/* Contenu du lien ou du texte simple */}
              {isLast  ? (
                <span 
                  className="font-medium text-slate-900 dark:text-slate-200 inline-flex items-center gap-1"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {isFirst && <Home className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />}
                  {item.label}
                </span>
              ) : (
                <a
                  href="#" onClick={() => onAction(item)}
                  className="inline-flex items-center gap-1 font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {isFirst && <Home className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />}
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}