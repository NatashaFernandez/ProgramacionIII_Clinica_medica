import db from '../configuracion/db.js';

export default class Turnos {

    buscarPorId = async (id) => {

        const [turnos] = await db.query(
            `SELECT *
             FROM turnos_reservas
             WHERE id_turno_reserva = ?`,
            [id]
        );

        return turnos[0] ?? null;
    };

    obtenerPacientePorUsuario = async (id_usuario) => {

        const [pacientes] = await db.query(
            `SELECT
                id_paciente,
                id_obra_social
             FROM pacientes
             WHERE id_usuario = ?`,
            [id_usuario]
        );

        return pacientes[0] ?? null;
    };

    existeMedico = async (id_medico) => {

        const [medicos] = await db.query(
            `SELECT id_medico
             FROM medicos
             WHERE id_medico = ?`,
            [id_medico]
        );

        return medicos.length > 0;
    };

    existePaciente = async (id_paciente) => {

        const [pacientes] = await db.query(
            `SELECT
                id_paciente,
                id_obra_social
             FROM pacientes
             WHERE id_paciente = ?`,
            [id_paciente]
        );

        return pacientes[0] ?? null;
    };

    turnoOcupado = async (
        fecha_hora,
        id_medico
    ) => {

        const [turnos] = await db.query(
            `SELECT id_turno_reserva
             FROM turnos_reservas
             WHERE fecha_hora = ?
             AND id_medico = ?
             AND activo = 1`,
            [
                fecha_hora,
                id_medico
            ]
        );

        return turnos.length > 0;
    };

}