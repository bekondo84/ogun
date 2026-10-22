/**
 * Convert the base java type to corresponding java type
 * @param {*} type 
 * @returns 
 */
export const getColumnType = (type) => {
    var coltype = type
      if (type === 'int') {
          coltype = 'java.lang.Integer'
      } else if (type == 'float') {
        coltype = 'java.lang.Float'
      } else if (type == 'short') {
        coltype = 'java.lang.Short'
      }  else if (type == 'double') {
        coltype = 'java.lang.Double'
      }  else if (type == 'long') {
        coltype = 'java.lang.Long'
      } else if (type == 'string') {
        coltype = 'java.lang.String'
      }
      return coltype;
}

/**
 * Extract the value 
 * @param {*} item 
 * @param {*} field 
 * @returns 
 */
const extractFieldValue = (item, field) => {

    if (item == null) {
        return null;
    }
    var fieldpath = field.split('.')
    var value = item
    for (var path in fieldpath) {
        let fieldname = fieldpath[path]
       if (value[fieldname] == null)
         return null
       value = value[fieldname]
    }
    return value
}
/**
 * 
 * @param {*} item 
 * @param {*} field 
 */
export const extractValue = (item, filter) => {
      if (filter.nature == 'value') {
        return filter.source
      } else if (filter.nature == 'field') {
         return extractFieldValue(item, filter.source)
      }
     return  null;
}
/**
 * 
 * @param {*} filters 
 * @param {*} item 
 * @returns 
 */
export const convertFiltersToPredicats = (filters, item) => {
       //Return empty array if the filters is null or empty
       var predicats = []   
       
       if (filters != null) {
           for (var index in filters) {
               var filter = filters[index]
               let value = extractValue (item, filter)
               predicats.push({
                 fieldName: filter.target,
                 label: "" ,
                 value: value,
                 type: getColumnType(filter.type),
                 cond: filter.operator
               })               
           }
       }
       return predicats
}

/**
 * 
 * @param {*} snapshaps 
 * @param {*} title 
 * @param {*} meta 
 * @param {*} data 
 * @param {*} predicats 
 * @param {*} viewmode 
 * @param {*} metatype 
 * @returns 
 */
export const updateSystemSnapshaps = (snapshaps, title, meta, data, predicats, viewmode, metatype) => {
    var store = [...snapshaps]
    store.push({
        label: title,
        meta: meta,
        data: data,
        predicats: predicats,
        viewmode: viewmode
    })
    return store
}
/**
 * 
 * @param {*} snapshaps 
 * @returns 
 */
export const removeLastsystemSnapshaps = (snapshaps) => {
    var store = [...snapshaps]
    store.pop()
    return store
}

/**
 * 
 * @param {*} snapshaps 
 * @returns 
 */
export const refreshBreadcrumbs = (snapshaps) => {
    var breadcrumbs = []

    for (var snap in snapshaps) {
        breadcrumbs.push({
            key: snap,
            label: snapshaps[snap].label
        })
    }

    return breadcrumbs
}

export const refreshSnapshaps = (key, snapshaps) => {
     
    var snapshapstore = []
    for (var i = 0; i < key; i++) {
       snapshapstore.push(snapshaps[i])
    }

    return snapshapstore
}