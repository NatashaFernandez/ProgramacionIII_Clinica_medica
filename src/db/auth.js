import db from '../configuracion/db.js';

export default class Auth {

    buscarUsuario = async (email, contrasenia) => {

        const [resultado] = await db.query(
            `SELECT
                id_usuario,
                documento,
                apellido,
                nombres,
                email,
                foto_path,
                rol
            FROM usuarios
            WHERE email = ?
            AND contrasenia = SHA2(?, 256)
            AND activo = 1`,
            [email, contrasenia]
        );

        return resultado[0];
    };

}