import db from '../configuracion/db.js';

export default class Medicos {

    buscarTodos = async () => {

        const sql = `
            SELECT
                m.id_medico,
                m.id_usuario,
                u.apellido,
                u.nombres,
                u.email,
                u.foto_path,
                e.id_especialidad,
                e.nombre AS especialidad,
                m.matricula,
                m.descripcion,
                m.valor_consulta
            FROM medicos m
            INNER JOIN usuarios u
                ON m.id_usuario = u.id_usuario
            INNER JOIN especialidades e
                ON m.id_especialidad = e.id_especialidad
            WHERE u.activo = 1
        `;

        const [medicos] = await db.query(sql);
        return medicos;
    };

    buscarPorId = async (id_medico) => {

        const sql = `
            SELECT
                m.id_medico,
                m.id_usuario,
                u.apellido,
                u.nombres,
                u.email,
                u.foto_path,
                e.id_especialidad,
                e.nombre AS especialidad,
                m.matricula,
                m.descripcion,
                m.valor_consulta
            FROM medicos m
            INNER JOIN usuarios u
                ON m.id_usuario = u.id_usuario
            INNER JOIN especialidades e
                ON m.id_especialidad = e.id_especialidad
            WHERE m.id_medico = ?
              AND u.activo = 1
        `;

        const [medico] = await db.query(sql, [id_medico]);

        return medico[0];
    };

    buscarPorEspecialidad = async (id_especialidad) => {

        const sql = `
            SELECT
                m.id_medico,
                m.id_usuario,
                u.apellido,
                u.nombres,
                u.email,
                u.foto_path,
                e.id_especialidad,
                e.nombre AS especialidad,
                m.matricula,
                m.descripcion,
                m.valor_consulta
            FROM medicos m
            INNER JOIN usuarios u
                ON m.id_usuario = u.id_usuario
            INNER JOIN especialidades e
                ON m.id_especialidad = e.id_especialidad
            WHERE e.id_especialidad = ?
            AND u.activo = 1
        `;

        const [medicos] = await db.query(
            sql,
            [id_especialidad]
        );

        return medicos;
    };


    buscarObrasSociales = async (id_medico) => {

        const sql = `
            SELECT
                os.id_obra_social,
                os.nombre,
                os.descripcion,
                os.porcentaje_descuento
            FROM medicos_obras_sociales mos
            INNER JOIN obras_sociales os
                ON mos.id_obra_social = os.id_obra_social
            WHERE mos.id_medico = ?
              AND mos.activo = 1
              AND os.activo = 1
        `;

        const [obras] = await db.query(sql, [id_medico]);

        return obras;
    };

    relacionarConObraSocial = async (id_medico, obras_sociales) => {

        const conexion = await db.getConnection();

        try {

            await conexion.beginTransaction();

            for(const obra of obras_sociales){

                await conexion.query(
                    `
                    INSERT INTO medicos_obras_sociales
                    (
                        id_medico,
                        id_obra_social
                    )
                    VALUES
                    (
                        ?,
                        ?
                    )
                    `,
                    [
                        id_medico,
                        obra.id_obra_social
                    ]
                );
            }

            await conexion.commit();
            conexion.release();

            return true;

        } catch(error){

            await conexion.rollback();
            conexion.release();

            return false;
        }
    };

    actualizarEspecialidad = async (id_medico, id_especialidad) => {

        const sql = `
            UPDATE medicos
            SET id_especialidad = ?
            WHERE id_medico = ?
        `;

        const [resultado] = await db.query(
            sql,
            [id_especialidad, id_medico]
        );

        return resultado.affectedRows > 0;
    };

}
