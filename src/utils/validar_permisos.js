import permisos, { roles_map } from "../configuracion/permisos.js";

/**
 * Valida si el rol del usuario cuenta con permisos para ejecutar
 * la acción solicitada sobre una entidad específica y si la
 * configuración declarada en la ruta es compatible con los permisos
 * definidos para dicho rol.
 * 
 * @param {Object} user - Objeto del usuario autenticado extraído de req.user.
 * @param {number|string} user.rol - ID o identificador del rol del usuario.
 * @param {string} accion - Acción BREAD que se intenta ejecutar (browse, read, add, edit, delete).
 * @param {string} entidad - Nombre del recurso o tabla sobre la que se opera (ej: 'pacientes').
 * @param {any} especificacionRuta
 * @returns {boolean} True si el rol tiene permitido el acceso base; False en caso contrario.
 */
export const validar_permisos = (
    user,
    accion,
    entidad,
    especificacionRuta = null
) => {

    if (!user?.rol) {
        return false;
    }

    const rolKey = roles_map[user.rol];

    if (!rolKey) {
        return false;
    }

    const permisoRol =
        permisos[rolKey]?.[accion]?.[entidad];

    if (!permisoRol) {
        return false;
    }

    if (!especificacionRuta) {
        return true;
    }

    const rolEsGlobal =
        Array.isArray(permisoRol) &&
        permisoRol.includes("*");

    const rolEsOwned =
        typeof permisoRol === "object" &&
        permisoRol !== null &&
        permisoRol.owned;

    const rutaEsGlobal =
        Array.isArray(especificacionRuta) &&
        especificacionRuta.includes("*");

    const rutaEsOwned =
        typeof especificacionRuta === "object" &&
        especificacionRuta !== null &&
        typeof especificacionRuta.owned === "function";

    if (rolEsGlobal) {
        return true;
    }

    if (rolEsOwned) {
        return rutaEsOwned;
    }

    if (Array.isArray(permisoRol)) {

        if (!Array.isArray(especificacionRuta)) {
            return false;
        }

        return especificacionRuta.every(
            campo => permisoRol.includes(campo)
        );
    }

    return false;
};

export default validar_permisos;