import {compare} from './Utils'

export const validateForm = (formData, columns = []) => {
  const newErrors = {};

  // Expressions régulières (Regex) pour valider les formats
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/; // Format FR standard, à adapter

  columns.forEach((col) => {
    const value = formData[col.fieldName];
    const isRequired = col.mandatory;
    //console.log('-------'+value+' --------- '+col.fieldName+' ----- '+isRequired+' *********')
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

/**
 * 
 * @param {*} schema 
 * @returns 
 */
export const getFormFields = (schema) => {
      if (schema == null || schema == undefined)
        return []
      var fields = []

      if (schema.form && schema.form.sections && schema.form.sections.length > 0) {
          schema.form.sections.forEach(section => {
              getSectionFields(section, fields)
          })
      }
      if (schema.tabs && schema.tabs.length > 0) {
        schema.tabs.forEach(tab => {
             if (tab.form && tab.form.sections && tab.form.sections.length >0) {
                 tab.form.sections.forEach(section => {
                     getSectionFields(section, fields)
                 })
             }
        })
      }
      return fields
}

const fieldValueStr = (path, formdata) => {
  if (path == null || formdata == null) {
    return null;
  }

  const keys = Array.isArray(path) ? path : String(path).split('.');

  let current = formdata;
  
  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      return null;
    }
    current = current[key];
  }

  return current !== undefined ? current : null;
};
/**
 * 
 * @param {*} fields 
 * @param {*} rulestr 
 * @param {*} formdata 
 */
export const visible = (fields, rulestr, formdata) => {
     if (rulestr == null || rulestr == undefined || rulestr == '') {
        return true
      }

      try {
         const criterias = new Function(`return ${rulestr}`) ();
          //console.log('visible ::::::::: '+criterias+' ----- '+Array.isArray(criterias)) 
      
         if (!Array.isArray(criterias)) {
            return  true
         }
         var active = true
         criterias.forEach(crit => {
            var value = fieldValueStr(crit.field, formdata)
           // console.log('visible  ================== value if field : '+value)
            active &= compare (value, crit.value, crit.criteria)
         })
         return active
      } catch(error) {
         console.error(error)
         return true
      }   
      
}
/**
 * Check if field_1 depends on field_2
 */
export const isDependsOn = (field_1, field_2) => {
  //console.log ('FormUtils.isDependsOn ----------------- '+field_1.dependsOn)
    if (field_1.dependsOn == null || field_1.dependsOn == undefined)
      return false
    const dependsOn = new Function(`return ${field_1.dependsOn}`) ()
    if (!Array.isArray(dependsOn))
      return false
    return dependsOn.map(d => d.field).includes(field_2.fieldName)
}

const getSectionFields = (section, fields) => {
    if (section) {
       if (section.fields && section.fields.length > 0) {
            section.fields.forEach(field => {
                if (!fields.map(f => f.fieldName).includes(field.fieldName)) {
                        fields.push(field)
                }
            })
       }

       if (section.sections && section.sections.length >0) {
            section.sections.forEach(sec => {
                getSectionFields(sec, fields)
            })
       }
    }
}
