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

     const MODO_DEBUG = process.env.MODO_DEBUG === 'true';

    if (MODO_DEBUG) {
        console.log(`[DEBUG-PERMISOS] Validando: Usuario ID ${user?.id}, Rol ${user?.rol}, Acción ${accion}, Entidad ${entidad}`);
    }

    if (!user?.rol) {
        if (MODO_DEBUG) console.warn(`[DEBUG-PERMISOS] Fallo: El objeto usuario no contiene un rol válido.`);
        return false;
    }

    const rolKey = roles_map[user.rol];

    if (!rolKey) {
        if (MODO_DEBUG) console.warn(`[DEBUG-PERMISOS] Fallo: El ID de rol ${user.rol} no está definido en roles_map.`);
        return false;
    }

    const permisoRol =
        permisos[rolKey]?.[accion]?.[entidad];

    if (!permisoRol) {
        if (MODO_DEBUG) console.warn(`[DEBUG-PERMISOS] Fallo: No existen reglas para ${rolKey} -> ${accion} -> ${entidad} en permisos.js.`);
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
        if (MODO_DEBUG) console.log(`[DEBUG-PERMISOS] Éxito: El rol ${rolKey} tiene acceso total ('*') a esta entidad.`);
        return true;
    }

    if (rolEsOwned) {
        if (MODO_DEBUG) console.log(`[DEBUG-PERMISOS] Verificando: El rol requiere propiedad. ¿La ruta provee verificador 'owned'? ${rutaEsOwned}`);
        return rutaEsOwned;
    }

    if (Array.isArray(permisoRol)) {

        if (!Array.isArray(especificacionRuta)) {
            if (MODO_DEBUG) console.warn(`[DEBUG-PERMISOS] Inconsistencia: El rol define campos permitidos pero la ruta no especifica una lista de campos.`);
            return false;
        }

        const todosValidos = especificacionRuta.every(
            campo => permisoRol.includes(campo)
        );

        if (MODO_DEBUG && !todosValidos) console.warn(`[DEBUG-PERMISOS] Fallo: Uno o más campos requeridos por la ruta no están permitidos para este rol.`);
        return todosValidos;
    }

    if (MODO_DEBUG) {
        console.warn(`[DEBUG-PERMISOS] Denegando acceso: No se encontró una coincidencia válida entre los permisos del rol y la especificación de la ruta.`);
    }
    
    return false;
};

export default validar_permisos;