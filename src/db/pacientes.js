import db from '../configuracion/db.js';

export default class Pacientes {

    buscarTodos = async () => {

        const sql = `
            SELECT *
            FROM v_pacientes
        `;

        const [pacientes] = await db.query(sql);

        return pacientes;
    };

    buscarPorId = async (id) => {

        const sql = `
            SELECT *
            FROM v_pacientes
            WHERE id_paciente = ?
        `;

        const [pacientes] = await db.query(sql, [id]);

        return pacientes[0] ?? null;
    };

    obtenerIdUsuario = async (id_paciente) => {

        const [paciente] = await db.query(
            `SELECT id_usuario
             FROM pacientes
             WHERE id_paciente = ?`,
            [id_paciente]
        );

        return paciente[0] ?? null;
    };

    existeObraSocial = async (id_obra_social) => {

        const [obra] = await db.query(
            `SELECT id_obra_social
             FROM obras_sociales
             WHERE id_obra_social = ?`,
            [id_obra_social]
        );

        return obra.length > 0;
    };

    obtenerIdMedicoPorUsuario = async (id_usuario) => {

        const [medicos] = await db.query(
            `
            SELECT id_medico
            FROM medicos
            WHERE id_usuario = ?
            `,
            [id_usuario]
        );

        return medicos[0] ?? null;
    };

    esPacienteDeMedico = async (
        id_usuario_medico,
        id_paciente
    ) => {

        const sql = `
            SELECT 1
            FROM turnos_reservas tr
            INNER JOIN medicos m
                ON tr.id_medico = m.id_medico
            WHERE m.id_usuario = ?
            AND tr.id_paciente = ?
            AND tr.activo = 1
            LIMIT 1
        `;

        const [resultado] = await db.query(
            sql,
            [
                id_usuario_medico,
                id_paciente
            ]
        );

        return resultado.length > 0;
    };

    buscarPorMedicoUsuario = async (id_usuario_medico) => {

        const sql = `
            SELECT DISTINCT vp.*
            FROM v_pacientes vp
            INNER JOIN turnos_reservas tr
                ON vp.id_paciente = tr.id_paciente
            INNER JOIN medicos m
                ON tr.id_medico = m.id_medico
            WHERE m.id_usuario = ?
            AND tr.activo = 1
        `;

        const [pacientes] = await db.query(
            sql,
            [id_usuario_medico]
        );

        return pacientes;
    };
}