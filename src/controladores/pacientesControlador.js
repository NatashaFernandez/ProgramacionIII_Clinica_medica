import db from '../configuracion/db.js';
import bcrypt from 'bcrypt';

import Pacientes from '../db/pacientes.js';
import PacienteRespuestaDTO from '../dto/PacienteRespuestaDTO.js';

const pacientesDB = new Pacientes();

/* LISTAR PACIENTES */
export const listarPacientes = async (req, res) => {

    try {

        const pacientes = await pacientesDB.buscarTodos();

        return res.status(200).json(
            pacientes.map(
                paciente => new PacienteRespuestaDTO(paciente)
            )
        );

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

/* OBTENER PACIENTE */
export const obtenerPaciente = async (req, res) => {

    try {

        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({
                mensaje: 'ID inválido'
            });
        }

        const paciente = await pacientesDB.buscarPorId(id);

        if (!paciente) {
            return res.status(404).json({
                mensaje: 'Paciente no encontrado'
            });
        }

        return res.status(200).json(
            new PacienteRespuestaDTO(paciente)
        );

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

/* AGREGAR PACIENTE */
export const agregarPaciente = async (req, res) => {

    const connection = await db.getConnection();

    try {

        const {
            documento,
            apellido,
            nombres,
            email,
            contrasenia,
            foto_path,
            id_obra_social
        } = req.body;

        if (
            !documento ||
            !apellido ||
            !nombres ||
            !email ||
            !contrasenia
        ) {
            return res.status(400).json({
                mensaje: 'Faltan campos obligatorios'
            });
        }

        if (id_obra_social) {

            const existe =
                await pacientesDB.existeObraSocial(id_obra_social);

            if (!existe) {
                return res.status(400).json({
                    mensaje: 'La obra social no existe'
                });
            }
        }

        await connection.beginTransaction();

        const [usuarioExistente] = await connection.query(
            `SELECT id_usuario
             FROM usuarios
             WHERE email = ?`,
            [email]
        );

        if (usuarioExistente.length > 0) {

            await connection.rollback();

            return res.status(409).json({
                mensaje: 'Ya existe un usuario con ese email'
            });
        }

        const hash = await bcrypt.hash(contrasenia, 10);

        const [usuario] = await connection.query(
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
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                documento,
                apellido,
                nombres,
                email,
                hash,
                foto_path ?? null,
                2,
                1
            ]
        );

        const [paciente] = await connection.query(
            `INSERT INTO pacientes (
                id_usuario,
                id_obra_social
            )
            VALUES (?, ?)`,
            [
                usuario.insertId,
                id_obra_social ?? null
            ]
        );

        await connection.commit();

        const pacienteCreado =
            await pacientesDB.buscarPorId(
                paciente.insertId
            );

        return res.status(201).json({
            mensaje: 'Paciente creado correctamente',
            paciente: new PacienteRespuestaDTO(
                pacienteCreado
            )
        });

    } catch (error) {

        await connection.rollback();

        console.error(error);

        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });

    } finally {

        connection.release();
    }
};

/* ACTUALIZAR PACIENTE */
export const actualizarPaciente = async (req, res) => {

    const connection = await db.getConnection();

    try {

        const { id } = req.params;

        const {
            documento,
            apellido,
            nombres,
            email,
            foto_path,
            id_obra_social
        } = req.body;

        if (id_obra_social) {

            const existe =
                await pacientesDB.existeObraSocial(id_obra_social);

            if (!existe) {
                return res.status(400).json({
                    mensaje: 'La obra social no existe'
                });
            }
        }

        await connection.beginTransaction();

        const paciente =
            await pacientesDB.obtenerIdUsuario(id);

        if (!paciente) {

            await connection.rollback();

            return res.status(404).json({
                mensaje: 'Paciente no encontrado'
            });
        }

        await connection.query(
            `UPDATE usuarios
             SET documento = ?,
                 apellido = ?,
                 nombres = ?,
                 email = ?,
                 foto_path = ?
             WHERE id_usuario = ?`,
            [
                documento,
                apellido,
                nombres,
                email,
                foto_path ?? null,
                paciente.id_usuario
            ]
        );

        await connection.query(
            `UPDATE pacientes
             SET id_obra_social = ?
             WHERE id_paciente = ?`,
            [
                id_obra_social ?? null,
                id
            ]
        );

        await connection.commit();

        const actualizado =
            await pacientesDB.buscarPorId(id);

        return res.status(200).json({
            mensaje: 'Paciente actualizado correctamente',
            paciente: new PacienteRespuestaDTO(
                actualizado
            )
        });

    } catch (error) {

        await connection.rollback();

        console.error(error);

        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });

    } finally {

        connection.release();
    }
};

/* ELIMINAR PACIENTE */
export const eliminarPaciente = async (req, res) => {

    try {

        const { id } = req.params;

        const paciente =
            await pacientesDB.obtenerIdUsuario(id);

        if (!paciente) {
            return res.status(404).json({
                mensaje: 'Paciente no encontrado'
            });
        }

        await db.query(
            `UPDATE usuarios
             SET activo = 0
             WHERE id_usuario = ?`,
            [paciente.id_usuario]
        );

        return res.status(200).json({
            mensaje: 'Paciente desactivado correctamente'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};