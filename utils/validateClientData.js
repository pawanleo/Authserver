const validateClientData = (data) => {
    const { name, redirectUri } = data;
    let errors = [];

    if (!name || name.trim() === '') {
        errors.push('Client name is required.');
    }

    if (!redirectUri || redirectUri.trim() === '') {
        errors.push('At least one redirect URI is required.');
    } else {
        if (!redirectUri.startsWith('http://') && !redirectUri.startsWith('https://')) {
        errors.push(`Invalid redirect URI: ${redirectUri}`);
    }
    }

    return errors;
};
module.exports ={validateClientData}