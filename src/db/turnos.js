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

    obtenerMedico = async (id_medico) => {

        const [medicos] = await db.query(
            `SELECT
                id_medico,
                valor_consulta
            FROM medicos
            WHERE id_medico = ?`,
            [id_medico]
        );

        return medicos[0] ?? null;
    };

    obtenerObraSocial = async (id_obra_social) => {

        const [obras] = await db.query(
            `SELECT
                id_obra_social,
                porcentaje_descuento,
                es_particular
            FROM obras_sociales
            WHERE id_obra_social = ?`,
            [id_obra_social]
        );

        return obras[0] ?? null;
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

    esTurnoDeMedico = async (
        id_usuario_medico,
        id_turno
    ) => {

        const sql = `
            SELECT 1
            FROM turnos_reservas tr
            INNER JOIN medicos m
                ON tr.id_medico = m.id_medico
            WHERE m.id_usuario = ?
            AND tr.id_turno_reserva = ?
            AND tr.activo = 1
            LIMIT 1
        `;

        const [resultado] = await db.query(
            sql,
            [
                id_usuario_medico,
                id_turno
            ]
        );

        return resultado.length > 0;
    };
}