import jwt from 'jsonwebtoken';

/**
 * Middleware para validar el JWT y establecer la sesión del usuario.
 */
export const requiere_session = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // El token suele venir como "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            error: "No autorizado", 
            mensaje: "Se requiere un token de sesión para acceder." 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.CLAVE_JWT || 'clave_secreta_por_defecto');
        req.user = decoded; // Inyectamos el usuario (con su rol) para el siguiente middleware
        next();
    } catch (error) {
        return res.status(403).json({ 
            error: "Token inválido", 
            mensaje: "Su sesión ha expirado o el token no es válido." 
        });
    }
};