import jwt from 'jsonwebtoken';
import Auth from '../db/auth.js';
import { roles_map } from "../configuracion/permisos.js";

export default class AuthServicio {

    constructor() {
        this.auth = new Auth();
    }

    login = async (email, contrasenia) => {

        const usuario = await this.auth.buscarUsuario(
            email,
            contrasenia
        );

        if (!usuario) {
            return null;
        }

        const rolLabel = roles_map[usuario.rol];


        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                email: usuario.email,
                rol: usuario.rol,
                rolLabel
            },
            process.env.CLAVE_JWT || 'clave_secreta_por_defecto',
            {
                expiresIn: '4h'
            }
        );

        return {
            id: usuario.id_usuario,
            nombres: usuario.nombres,
            apellido: usuario.apellido,
            foto_path: usuario.foto_path,
            documento: usuario.documento,
            email: usuario.email,
            rol: usuario.rol,
            rolLabel,
            token,
            expiresIn: +new Date(
                Date.now() + 4 * 60 * 60 * 1000
            )
        };

    };

}