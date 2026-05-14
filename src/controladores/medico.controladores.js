import db from '../configuracion/db.js';

// B - Browse: Listar todos los médicos
export const listarMedicos = async (req, res) => {
    try {

        const [results] = await db.query(`
            SELECT 
                m.id_medico,
                m.matricula,
                m.descripcion,
                m.valor_consulta,
                e.nombre AS especialidad,
                u.apellido,
                u.nombres,
                u.email
            FROM medicos m
            INNER JOIN especialidades e 
                ON m.id_especialidad = e.id_especialidad
            INNER JOIN usuarios u
                ON m.id_usuario = u.id_usuario
            WHERE u.activo = 1
        `);

        res.status(200).json(results);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }
};

// R - Read: Obtener médico por ID
export const obtenerMedico = async (req, res) => {

    try {

        const { id } = req.params;

        const [results] = await db.query(`
            SELECT 
                m.id_medico,
                m.matricula,
                m.descripcion,
                m.valor_consulta,
                e.nombre AS especialidad,
                u.apellido,
                u.nombres,
                u.email
            FROM medicos m
            INNER JOIN especialidades e 
                ON m.id_especialidad = e.id_especialidad
            INNER JOIN usuarios u
                ON m.id_usuario = u.id_usuario
            WHERE m.id_medico = ?
            AND u.activo = 1
        `, [id]);

        if (results.length === 0) {
            return res.status(404).json({
                mensaje: 'Médico no encontrado'
            });
        }

        res.status(200).json(results[0]);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};

// A - Add: Agregar médico
export const agregarMedico = async (req, res) => {

    try {

        const {
            id_usuario,
            id_especialidad,
            matricula,
            descripcion,
            valor_consulta
        } = req.body;

        const [results] = await db.query(`
            INSERT INTO medicos
            (
                id_usuario,
                id_especialidad,
                matricula,
                descripcion,
                valor_consulta
            )
            VALUES (?, ?, ?, ?, ?)
        `, [
            id_usuario,
            id_especialidad,
            matricula,
            descripcion,
            valor_consulta
        ]);

        res.status(201).json({
            mensaje: 'Médico agregado correctamente',
            id: results.insertId
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};

// E - Edit: Actualizar médico
export const actualizarMedico = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            id_especialidad,
            matricula,
            descripcion,
            valor_consulta
        } = req.body;

        await db.query(`
            UPDATE medicos
            SET
                id_especialidad = ?,
                matricula = ?,
                descripcion = ?,
                valor_consulta = ?
            WHERE id_medico = ?
        `, [
            id_especialidad,
            matricula,
            descripcion,
            valor_consulta,
            id
        ]);

        res.status(200).json({
            mensaje: 'Médico actualizado correctamente'
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};

// D - Delete: Borrado lógico
export const eliminarMedico = async (req, res) => {

    try {

        const { id } = req.params;

        await db.query(`
            UPDATE usuarios u
            INNER JOIN medicos m
                ON u.id_usuario = m.id_usuario
            SET u.activo = 0
            WHERE m.id_medico = ?
        `, [id]);

        res.status(202).json({
            mensaje: 'Médico eliminado correctamente'
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};
