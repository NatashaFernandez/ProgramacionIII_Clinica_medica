import db from '../configuracion/db.js';

// B - Browse: Listar todas
export const listarEspecialidades = async (req, res) => {
    try {

        const [results] = await db.query(
            'SELECT * FROM especialidades WHERE activo = 1'
        );

        res.status(200).json(results);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

// R - Read: Obtener una sola por ID
export const obtenerEspecialidad = async (req, res) => {
    try {

        const { id } = req.params;

        const [results] = await db.query(
            'SELECT * FROM especialidades WHERE id_especialidad = ? AND activo = 1',
            [id]
        );

        if (results.length === 0) {

            return res.status(404).json({
                mensaje: 'Especialidad no encontrada'
            });

        }

        res.status(200).json(results[0]);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

// E - Edit: Actualizar datos
export const actualizarEspecialidad = async (req, res) => {
    try {

        const { id } = req.params;
        const { nombre } = req.body;

        await db.query(
            'UPDATE especialidades SET nombre = ? WHERE id_especialidad = ?',
            [nombre, id]
        );

        const [especialidad] = await db.query(
            'SELECT * FROM especialidades WHERE id_especialidad = ?',
            [id]
        );

        res.status(200).json({
            mensaje: 'Especialidad actualizada correctamente',
            especialidad: especialidad[0]
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

// A - Add: Agregar una
export const agregarEspecialidad = async (req, res) => {
    try {

        const { nombre } = req.body;

        const [results] = await db.query(
            'INSERT INTO especialidades (nombre) VALUES (?)',
            [nombre]
        );

        const [especialidad] = await db.query(
            'SELECT * FROM especialidades WHERE id_especialidad = ?',
            [results.insertId]
        );

        res.status(201).json({
            mensaje: 'Especialidad agregada con éxito',
            especialidad: especialidad[0]
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

// D - Delete: Borrado lógico
export const eliminarEspecialidad = async (req, res) => {
    try {

        const { id } = req.params;

        await db.query(
            'UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?',
            [id]
        );

        res.status(202).json({
            mensaje: 'Especialidad eliminada (desactivada)',
            id_especialidad: id
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};