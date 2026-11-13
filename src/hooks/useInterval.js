import { useEffect } from "react";

/**
 * Hook personnalisé pour exécuter une fonction à intervalle régulier
 * @param {Function} fetchFn La fonction à appeler
 * @param {number} interval L'intervalle en secondes
 */
export function useInterval(fetchFn, interval) {
  useEffect(() => {
    // Si pas d'intervalle ou de fonction, on ne fait rien
    if (!interval || !fetchFn) return;

    // 1. Convertit l'intervalle en millisecondes
    const intervalMs = interval * 1000;

    // 2. Lance l'intervalle
    const intervalId = setInterval(() => {
      fetchFn();
    }, intervalMs);

    // 3. Nettoyage obligatoire au démontage du composant
    return () => clearInterval(intervalId);
  }, [fetchFn, interval]); // Se relance si la fonction ou l'intervalle change
}