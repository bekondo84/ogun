export const validateForm = (formData, columns = []) => {
  const newErrors = {};

  // Expressions régulières (Regex) pour valider les formats
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/; // Format FR standard, à adapter

  columns.forEach((col) => {
    const value = formData[col.fieldName];
    const isRequired = col.mandatory;
    console.log('-------'+value+' --------- '+col.fieldName+' ----- '+isRequired+' *********')
    // 1. Vérification des champs obligatoires
    if (isRequired && (value === undefined || value === null || String(value).trim() == "")) {
      newErrors[col.fieldName] = `Le champ "${col.label || col.fieldName}" est obligatoire.`;
      return; // Passe au champ suivant si celui-ci est vide
    }

    // Si le champ a une valeur, on valide son format
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      
      // 2. Validation du format EMAIL
      if (col.type?.toLowerCase() === "email" && !emailRegex.test(value)) {
        newErrors[col.fieldName] = "L'adresse email n'est pas valide (ex: nom@domaine.com).";
      }

      // 3. Validation du format TÉLÉPHONE
      if (col.type?.toLowerCase() === "phone" && !phoneRegex.test(value)) {
        newErrors[col.fieldName] = "Le numéro de téléphone n'est pas valide.";
      }

      // 4. Validation des formats NUMÉRIQUES (int, double, float, long)
      const numericTypes = ["int", "integer", "double", "float", "long", "short"];
      if (numericTypes.includes(col.type?.toLowerCase()) && isNaN(Number(value))) {
        newErrors[col.fieldName] = "Cette valeur doit obligatoirement être un nombre.";
      }
    }
  });

  return newErrors;
};
