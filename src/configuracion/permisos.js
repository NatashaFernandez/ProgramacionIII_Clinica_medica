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
    },
    read: {
      turnos: ["owned"],
      pacientes: ["datos_contacto"],
    },
    edit: {
      turnos: ["atendido"],
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

const medico = {
  browse_fields: [""],
  partial_read_fields: [""],
  read_fields: [],
  add_fields: [],
  edit_fields: [],
  delete_fields: [],
};

const paciente = {
  browse_fields: ["id_especialidad", "nombre_especialidad", "nombre_medico", "apellido_medico"],
  partial_read_fields: ["nombre", "apellido", "especialidad"],
  read_fields: ["id_turno", "fecha", "hora", "id_medico"],
  add_fields: ["id_medico", "fecha", "hora"],
  edit_fields: [],
  delete_fields: [],
};

const especialidades = {
    browse_fields: [],
    partial_read_fields: [],
    read_fields: [],
    add_fields: [],
    edit_fields: [],
    delete_fields: [],
}

const obras_sociales = {
    browse_fields: [],
    partial_read_fields: [],
    read_fields: [],
    add_fields: [],
    edit_fields: [],
    delete_fields: [],
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
