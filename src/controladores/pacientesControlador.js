import db from '../configuracion/db.js';
import bcrypt from 'bcrypt';

/*  LISTAR PACIENTES */
export const listarPacientes = async (req, res) => {
    try {

        const [results] = await db.query(
            `SELECT * FROM v_pacientes`
        );

        return res.status(200).json(results);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

/*  OBTENER PACIENTE POR ID */
export const obtenerPaciente = async (req, res) => {
    try {

        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({
                mensaje: 'ID inválido'
            });
        }

        const [results] = await db.query(
            `SELECT *
             FROM v_pacientes
             WHERE id_paciente = ?`,
            [id]
        );

        if (results.length === 0) {
            return res.status(404).json({
                mensaje: 'Paciente no encontrado'
            });
        }

        return res.status(200).json(results[0]);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

/*  AGREGAR PACIENTE
    (usuario + paciente en transacción) */
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

        if (!documento || !apellido || !nombres || !email || !contrasenia) {
            return res.status(400).json({
                mensaje: 'Faltan campos obligatorios'
            });
        }

        await connection.beginTransaction();

        // verificar email duplicado
        const [existe] = await connection.query(
            `SELECT id_usuario FROM usuarios WHERE email = ?`,
            [email]
        );

        if (existe.length > 0) {
            await connection.rollback();

            return res.status(409).json({
                mensaje: 'Ya existe un usuario con ese email'
            });
        }

        const hash = await bcrypt.hash(contrasenia, 10);

        // crear usuario
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
                2, // PACIENTE
                1
            ]
        );

        // crear paciente
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

        // devolver vista completa
        const [result] = await connection.query(
            `SELECT *
             FROM v_pacientes
             WHERE id_paciente = ?`,
            [paciente.insertId]
        );

        return res.status(201).json({
            mensaje: 'Paciente creado correctamente',
            paciente: result[0]
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

/*  ACTUALIZAR PACIENTE
   (usuarios + pacientes) */
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

        await connection.beginTransaction();

        const [paciente] = await connection.query(
            `SELECT id_usuario
             FROM pacientes
             WHERE id_paciente = ?`,
            [id]
        );

        if (paciente.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                mensaje: 'Paciente no encontrado'
            });
        }

        const id_usuario = paciente[0].id_usuario;

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
                id_usuario
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

        const [result] = await connection.query(
            `SELECT *
             FROM v_pacientes
             WHERE id_paciente = ?`,
            [id]
        );

        return res.status(200).json({
            mensaje: 'Paciente actualizado correctamente',
            paciente: result[0]
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

/*  ELIMINAR PACIENTE
   -> desactiva usuario  */
export const eliminarPaciente = async (req, res) => {
    try {

        const { id } = req.params;

        const [paciente] = await db.query(
            `SELECT id_usuario
             FROM pacientes
             WHERE id_paciente = ?`,
            [id]
        );

        if (paciente.length === 0) {
            return res.status(404).json({
                mensaje: 'Paciente no encontrado'
            });
        }

        await db.query(
            `UPDATE usuarios
             SET activo = 0
             WHERE id_usuario = ?`,
            [paciente[0].id_usuario]
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