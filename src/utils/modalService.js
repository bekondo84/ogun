// Ce fichier fait le pont entre le JS pur (Axios) et React
let showModalGlobal = null;

export const setGlobalModal = (modalFn) => {
  showModalGlobal = modalFn;
};

export const triggerGlobalModal = (options) => {
  if (showModalGlobal) {
    return showModalGlobal(options);
  }
  // Fallback si la modale n'est pas encore montée
  // alert(options.message);
};