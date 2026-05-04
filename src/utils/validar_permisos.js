import permisos, { roles_map } from "../configuracion/permisos.js";

/**
 * Valida si un usuario cumple con un conjunto de requerimientos de permisos.
 * Estructura de requerimientos: { accion: { entidad: [especificaciones] } }
 * 
 * @param {object} user - Objeto usuario con propiedad 'rol' (ID numérico)
 * @param {object} requerimientos - Mapa de permisos necesarios para la operación.
 * @returns {boolean} - Verdadero si el usuario tiene todos los permisos requeridos.
 */
export const validar_permisos = (user, requerimientos) => {
    if (!user || !user.rol) return false;

    const rolKey = roles_map[user.rol];
    const misPermisos = permisos[rolKey];

    if (!misPermisos) return false;

    for (const [accion, entidades] of Object.entries(requerimientos)) {
        const misEntidades = misPermisos[accion];
        if (!misEntidades) return false;

        for (const [entidad, specsRequeridas] of Object.entries(entidades)) {
            const misSpecs = misEntidades[entidad];
            if (!misSpecs) return false;

            // Si el usuario tiene acceso total ('*') en este nivel, saltamos validación detallada
            if (misSpecs.includes("*")) continue;

            // Caso: Requerimiento como objeto (ejemplo del usuario para agrupar bajo una entidad)
            if (typeof specsRequeridas === 'object' && !Array.isArray(specsRequeridas)) {
                for (const subEntidad in specsRequeridas) {
                    if (!misSpecs.includes(subEntidad)) return false;
                }
            } 

            // Caso: Requerimiento como array de especificaciones
            else if (Array.isArray(specsRequeridas)) {
                if (!specsRequeridas.every(s => misSpecs.includes(s) || s === "*")) return false;
            }
            // Caso: Requerimiento simple (string)
            else if (typeof specsRequeridas === 'string') {
                if (!misSpecs.includes(specsRequeridas)) return false;
            }
        }
    }

    return true;
};