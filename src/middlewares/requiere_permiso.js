// middlewares/requiere_permiso.js
import { validar_permisos } from "../utils/validar_permisos.js";
import permisos, { roles_map, ENTIDADES } from "../configuracion/permisos.js";

/**
 * @typedef {Object} PermisoCamposPropietarios
 * @property {(req: Object, res: Object) => Promise<boolean>} owned - Función asíncrona que resuelve la propiedad del recurso.
 * @property {string[]} fields - Lista blanca de campos permitidos.
 */

/**
 * Una definicion de requerimiento de permiso sobre campos de un recurso puede ser
 * una coleccion de los nombres de propiedades del recurso 
 * o un objeto que las indique en `fields` junto a una funcion que resuelva si les pertenece o no el recurso
 * @typedef {PermisoCamposPropietarios | string[]} PermisoSobreRecurso
 */

/**
 * @typedef {Record<keyof typeof ENTIDADES, PermisoSobreRecurso>} PermisoDeAccionSobreRecursos
 */

/**
 * @typedef {Object} RequerimientoPermiso 
 * @property {PermisoDeAccionSobreRecursos | null} [browse] - Ver múltiples registros de la entidad.
 * @property {PermisoDeAccionSobreRecursos | null} [read] - Ver un registro individual específico.
 * @property {PermisoDeAccionSobreRecursos | null} [edit] - Modificar un registro existente.
 * @property {PermisoDeAccionSobreRecursos | null} [add] - Crear o añadir un nuevo registro.
 * @property {PermisoDeAccionSobreRecursos | null} [delete] - Realizar el borrado del registro.
 */

/**
 * Middleware para proteger rutas basado en el objeto de permisos.
 * @param {RequerimientoPermiso} requerimientos - Permisos necesarios (Estructura Acción -> Entidad -> Spec)
 * 
 */
export const requiere_permiso = (requerimientos) => {
    return async (req, res, next) => {
        const DEBUG = process.env.MODO_DEBUG === "true";

        if (!req.user || !req.user.rol) {
            return res.status(401).json({ error: "No autorizado" });
        }

        const rolKey = roles_map[req.user.rol];

        if (rolKey === "admin") {
            return next();
        }

        const [accion] = Object.keys(requerimientos);
        const [entidad] = Object.keys(requerimientos[accion]);
        
        const especificacionRuta = requerimientos[accion][entidad];
        
        const tienePermisoBase =
            validar_permisos(
                req.user,
                accion,
                entidad,
                especificacionRuta
            );

        if (!tienePermisoBase) {

            return res.status(403).json(
                DEBUG
                    ? {
                        error: "Permisos insuficientes",
                        mensaje:
                            `Tu rol no puede realizar la acción [${accion}] sobre [${entidad}].`
                    }
                    : {
                        error: "Acceso denegado",
                        mensaje:
                            "No puedes acceder a este recurso debido a tu rol actual."
                    }
            );
        }

        const configPermisosBase = permisos[rolKey][accion][entidad];
        
        let camposFinalesPermitidos = null;
        let requiereValidarPropiedad = false;

        // Analizamos qué exige la base de datos de permisos para este usuario
        if (Array.isArray(configPermisosBase)) {
            // Es un acceso global para este rol (no requiere propiedad, ej: un recepcionista leyendo pacientes)
            camposFinalesPermitidos = configPermisosBase;
        } else if (typeof configPermisosBase === "object" && configPermisosBase.owned) {
            // El rol TIENE OBLIGATORIAMENTE que ser dueño para tocar esto
            requiereValidarPropiedad = true;
            camposFinalesPermitidos = configPermisosBase.owned;
        }

        // 3. Inspeccionamos lo que el desarrollador configuró en la ruta de Express
        let funcionVerificadora = null;

        if (especificacionRuta && typeof especificacionRuta === "object" && typeof especificacionRuta.owned === "function") {
            funcionVerificadora = especificacionRuta.owned;
        }

        // CONTROL DE SEGURIDAD INTERNO
        // Si permisos.js exige propiedad, pero el programador olvidó poner 'owned' en la ruta, bloqueamos por seguridad.
        if (requiereValidarPropiedad && !funcionVerificadora) {
            console.error(`[SEGURIDAD] Error crítico: La ruta para [${entidad}] exige validación de propiedad para el rol [${rolKey}], pero no se inyectó la función verificadora.`);
            return res.status(500).json({ error: "Error interno de configuración de seguridad del servidor." });
        }

        if (requiereValidarPropiedad && funcionVerificadora) {
            try {
                const esPropietario = await funcionVerificadora(req, res);
                if (!esPropietario) {
                    return res.status(403).json(
                        DEBUG
                            ? {
                                error: "Acceso denegado",
                                mensaje: `Operación rechazada: No posees derechos de propiedad o relación activa con este registro de ${entidad}.`
                            }
                            : {
                                error: "Acceso denegado",
                                mensaje: "No puedes acceder a este recurso debido a tu rol actual."
                            }
                    );
                }
            } catch (error) {
                console.error("Error en propiedad inyectada:", error);
                return res.status(500).json({ error: "Error interno de validación de seguridad." });
            }
        }

        // 5. Validación "Fail-Fast" de campos (Cruzando req.body contra permisos.js)
        if ((accion === "edit" || accion === "add") && camposFinalesPermitidos) {
            if (!camposFinalesPermitidos.includes("*")) {
                const camposEnviados = Object.keys(req.body);
                
                // Buscamos si el usuario envió algún campo que NO esté en la lista de permisos.js
                const camposNoPermitidos = camposEnviados.filter(
                    (campo) => !camposFinalesPermitidos.includes(campo)
                );

                if (camposNoPermitidos.length > 0) {
                    return res.status(400).json(
                        DEBUG
                            ? {
                                error: "Petición incorrecta (Bad Request)",
                                mensaje: `Tu rol no tiene autorización para modificar los siguientes campos: [${camposNoPermitidos.join(", ")}].`,
                                campos_permitidos: camposFinalesPermitidos
                            }
                            : {
                                error: "Petición incorrecta",
                                mensaje: "La solicitud contiene información que no puede ser procesada."
                            }
                    );
                }
            }
        }

        next();
    };
};
