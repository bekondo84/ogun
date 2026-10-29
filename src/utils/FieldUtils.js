export const fieldValue = (field, item) => {
    if (!field || !item ) return "";
     if (field.widget === "manytoone") {
        return item[field.fieldName] !== null ? item[field.fieldName]['stringValue'] : "";
     }else if (field.widget === 'date') {
        return formatDate(item[field.fieldName]);
     } else if (field.widget === 'datetime-local') {
        return formatDateTime(item[field.fieldName]);
     } else if (field.widget === 'time') {
        return formatTime(item[field.fieldName]);
     } else if (field.widget === 'password') {
        return '.......';
     } else if (field.widget === 'media') {
        return item[field.fieldName]?.url;
     }else {
        return item[field.fieldName];
     }
}

export const formatDate = (dataString) => {
    if (!dataString) return "-";

    try {
        const date = new Date (dataString);

        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year:'numeric'
        }).format(date)
    } catch (error) {
        return dataString;
    }
};

export const formatDateTime = (dateString) => {
    if (!dateString) return "-";

    try {
        return new Intl.DateTimeFormat('fr-FR', {
            day:'2-digit',
            month:'2-digit',
            year:'numeric',
            hour:'2-digit',
            minute:'2-digit',
            second:'2-digit'
        }).format(new Date(dateString)).replace(' ', ' ');
    } catch (error) {
        return dateString;
    }
}
export const formatTime = (dateString) => {
    if (!dataString) return "-";

    try {
        return new Intl.DateTimeFormat('fr-FR', {
            hour:'2-digit',
            minute:'2-digit',
            second:'2-digit'
        }).format(new Date(dateString)).replace(' ', ' à ');
    } catch (error) {
        return dateString;
    }
}