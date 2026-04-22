export const decodeJWT = (token) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = parts[1];
        const decodedPayload = Buffer.from(payload, 'base64url').toString('utf8');
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error("Error al decodificar el JWT:", error);
        return null;
    }
};
