/**
 * - Médico (ROL = 1)
 *   ● Iniciar sesión.
 *   ● Listar turnos owned.
 *   ● Marcar un turno como atendido.
 *
 * - Paciente (ROL = 2)
 *   ● Iniciar sesión.
 *   ● Crear reservas (turnos owned).
 *   ● Listar turnos owned.
 *   ● Listar especialidades.
 *   ● Listar todos los médicos y de una especialidad.
 *
 * - Administrador (ROL = 3)
 *   ● Iniciar sesión.
 *   ● Listar, crear y editar especialidades.
 *   ● Asociar médicos con especialidades.
 *   ● Listar, crear y editar obras sociales.
 *   ● Asociar médicos con obras sociales.
 *   ● Asociar pacientes con obras sociales.
 *   ● Registrar un turno para un paciente, médico y fecha.
 *   ● Obtener estadísticas de atenciones
 */
const permisos = {
  admin: {
    browse: {
      especialidades: ["*"],
      obras_sociales: ["*"],
      pacientes: ["*"],
      medicos: ["*"],
      turnos: ["*"],
      estadisticas: ["*"],
    },
    read: {
      especialidades: ["*"],
      obras_sociales: ["*"],
      pacientes: ["*"],
      medicos: ["*"],
      turnos: ["*"],
    },
    add: {
      especialidades: ["*"],
      obras_sociales: ["*"],
      medicos_obras_sociales: ["*"],
      turnos: ["*"],
    },
    edit: {
      especialidades: ["*"],
      obras_sociales: ["*"],
      medicos: ["id_especialidad"],
      pacientes: ["id_obra_social"],
    },
    delete: {
      especialidades: ["soft"],
      obras_sociales: ["soft"],
      medicos: ["soft"],
      pacientes: ["soft"],
    },
  },
  medico: {
    browse: {
      turnos: ["owned"],
      pacientes: ["owned"],
    },
    read: {
      turnos: { owned: ["*"] },
      pacientes: { owned: ["*"] },
    },
    edit: {
      turnos: {
        owned: ["atendido"],
      }
    },
  },
  paciente: {
    browse: {
      turnos: ["owned"],
      especialidades: ["*"],
      medicos: ["especialidades"],
    },
    read: {
      turnos: ["owned"],
      medicos: ["partial"],
    },
    add: {
      turnos: ["owned"],
    },
  },
};

export const ENTIDADES = {
  "especialidades": 'Especialidades',
  "obras_sociales": 'Obras sociales',
  "pacientes": 'Pacientes',
  "medicos": 'Médicos',
  "turnos": 'Turnos',
  "estadisticas": 'Estadísticas',
}

/**
 * Mapeo de IDs de rol (de la base de datos) a las claves del objeto de permisos.
 */
export const roles_map = {
  1: "medico",
  2: "paciente",
  3: "admin",
};

export default permisos;
