import db from '../configuracion/db.js';

export const listarObrasSociales = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM obras_sociales WHERE activo = 1');
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const obtenerObraSocial = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await db.query('SELECT * FROM obras_sociales WHERE id_obra_social = ? AND activo = 1', [id]);
        if (results.length === 0) {
            return res.status(404).json({ mensaje: 'Obra social no encontrada' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const agregarObraSocial = async (req, res) => {
    try {
        const { nombre, descripcion, porcentaje_descuento, es_particular } = req.body;
        const [results] = await db.query(
            'INSERT INTO obras_sociales (nombre, descripcion, porcentaje_descuento, es_particular) VALUES (?, ?, ?, ?)',
            [nombre, descripcion, porcentaje_descuento, es_particular || 0]
        );
        res.status(201).json({ mensaje: 'Obra social agregada con éxito', id: results.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const actualizarObraSocial = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, porcentaje_descuento, es_particular } = req.body;
        await db.query(
            'UPDATE obras_sociales SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ? WHERE id_obra_social = ?',
            [nombre, descripcion, porcentaje_descuento, es_particular, id]
        );
        res.status(200).json({ mensaje: 'Obra social actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const eliminarObraSocial = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ?', [id]);
        res.status(202).json({ mensaje: 'Obra social eliminada (desactivada)' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};