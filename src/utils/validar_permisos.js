import permisos, { roles_map } from "../configuracion/permisos.js";

/**
 * Valida de forma estática (Bread) si el rol del usuario cuenta con una regla 
 * configurada para realizar la acción solicitada sobre una entidad específica.
 * 
 * @param {Object} user - Objeto del usuario autenticado extraído de req.user.
 * @param {number|string} user.rol - ID o identificador del rol del usuario.
 * @param {string} accion - Acción BREAD que se intenta ejecutar (browse, read, add, edit, delete).
 * @param {string} entidad - Nombre del recurso o tabla sobre la que se opera (ej: 'pacientes').
 * @returns {boolean} True si el rol tiene permitido el acceso base; False en caso contrario.
 */
export const validar_permisos = (user, accion, entidad) => {
    // 1. Control defensivo: Si el payload del usuario o el rol no son válidos, denegar de inmediato
    if (!user || !user.rol) return false;

    // 2. Mapeamos el ID del rol al string correspondiente (ej: 2 -> "medico")
    const rolKey = roles_map[user.rol];
    if (!rolKey) return false;

    // 3. Extraemos la configuración de permisos para el rol, acción y entidad específicos
    const configPermisosBase = permisos[rolKey]?.[accion]?.[entidad];

    // 4. Si es un Array (campos globales) o un Objeto con la propiedad 'owned', el permiso base existe
    if (Array.isArray(configPermisosBase)) {
        return true;
    }
    
    if (configPermisosBase && typeof configPermisosBase === "object" && configPermisosBase.owned) {
        return true;
    }

    // Si no coincide con ninguna estructura autorizada en permisos.js, se rechaza
    return false;
};

export default validar_permisos;