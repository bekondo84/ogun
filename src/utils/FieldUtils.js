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
    if (!dataString) return "-";

    try {
        return new Intl.DateTimeFormat('fr-FR', {
            day:'2-digit',
            month:'2-digit',
            year:'numeric',
            hour:'2-digit',
            minute:'2-digit',
            second:'2-digit'
        }).format(new Date(dateString)).replace(' ', ' à ');
    } catch (error) {
        return dateString;
    }
}