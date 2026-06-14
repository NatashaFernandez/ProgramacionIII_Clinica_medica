import db from '../configuracion/db.js';

export default class Usuarios {

    buscarTodos = async () => {

        const [usuarios] = await db.query(
            `SELECT
                id_usuario,
                documento,
                apellido,
                nombres,
                email,
                foto_path,
                rol,
                activo
             FROM usuarios
             WHERE activo = 1`
        );

        return usuarios;
    };

    buscarPorId = async (id) => {

        const [usuarios] = await db.query(
            `SELECT
                id_usuario,
                documento,
                apellido,
                nombres,
                email,
                foto_path,
                rol,
                activo
             FROM usuarios
             WHERE id_usuario = ?
             AND activo = 1`,
            [id]
        );

        return usuarios[0] ?? null;
    };

    buscarPorEmail = async (email) => {

        const [usuarios] = await db.query(
            `SELECT *
             FROM usuarios
             WHERE email = ?`,
            [email]
        );

        return usuarios[0] ?? null;
    };

    desactivar = async (id) => {

        const [resultado] = await db.query(
            `UPDATE usuarios
             SET activo = 0
             WHERE id_usuario = ?`,
            [id]
        );

        return resultado.affectedRows > 0;
    };

}