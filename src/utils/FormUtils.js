import { executedPostMethod } from '@/axios/DataService';
import {compare, getColumnType} from './Utils'

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

export const fieldValueStr = (path, formdata) => {
  if (path == null || formdata == null) {
    return null;
  }

  // Si formdata est un wrapper API { data: { ... } } et que la racine demandée n'est pas "data"
  const root =
    formdata.data &&
    typeof formdata.data === "object" &&
    !Array.isArray(formdata.data) &&
    !String(path).startsWith("data.") &&
    !(String(path).split(".")[0] in formdata)
      ? formdata.data
      : formdata;

  // Normalise les crochets de tableau (ex: "lines[0].price" -> "lines.0.price")
  const keys = String(path)
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);

  let current = root;
  for (const key of keys) {
    if (current == null || typeof current !== "object") {
      return null;
    }
   
    current = current[key];
  }
  
  if (current === undefined || current === null) {
    return null;
  }
  //console.log('-*-*-*- '+JSON.stringify(current)+' ---- '+JSON.stringify(keys)+' ----- ')
 

  return current;
};

/**
 * 
 * @param {*} fields 
 * @param {*} rulestr 
 * @param {*} formdata 
 * @returns 
 */
export const visible = (fields, rulestr, formdata) => {
  if (rulestr === null || rulestr === undefined || rulestr === "") {
    return true;
  }

  try {
    // 1. Accepte soit un tableau déjà parsé, soit du JSON, soit une expression JS
    let criterias = rulestr;
    if (typeof rulestr === "string") {
      const trimmed = rulestr.trim();
      if (!trimmed) return true;
      try {
        criterias = JSON.parse(trimmed);
      } catch {
        criterias = new Function(`return (${trimmed})`)();
      }
    }

    // Si une seule règle objet est passée au lieu d'un tableau, on l'enveloppe
    if (criterias && !Array.isArray(criterias) && typeof criterias === "object") {
      criterias = [criterias];
    }

    if (!Array.isArray(criterias) || criterias.length === 0) {
      return true;
    }

    // 2. .every() retourne un strict booléen (true/false) et s'arrête dès qu'une règle échoue
    return criterias.every((crit) => {
      if (!crit || !crit.field) return true;
      const value = fieldValueStr(crit.field, formdata);
      const operator = crit.criteria || "eq";
      //console.log('FormUtils.visible ------------------------ '+crit.field+'------'+JSON.stringify(crit.criteria)+'-----'+JSON.stringify(value)+'------'+operator+'---'+crit.value+' ----- '+compare(value, crit.value, operator))
      return Boolean(compare(value, crit.value, operator));
    });
  } catch (error) {
    console.error("Erreur d'évaluation de visibilité :", rulestr, error);
    return true;
  }
};

/**
 * 
 * @param {*} field_1 
 * @param {*} field_2 
 * @returns 
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

/**
 * 
 * @param {*} name 
 * @param {*} field 
 * @returns 
 */
export const dependsOn = (name, field) => {
      if (name == null || name == undefined)
        return null
      if (field == null || field == undefined) 
        return null
      const dependsOn = new Function(`return ${field.dependsOn}`) ()
     if (!Array.isArray(dependsOn))
       return null
     const values =  dependsOn.filter(fie => fie.field == name)
     return values.length > 0 ? values[0] : null
}

/**
 * 
 * @param {*} metadata 
 * @param {*} setColumns 
 * @returns 
 */
export const loadColumnsSettings = async(metadata, setColumns, setIsLoading) => {
   setIsLoading(false)
  try {
    const response =  await executedPostMethod("settingsAction", "get_user_table_settings", {
        typeCode: metadata.typeCode,
    })
    const settings = response.data

    if (settings && Object.keys(settings).length > 0) {
          setColumns(settings?.columns?.sort((a, b) => {
              return (a.sequence || 0) - (b.sequence || 0);
          }))
          return;
    } 
    setColumns([...metadata.listView.columns])
  } finally {
     setIsLoading(false)
  }
}

/**
 * 
 * @param {*} editingFilter 
 * @param {*} searchableColumns 
 * @param {*} setPredicates 
 * @param {*} onRefresh 
 */
export const applyPredicatesFilter = (editingFilter, searchableColumns, predicates, setPredicates, onRefresh) => {
      if (editingFilter.type === '1') {
        const currentPredicates = [...predicates]
        if (editingFilter && editingFilter.predicates.length > 0) {
            editingFilter.predicates.forEach(pred => {
              var field = searchableColumns.filter(col => col.fieldName == pred.field)[0]
              currentPredicates.push({
                    fieldName: field.fieldName,
                    label: field.label ,
                    value: pred.value,
                    type: getColumnType(field.type),
                    cond: pred.criteria
                });
                //console.log('CustomFilter.useEffect ----------------------------- '+field.fieldName+' --- '+field.label+' ---- '+JSON.stringify(field))
            });         
            setPredicates(currentPredicates)
            if (onRefresh) onRefresh(null, currentPredicates, null) 
        }
      }
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

