import db from '../configuracion/db.js';

import Usuarios from '../db/usuarios.js';
import UsuarioRespuestaDTO from '../dto/UsuarioRespuestaDTO.js';

const usuariosDB = new Usuarios();

export const usuariosControlador = {

    /* LISTAR USUARIOS */
    listar: async (req, res) => {

        try {

            const usuarios = await usuariosDB.buscarTodos();

            return res.status(200).json(
                usuarios.map(
                    usuario => new UsuarioRespuestaDTO(usuario)
                )
            );

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                error: 'Error al obtener los usuarios'
            });
        }
    },

    /* OBTENER USUARIO POR ID */
    obtenerPorId: async (req, res) => {

        try {

            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({
                    error: 'ID inválido'
                });
            }

            const usuario = await usuariosDB.buscarPorId(id);

            if (!usuario) {
                return res.status(404).json({
                    error: 'Usuario no encontrado'
                });
            }

            return res.status(200).json(
                new UsuarioRespuestaDTO(usuario)
            );

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                error: 'Error al obtener el usuario'
            });
        }
    },

    /* REGISTRAR USUARIO */
    registrar: async (req, res) => {

        const conexion = await db.getConnection();

        try {

            const {
                documento,
                apellido,
                nombres,
                email,
                contrasenia,
                rol,
                id_obra_social
            } = req.body;

            await conexion.beginTransaction();

            const usuarioExistente =
                await usuariosDB.buscarPorEmail(email);

            if (usuarioExistente) {

                await conexion.rollback();

                return res.status(409).json({
                    error: 'Ya existe un usuario con ese email'
                });
            }

            const [resultadoUsuario] = await conexion.query(
                `INSERT INTO usuarios (
                    documento,
                    apellido,
                    nombres,
                    email,
                    contrasenia,
                    foto_path,
                    rol,
                    activo
                )
                VALUES (
                    ?, ?, ?, ?,
                    SHA2(?, 256),
                    '',
                    ?,
                    1
                )`,
                [
                    documento,
                    apellido,
                    nombres,
                    email,
                    contrasenia,
                    rol
                ]
            );

            const nuevoIdUsuario =
                resultadoUsuario.insertId;

            if (Number(rol) === 2) {

                if (!id_obra_social) {

                    await conexion.rollback();

                    return res.status(400).json({
                        error: 'El campo id_obra_social es obligatorio para pacientes'
                    });
                }

                await conexion.query(
                    `INSERT INTO pacientes (
                        id_usuario,
                        id_obra_social
                    )
                    VALUES (?, ?)`,
                    [
                        nuevoIdUsuario,
                        id_obra_social
                    ]
                );
            }

            await conexion.commit();

            const usuario =
                await usuariosDB.buscarPorId(
                    nuevoIdUsuario
                );

            return res.status(201).json({
                mensaje: 'Usuario registrado con éxito',
                usuario: new UsuarioRespuestaDTO(usuario)
            });

        } catch (error) {

            await conexion.rollback();

            console.error(error);

            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    error: 'El documento o email ya se encuentran registrados'
                });
            }

            return res.status(500).json({
                error: 'Error al registrar el usuario'
            });

        } finally {

            conexion.release();
        }
    },

    /* ACTUALIZAR USUARIO */
    actualizar: async (req, res) => {

        try {

            const { id } = req.params;

            const {
                documento,
                apellido,
                nombres,
                email
            } = req.body;

            const usuario =
                await usuariosDB.buscarPorId(id);

            if (!usuario) {
                return res.status(404).json({
                    error: 'Usuario no encontrado'
                });
            }

            await db.query(
                `UPDATE usuarios
                 SET documento = ?,
                     apellido = ?,
                     nombres = ?,
                     email = ?
                 WHERE id_usuario = ?`,
                [
                    documento,
                    apellido,
                    nombres,
                    email,
                    id
                ]
            );

            const usuarioActualizado =
                await usuariosDB.buscarPorId(id);

            return res.status(200).json({
                mensaje: 'Usuario actualizado con éxito',
                usuario: new UsuarioRespuestaDTO(
                    usuarioActualizado
                )
            });

        } catch (error) {

            console.error(error);

            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    error: 'El documento o email ya están en uso por otro usuario'
                });
            }

            return res.status(500).json({
                error: 'Error al actualizar el usuario'
            });
        }
    },

    /* ELIMINAR (SOFT DELETE) */
    eliminar: async (req, res) => {

        try {

            const { id } = req.params;

            const usuario =
                await usuariosDB.buscarPorId(id);

            if (!usuario) {
                return res.status(404).json({
                    error: 'Usuario no encontrado'
                });
            }

            await usuariosDB.desactivar(id);

            return res.status(200).json({
                mensaje: 'Usuario dado de baja con éxito'
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                error: 'Error al dar de baja el usuario'
            });
        }
    }

};