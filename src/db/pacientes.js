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

}