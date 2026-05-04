import { validar_permisos } from "../utils/validar_permisos.js";

/**
 * Middleware para proteger rutas basado en el objeto de permisos.
 * @param {object} requerimientos - Permisos necesarios (Estructura Acción -> Entidad -> Spec)
 */
export const requiere_permiso = (requerimientos) => {
    return (req, res, next) => {
        if (!req.user || !req.user.rol) {
            return res.status(401).json({ 
                error: "Acceso no autorizado", 
                mensaje: "Debe estar autenticado y poseer un rol válido." 
            });
        }

        const autorizado = validar_permisos(req.user, requerimientos);

        if (!autorizado) {
            return res.status(403).json({ error: "Permisos insuficientes" });
        }

        next();
    };
};